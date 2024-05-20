import { Bot, Context, Keyboard } from 'grammy';
import { getRandomVerse } from './get-random-verse';
import { BOOK_TITLE, Book, LIBRARY_BASE_URL } from './constants';

const path = require('node:path');

const bot = new Bot('7019912482:AAGTT52ie45qZjA3tyaWHAPDwnl5EG5Tv2c');

const buildVerseMessage = (verse: string[]): string => {
  const versePath = path.join(...verse);
  const verseLink = new URL(versePath, LIBRARY_BASE_URL).toString();

  const [book, ...verseData] = verse;
  const bookTitle = BOOK_TITLE[book as Book];
  const verseNumber = verseData.join('.');
  const message = `[${bookTitle} ${verseNumber}](${verseLink})`;

  return message;
};

const keyboardMessageText = '🤔🤔🤔🤔';
const keyboard = new Keyboard().text(keyboardMessageText).persistent();

const sendVerse = (ctx: Context) => {
  const verse = getRandomVerse();
  const verseMessage = buildVerseMessage(verse);

  ctx.reply(verseMessage, {
    reply_markup: keyboard,
    parse_mode: 'Markdown',
  });
};

// Handle the /start command.
bot.command('start', (ctx) =>
  ctx.reply(
    'Привет! Я умею отправлять ссылки на случайные стихи из Бхагавад-гиты, Шримад-Бхагаватам и Чайтанья-чаритамриты',
    {
      reply_markup: keyboard,
    },
  ),
);

// Handle other messages.
bot.on('message', (ctx) => {
  sendVerse(ctx);
});
bot.hears(keyboardMessageText, (ctx) => {
  sendVerse(ctx);
});

// Start the bot.
bot.start();
