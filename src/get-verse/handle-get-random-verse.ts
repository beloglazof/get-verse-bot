import { Middleware, Context } from 'grammy';
import { mainKeyboard } from '../keyboard';
import { Book } from '../types';
import { getVerse } from '.';
import { buildRandomVerseMessage } from './build-verse-message';

const getRandomVerseMessage = (from?: Book) => {
  try {
    const verse = getVerse(from);
    const message = buildRandomVerseMessage(verse);

    return message;
  } catch (e) {
    console.error(e);

    return 'Что-то пошло не так. /help';
  }
};

export const handleGetRandomVerse: (from?: Book) => Middleware<Context> =
  (from) => async (ctx) => {
    const message = getRandomVerseMessage(from);

    ctx.reply(message, {
      reply_markup: mainKeyboard,
      parse_mode: 'Markdown',
    });
  };
