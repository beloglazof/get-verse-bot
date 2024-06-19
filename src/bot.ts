import { Bot, BotConfig, Context, Middleware } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { kv } from '@vercel/kv';
import { waitUntil } from '@vercel/functions';

import { ApiEnv, Book, Env } from './types';
import { DAILY_VERSE_KEY, DAILY_VERSE_TEST_KEY } from './constants';
import {
  keyboard,
  randomBGVerseMessageText,
  randomCCVerseMessageText,
  randomSBVerseMessageText,
  randomVerseMessageText,
} from './keyboard';
import { getVerseMessage } from './get-verse-message';

const { BOT_TOKEN: token = '', ENV: env } = process.env;
const dailyVerseKey = env === Env.Prod ? DAILY_VERSE_KEY : DAILY_VERSE_TEST_KEY;
const botConfig: BotConfig<Context> = {
  client: { environment: env === Env.Prod ? ApiEnv.Prod : ApiEnv.Test },
};

export const bot = new Bot(token, botConfig);

bot.api.config.use(autoRetry());

const handleGetVerse: (from?: Book) => Middleware<Context> =
  (from) => async (ctx) => {
    const message = await getVerseMessage(from);

    ctx.reply(message, {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    });
  };

bot.command('start', (ctx) => {
  ctx.reply(
    `Привет! Чтобы получить случайный стих, нажмите на одну из кнопок`,
    {
      reply_markup: keyboard,
    },
  );
});

bot.command('help', (ctx) => {
  ctx.reply(
    `Нажмите на одну из кнопок, чтобы получить случайный стих.
  
Если бот ведет себя странно, напишите мне - @Beloglazof`,
    {
      reply_markup: keyboard,
    },
  );
});

bot.command('startdaily', (ctx) => {
  try {
    waitUntil(kv.hset(dailyVerseKey, { [String(ctx.chatId)]: '' }));
    ctx.reply('Я буду присылать Вам стих каждый день в 11:00 по МСК');
  } catch (error) {
    console.error(error);
  }
});

bot.command('stopdaily', (ctx) => {
  try {
    waitUntil(kv.hdel(dailyVerseKey, String(ctx.chatId)));
    ctx.reply('Больше никаких ежедневных стихов');
  } catch (error) {
    console.error(error);
  }
});

bot.hears(randomVerseMessageText, handleGetVerse());
bot.hears(randomBGVerseMessageText, handleGetVerse(Book.BG));
bot.hears(randomSBVerseMessageText, handleGetVerse(Book.SB));
bot.hears(randomCCVerseMessageText, handleGetVerse(Book.CC));
