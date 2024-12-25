import { buildRandomVerseMessage } from './build-verse-message';
import { getVerse } from './get-verse';
import { Book } from './types';

export const getRandomVerseMessage = (from?: Book) => {
  try {
    const verse = getVerse(from);
    const message = buildRandomVerseMessage(verse);

    return message;
  } catch (e) {
    console.error(e);

    return 'Что-то пошло не так. /help';
  }
};
