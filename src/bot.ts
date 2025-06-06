import { Bot, BotConfig, Middleware, Context } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { kv } from '@vercel/kv';

import { ApiEnv, Book, Command, Env, ErrorCode } from './types';
import {
  DAILY_VERSE_KEY,
  DAILY_VERSE_TEST_KEY,
  ERROR_MESSAGE,
  HELP_MESSAGE,
  LIBRARY_BASE_URL,
  SANDWICH_KEY,
  SANDWICH_TEST_KEY,
  SET_BOOKMARK_MESSAGE,
  START_DAILY_MESSAGE,
  START_MESSAGE,
  START_SANDWICH_MESSAGE,
  STOP_DAILY_MESSAGE,
  STOP_SANDWICH_MESSAGE,
} from './constants';
import {
  mainKeyboard,
  randomBGVerseMessageText,
  randomCCVerseMessageText,
  randomSBVerseMessageText,
  randomVerseMessageText,
} from './keyboard';
import { getRandomVerseMessage } from './get-verse-message';
import { VERSES_BY_BOOK } from './book-constants';

const { BOT_TOKEN: token = '', ENV: env } = process.env;
const dailyVerseKey = env === Env.Prod ? DAILY_VERSE_KEY : DAILY_VERSE_TEST_KEY;
const sandwichKey = env === Env.Prod ? SANDWICH_KEY : SANDWICH_TEST_KEY;
const botConfig: BotConfig<Context> = {
  client: { environment: env === Env.Prod ? ApiEnv.Prod : ApiEnv.Test },
};

export const bot = new Bot(token, botConfig);

bot.api.config.use(autoRetry());

const handleError = (error: unknown, ctx: Context) => {
  let code = ErrorCode.Unknown;

  if (error instanceof Error) {
    code = error.message as ErrorCode;
  }

  const message = ERROR_MESSAGE[code];

  ctx.reply(message, { parse_mode: 'Markdown' });

  console.error(error);
};

const handleGetRandomVerse: (from?: Book) => Middleware<Context> =
  (from) => async (ctx) => {
    const message = getRandomVerseMessage(from);

    ctx.reply(message, {
      reply_markup: mainKeyboard,
      parse_mode: 'Markdown',
    });
  };

bot.hears(randomVerseMessageText, handleGetRandomVerse());
bot.hears(randomBGVerseMessageText, handleGetRandomVerse(Book.BG));
bot.hears(randomSBVerseMessageText, handleGetRandomVerse(Book.SB));
bot.hears(randomCCVerseMessageText, handleGetRandomVerse(Book.CC));

bot.command(Command.Start, (ctx) => {
  ctx.reply(START_MESSAGE, {
    reply_markup: mainKeyboard,
  });
});

bot.command(Command.Help, (ctx) => {
  ctx.reply(HELP_MESSAGE, {
    reply_markup: mainKeyboard,
  });
});

bot.command(Command.StartDaily, async (ctx) => {
  try {
    await kv.hset(dailyVerseKey, { [String(ctx.chatId)]: '' });
    await ctx.reply(START_DAILY_MESSAGE);
  } catch (error) {
    console.error(error);
  }
});

bot.command(Command.StopDaily, async (ctx) => {
  try {
    await kv.hdel(dailyVerseKey, String(ctx.chatId));
    await ctx.reply(STOP_DAILY_MESSAGE);
  } catch (error) {
    console.error(error);
  }
});

bot.command(Command.StartSandwich, async (ctx) => {
  try {
    const initialData = JSON.stringify({
      [Book.SB]: 0,
      [Book.BG]: 0,
      [Book.CC]: 0,
    });

    await kv.hset(sandwichKey, {
      [ctx.chatId]: initialData,
    });
    await ctx.reply(START_SANDWICH_MESSAGE);
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.command(Command.StopSandwich, async (ctx) => {
  try {
    await kv.hdel(sandwichKey, String(ctx.chatId));
    await ctx.reply(STOP_SANDWICH_MESSAGE);
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.callbackQuery(/bookmark/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery();
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });

    const [book, action] = ctx.callbackQuery.data.split('-');
    ctx.reply(
      `#${book} #${action}

${SET_BOOKMARK_MESSAGE}`,
      {
        parse_mode: 'Markdown',
        reply_markup: { force_reply: true },
      },
    );
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.on('::url').filter(
  (ctx) =>
    Boolean(
      ctx.message?.reply_to_message?.text?.match(/^#(bg|sb|cc) #bookmark/),
    ),
  async (ctx) => {
    try {
      const sandwichData: Record<string, number> | null = await kv.hget(
        sandwichKey,
        String(ctx.chatId),
      );

      if (!sandwichData) {
        throw new Error(ErrorCode.NoSandwichData);
      }

      const url = new URL(ctx.entities('url')[0].text);
      const libraryUrl = new URL(LIBRARY_BASE_URL);

      if (url.hostname !== libraryUrl.hostname) {
        throw new Error(ErrorCode.UnsupportedLibraryHostname);
      }

      const bookmarkTarget = ctx.message?.reply_to_message?.text
        ?.match(/^#(bg|sb|cc)/)?.[0]
        .replace('#', '');

      const [_, __, urlBook, ...versePathParts] = url.pathname
        .split('/')
        .filter(Boolean);
      const book = bookmarkTarget as Book;

      if (bookmarkTarget !== urlBook) {
        throw new Error(ErrorCode.InvalidBookmarkTarget);
      }

      const versePath = versePathParts.join('.');
      const bookmarkedVerseIndex = VERSES_BY_BOOK[book].indexOf(versePath);
      const newSandwichData = JSON.stringify({
        ...sandwichData,
        [book]: bookmarkedVerseIndex + 1,
      });

      await kv.hset(sandwichKey, { [ctx.chatId]: newSandwichData });
      await ctx.reply('Отлично! Завтра пришлю следующий стих');
    } catch (error) {
      handleError(error, ctx);
    }
  },
);
