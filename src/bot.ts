import { Bot, BotConfig, Context } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { kv } from '@vercel/kv';

import { mainKeyboard } from './keyboard';
import { handleError } from './handle-error';
import { handleGetRandomVerse } from './get-verse/handle-get-random-verse';

import { ApiEnv, Book, Command, Env } from './types';
import {
  DAILY_VERSE_KEY,
  DAILY_VERSE_TEST_KEY,
  SANDWICH_KEY,
  SANDWICH_TEST_KEY,
} from './constants';
import {
  START_MESSAGE,
  HELP_MESSAGE,
  START_DAILY_MESSAGE,
  STOP_DAILY_MESSAGE,
  START_SANDWICH_MESSAGE,
  STOP_SANDWICH_MESSAGE,
  INITIAL_SET_BOOKMARK_MESSAGE,
  GET_RANDOM_VERSE_MESSAGE,
  GET_RANDOM_BG_VERSE_MESSAGE,
  GET_RANDOM_SB_VERSE_MESSAGE,
  GET_RANDOM_CC_VERSE_MESSAGE,
} from './constants/messages';
import { setBookmark } from './bookmark/set-bookmark';

const { BOT_TOKEN: token = '', ENV: env } = process.env;
const dailyVerseKey = env === Env.Prod ? DAILY_VERSE_KEY : DAILY_VERSE_TEST_KEY;
const sandwichKey = env === Env.Prod ? SANDWICH_KEY : SANDWICH_TEST_KEY;
const botConfig: BotConfig<Context> = {
  client: { environment: env === Env.Prod ? ApiEnv.Prod : ApiEnv.Test },
};

export const bot = new Bot(token, botConfig);

bot.api.config.use(autoRetry());

bot.hears(GET_RANDOM_VERSE_MESSAGE, handleGetRandomVerse());
bot.hears(GET_RANDOM_BG_VERSE_MESSAGE, handleGetRandomVerse(Book.BG));
bot.hears(GET_RANDOM_SB_VERSE_MESSAGE, handleGetRandomVerse(Book.SB));
bot.hears(GET_RANDOM_CC_VERSE_MESSAGE, handleGetRandomVerse(Book.CC));

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

${INITIAL_SET_BOOKMARK_MESSAGE}`,
      {
        parse_mode: 'Markdown',
        reply_markup: { force_reply: true },
      },
    );
  } catch (error) {
    handleError(error, ctx);
  }
});

bot
  .on('::url')
  .filter(
    (ctx) =>
      Boolean(
        ctx.message?.reply_to_message?.text?.match(/^#(bg|sb|cc) #bookmark/),
      ),
    setBookmark,
  );
