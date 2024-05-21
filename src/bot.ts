import { Bot, Context, Keyboard } from 'grammy';
import {
  getRandomBGVerse,
  getRandomSBVerse,
  getRandomVerse,
} from './get-random-verse';
import { LIBRARY_BASE_URL, BOOK_TITLE } from './constants';
import { Book, Env, VerseType } from './types';

const path = require('node:path');

const { BOT_TOKEN: token = '', ENV: env } = process.env;

export const bot = new Bot(token);

const buildVerseMessage = (verse: VerseType): string => {
  const versePath = path.join(...verse);
  const verseLink = new URL(versePath, LIBRARY_BASE_URL).toString();

  const [book, ...verseData] = verse;
  const bookTitle = BOOK_TITLE[book as Book];
  const verseNumber = verseData.join('.');
  const message = `Вот, что я нашел для Вас

[${bookTitle} ${verseNumber}](${verseLink})`;

  return message;
};

const randomVerseMessageText = 'Любой случайный стих, пожалуйста 🔮';
const randomBGVerseMessageText = 'Что-нибудь из Бхагавад-гиты, пожалуйста 🪈';
const randomSBVerseMessageText =
  'Что-нибудь из Шримад-Бхагаватам, пожалуйста 🦜';
const keyboard = new Keyboard()
  .text(randomVerseMessageText)
  .row()
  .text(randomBGVerseMessageText)
  .row()
  .text(randomSBVerseMessageText)
  .persistent();

const sendVerse = (ctx: Context, verse: VerseType) => {
  const verseMessage = buildVerseMessage(verse);

  ctx.reply(verseMessage, {
    reply_markup: keyboard,
    parse_mode: 'Markdown',
  });
};

bot.command('start', (ctx) =>
  ctx.reply(
    `Привет, ${ctx.from}!
    Я могу найти случайный стих из Бхагавад-гиты, Шримад-Бхагаватам и Чайтанья-чаритамриты`,
    {
      reply_markup: keyboard,
    },
  ),
);

bot.command('update', (ctx) => {
  ctx.reply('🌚', {
    reply_markup: keyboard,
  });
});

bot.hears(randomVerseMessageText, (ctx) => {
  const verse = getRandomVerse();

  sendVerse(ctx, verse);
});

bot.hears(randomBGVerseMessageText, (ctx) => {
  const verse = getRandomBGVerse();

  sendVerse(ctx, verse);
});

bot.hears(randomSBVerseMessageText, (ctx) => {
  const verse = getRandomSBVerse();

  sendVerse(ctx, verse);
});

if (env === Env.Dev) {
  bot.start();
}
