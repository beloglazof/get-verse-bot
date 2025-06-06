import { Bot, BotConfig, Middleware, Context } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { kv } from '@vercel/kv';
import { waitUntil } from '@vercel/functions';

import { ApiEnv, Book, Command, Env } from './types';
import {
  DAILY_VERSE_KEY,
  DAILY_VERSE_TEST_KEY,
  LIBRARY_BASE_URL,
  SANDWICH_KEY,
  SANDWICH_TEST_KEY,
} from './constants';
import {
  mainKeyboard,
  randomBGVerseMessageText,
  randomCCVerseMessageText,
  randomSBVerseMessageText,
  randomVerseMessageText,
} from './keyboard';
import { getRandomVerseMessage } from './get-verse-message';
import { BOOK_TITLE, VERSES_BY_BOOK } from './book-constants';

const { BOT_TOKEN: token = '', ENV: env } = process.env;
const dailyVerseKey = env === Env.Prod ? DAILY_VERSE_KEY : DAILY_VERSE_TEST_KEY;
const sandwichKey = env === Env.Prod ? SANDWICH_KEY : SANDWICH_TEST_KEY;
const botConfig: BotConfig<Context> = {
  client: { environment: env === Env.Prod ? ApiEnv.Prod : ApiEnv.Test },
};

export const bot = new Bot(token, botConfig);

bot.api.config.use(autoRetry());

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
  ctx.reply(
    `Привет! Чтобы получить случайный стих, нажмите на одну из кнопок`,
    {
      reply_markup: mainKeyboard,
    },
  );
});

bot.command(Command.Help, (ctx) => {
  ctx.reply(
    `Нажмите на одну из кнопок, чтобы получить случайный стих.
  
Если бот ведет себя странно, напишите мне - @Beloglazof`,
    {
      reply_markup: mainKeyboard,
    },
  );
});

bot.command(Command.StartDaily, (ctx) => {
  try {
    waitUntil(kv.hset(dailyVerseKey, { [String(ctx.chatId)]: '' }));
    ctx.reply('Я буду присылать Вам стих каждый день в 11:00 по МСК');
  } catch (error) {
    console.error(error);
  }
});

bot.command(Command.StopDaily, (ctx) => {
  try {
    waitUntil(kv.hdel(dailyVerseKey, String(ctx.chatId)));
    ctx.reply('Больше никаких ежедневных стихов');
  } catch (error) {
    console.error(error);
  }
});

bot.command(Command.StartSandwich, (ctx) => {
  try {
    const initialData = JSON.stringify({
      [Book.SB]: 0,
      [Book.BG]: 0,
      [Book.CC]: 0,
    });

    waitUntil(
      kv.hset(`${sandwichKey}`, {
        [ctx.chatId]: initialData,
      }),
    );
    ctx.reply(
      'Я буду присылать каждый день по стиху из Шримад-Бхагаватам, Чайтанья-Чаритамриты и Бхагавад-гиты. С самого первого стиха и до конца. Утром, днем и вечером.',
    );
  } catch (error) {
    console.error(error);
  }
});

bot.command(Command.StopSandwich, (ctx) => {
  try {
    waitUntil(kv.hdel(sandwichKey, String(ctx.chatId)));
    ctx.reply('Хорошо! Больше не будет ежедневного "сэндвича"');
  } catch (error) {
    console.error(error);
  }
});

bot.callbackQuery(/bookmark/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery();
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });

    const [book, action] = ctx.callbackQuery.data.split('-');
    ctx.reply(
      `#${book} #${action}

Отправьте мне ссылку с [vedabase.io](${LIBRARY_BASE_URL}) на стих на котором Вы остановились`,
      {
        parse_mode: 'Markdown',
        reply_markup: { force_reply: true },
      },
    );
  } catch (error) {
    console.error(error);
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
        throw new Error(
          `Вы не подписаны на "сэндвич". 

Чтобы получать по порядку стихи из Бхагавад-гиты, Шримад-Бхагаватам и Шри Чайтанья-чаритамриты используйте команду /${Command.StartSandwich}`,
        );
      }

      const url = new URL(ctx.entities('url')[0].text);
      const libraryUrl = new URL(LIBRARY_BASE_URL);

      if (url.hostname !== libraryUrl.hostname) {
        throw new Error(`Я умею работать только с ссылками на [vedabase.io](${LIBRARY_BASE_URL}).

Чтобы поставить закладку, отправьте ссылку с этого сайта ответом на сообщение с хэштегом #bookmark`);
      }

      const bookmarkTarget = ctx.message?.reply_to_message?.text
        ?.match(/^#(bg|sb|cc)/)?.[0]
        .replace('#', '');

      const [_, __, urlBook, ...versePathParts] = url.pathname
        .split('/')
        .filter(Boolean);
      const book = bookmarkTarget as Book;

      if (bookmarkTarget !== urlBook) {
        throw new Error(`Вы отправили ссылку не на ту книгу.

Чтобы поставить закладку, отправьте ссылку из книги ${BOOK_TITLE[book]} ответом на сообщение с хэштегом #bookmark`);
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
      if (error instanceof Error) {
        ctx.reply(error.message, { parse_mode: 'Markdown' });
      } else {
        ctx.reply('Что-то пошло не так 😔');
      }
      console.error(error);
    }
  },
);
