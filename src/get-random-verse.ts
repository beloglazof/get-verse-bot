import { Random } from 'random-js';
import {
  BG_CHAPTERS_COUNT,
  BG_VERSES_BY_CHAPTER,
  BOOKS,
  BOOK_TITLE,
  CC_CHAPTER_COUNT_BY_LILA,
  CC_LILA_LIST,
  CC_LILA_TITLE,
  CC_VERSES_BY_LILA_AND_CHAPTER,
  LIBRARY_BASE_URL,
  SB_CANTOS_COUNT,
  SB_CHAPTER_COUNT_BY_CANTO,
  SB_VERSES_BY_CANTO_AND_CHAPTER,
} from './constants';
import { Book, VerseType } from './types';

const path = require('node:path');
const random = new Random();

const getRandomBGVerse = (): VerseType => {
  const chapter = random.integer(1, BG_CHAPTERS_COUNT).toString();
  const verse = random.pick(BG_VERSES_BY_CHAPTER[chapter]);

  const link = new URL(
    path.join(Book.BG, chapter, verse),
    LIBRARY_BASE_URL,
  ).toString();

  const title = `${BOOK_TITLE[Book.BG]} ${chapter}.${verse}`;

  return {
    link,
    title,
  };
};

const getRandomSBVerse = (): VerseType => {
  const canto = random.integer(1, SB_CANTOS_COUNT).toString();
  const chapter = random
    .integer(1, SB_CHAPTER_COUNT_BY_CANTO[canto])
    .toString();
  const verse = random.pick(SB_VERSES_BY_CANTO_AND_CHAPTER[canto][chapter]);

  const link = new URL(
    path.join(Book.SB, canto, chapter, verse),
    LIBRARY_BASE_URL,
  ).toString();

  const title = `${BOOK_TITLE[Book.SB]} ${canto}.${chapter}.${verse}`;

  return {
    link,
    title,
  };
};

const getRandomCCVerse = (): VerseType => {
  const lila = random.pick(CC_LILA_LIST);
  const chapter = random.integer(1, CC_CHAPTER_COUNT_BY_LILA[lila]).toString();
  const verse = random.pick(CC_VERSES_BY_LILA_AND_CHAPTER[lila][chapter]);

  const lilaTitle = CC_LILA_TITLE[lila];

  const link = new URL(
    path.join(Book.CC, lila, chapter, verse),
    LIBRARY_BASE_URL,
  ).toString();

  const title = `${BOOK_TITLE[Book.CC]} ${lilaTitle} ${chapter}.${verse}`;

  return {
    link,
    title,
  };
};

const getByBook: Record<Book, () => VerseType> = {
  [Book.BG]: getRandomBGVerse,
  [Book.SB]: getRandomSBVerse,
  [Book.CC]: getRandomCCVerse,
};

export const getRandomVerse = (from?: Book) => {
  const book = from || random.pick(BOOKS);
  const verse = getByBook[book]();

  return verse;
};
