import { Bot, BotConfig, Context, Middleware } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { kv } from '@vercel/kv';
import { waitUntil } from '@vercel/functions';

import { ApiEnv, Book, Command, Env } from './types';
import {
  DAILY_VERSE_KEY,
  DAILY_VERSE_TEST_KEY,
  SANDWICH_KEY,
  SANDWICH_TEST_KEY,
} from './constants';
import {
  keyboard,
  randomBGVerseMessageText,
  randomCCVerseMessageText,
  randomSBVerseMessageText,
  randomVerseMessageText,
} from './keyboard';
import { getRandomVerseMessage } from './get-verse-message';

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
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    });
  };

bot.command(Command.Start, (ctx) => {
  ctx.reply(
    `Привет! Чтобы получить случайный стих, нажмите на одну из кнопок`,
    {
      reply_markup: keyboard,
    },
  );
});

bot.command(Command.Help, (ctx) => {
  ctx.reply(
    `Нажмите на одну из кнопок, чтобы получить случайный стих.
  
Если бот ведет себя странно, напишите мне - @Beloglazof`,
    {
      reply_markup: keyboard,
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
    ctx.reply('Хорошо! Больше не будет ежедневного сэндвича');
  } catch (error) {
    console.error(error);
  }
});

bot.hears(randomVerseMessageText, handleGetRandomVerse());
bot.hears(randomBGVerseMessageText, handleGetRandomVerse(Book.BG));
bot.hears(randomSBVerseMessageText, handleGetRandomVerse(Book.SB));
bot.hears(randomCCVerseMessageText, handleGetRandomVerse(Book.CC));
