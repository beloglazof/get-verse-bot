import { buildVerseMessage } from './build-verse-message';
import { fetchVerseData } from './fetch-verse-data';
import { getRandomVerse } from './get-random-verse';
import { Book } from './types';

export const getVerseMessage = async (from?: Book) => {
  try {
    const verse = getRandomVerse(from);
    const verseData = await fetchVerseData(verse.link);
    const message = buildVerseMessage({ ...verse, ...verseData });

    return message;
  } catch (e) {
    console.error(e);

    return 'Что-то пошло не так. /help';
  }
};
