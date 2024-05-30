import { Bot, BotConfig, Context, Keyboard, Middleware } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import jsdom from 'jsdom';
//@ts-ignore
import trunc from 'trunc-text';

import { getRandomVerse } from './get-random-verse';
import { ApiEnv, Book, Env, VerseType } from './types';

const { BOT_TOKEN: token = '', ENV: env } = process.env;

const { JSDOM } = jsdom;

const botConfig: BotConfig<Context> = {
  client: { environment: env === Env.Prod ? ApiEnv.Prod : ApiEnv.Test },
};

export const bot = new Bot(token, botConfig);

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
  .text(randomCCVerseMessageText);

const getVerseData = async (
  verseLink: string,
): Promise<Omit<VerseType, 'link' | 'title'>> => {
  try {
    const response = await fetch(new Request(verseLink));

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();
    const { document } = new JSDOM(data).window;
    const translation =
      document.body.querySelector('.r-translation')?.textContent;

    const firstPuportParagraph =
      document.body.querySelector('.r-paragraph')?.textContent;
    const needReadMore =
      (document.body.querySelector('.wrapper-puport')?.childElementCount || 0) >
      2;

    return { translation, firstPuportParagraph, needReadMore };
  } catch (e) {
    console.error(e);
    return {};
  }
};

const buildMessage = ({
  link,
  title,
  translation,
  firstPuportParagraph,
  needReadMore,
}: VerseType) => {
  const baseMessage = `Вот, что я нашел для Вас:

[${title}](${link})`;

  if (!translation) {
    return baseMessage;
  }

  let message = `${baseMessage}
    
*${translation}*`;

  if (!firstPuportParagraph) {
    return message;
  }

  if (firstPuportParagraph.length <= 600) {
    const readMoreLink = `[Читать дальше](${link})`;
    message = `${message}

*Комментарий:* ${firstPuportParagraph} ${needReadMore ? readMoreLink : ''}`;
  } else {
    const puportExcerpt = trunc(firstPuportParagraph, 300);

    message = `${message}

*Комментарий:* ${puportExcerpt} [Читать дальше](${link})`;
  }

  return message;
};

const handleGetVerse: (from?: Book) => Middleware<Context> =
  (from) => async (ctx) => {
    try {
      const verse = getRandomVerse(from);
      const verseData = await getVerseData(verse.link);
      const message = buildMessage({ ...verse, ...verseData });

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
  ctx.reply(
    `Нажмите на одну из кнопок, чтобы получить случайный стих.
  
Если бот ведет себя странно, напишите мне - @Beloglazof`,
    {
      reply_markup: keyboard,
    },
  );
});

bot.hears(randomVerseMessageText, handleGetVerse());
bot.hears(randomBGVerseMessageText, handleGetVerse(Book.BG));
bot.hears(randomSBVerseMessageText, handleGetVerse(Book.SB));
bot.hears(randomCCVerseMessageText, handleGetVerse(Book.CC));

if (env === Env.Dev) {
  bot.start();
}
