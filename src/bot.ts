import { Bot, Context, Keyboard, Middleware } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { getRandomVerse } from './get-random-verse';
import { Book, Env } from './types';

const { BOT_TOKEN: token = '', ENV: env } = process.env;

export const bot = new Bot(token);

bot.api.config.use(autoRetry());

const randomVerseMessageText = 'Любой случайный стих, пожалуйста 🔮';
const randomBGVerseMessageText = 'Стих из Бхагавад-гиты, пожалуйста 🪈';
const randomSBVerseMessageText = 'Стих из Шримад-Бхагаватам, пожалуйста 🦜';
const randomCCVerseMessageText =
  'Стих из Шри Чайтанья-чаритамриты, пожалуйста 🌕';
const keyboard = new Keyboard()
  .text(randomVerseMessageText)
  .row()
  .text(randomBGVerseMessageText)
  .row()
  .text(randomSBVerseMessageText)
  .row()
  .text(randomCCVerseMessageText)
  .persistent();

const handleGetVerse: (from?: Book) => Middleware<Context> =
  (from) => (ctx) => {
    try {
      const verse = getRandomVerse(from);
      const message = `Вот, что я нашел для Вас:
[${verse.title}](${verse.link})`;

      ctx.reply(message, {
        reply_markup: keyboard,
        parse_mode: 'Markdown',
      });
    } catch (e) {
      console.error(e);
      ctx.reply('Что-то пошло не так. /help');
    }
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
  ctx.reply('Нажмите на одну из кнопок, чтобы получить случайный стих', {
    reply_markup: keyboard,
  });
});

bot.hears(randomVerseMessageText, handleGetVerse());
bot.hears(randomBGVerseMessageText, handleGetVerse(Book.BG));
bot.hears(randomSBVerseMessageText, handleGetVerse(Book.SB));
bot.hears(randomCCVerseMessageText, handleGetVerse(Book.CC));

if (env === Env.Dev) {
  bot.start();
}
