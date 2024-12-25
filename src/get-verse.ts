import { Random } from 'random-js';

import {
  BOOK_TITLE,
  CC_LILA_TITLE,
  BG_VERSES,
  CC_VERSES,
  SB_VERSES,
  BOOK_VERSES_COUNT,
  BG_VERSE_TRANSLATIONS,
  BOOKS,
} from './book-constants';
import { Book, CcLila, VerseType } from './types';
import {
  LIBRARY_BASE_URL,
  TG_BASE_URL,
  TG_BG_FIRST_VERSE_ID,
  TG_BG_NAME,
} from './constants';

const random = new Random();
const path = require('node:path');

type GetOrderedVerse = (verseInd: number) => VerseType;

const normalizeIndex = (initialIndex: number, arrayLength: number): number =>
  initialIndex - arrayLength * Math.floor(initialIndex / arrayLength);

const getRandomIndex = (book: Book): number =>
  random.integer(0, BOOK_VERSES_COUNT[book]);

const getIndex = (initialIndex: number | undefined, book: Book) => {
  if (initialIndex === undefined) {
    return getRandomIndex(book);
  }

  return normalizeIndex(initialIndex, BOOK_VERSES_COUNT[book]);
};

const getBGVerse: GetOrderedVerse = (verseInd) => {
  const [chapter, verse] = BG_VERSES[verseInd].split('.');
  const title = `${BOOK_TITLE[Book.BG]} ${chapter}.${verse}`;

  const link = new URL(
    path.join(Book.BG, chapter, verse),
    LIBRARY_BASE_URL,
  ).toString();

  const translation = BG_VERSE_TRANSLATIONS[verseInd];

  const tgVerseId = (verseInd + TG_BG_FIRST_VERSE_ID).toString();
  const tgLink = new URL(
    path.join(TG_BG_NAME, tgVerseId),
    TG_BASE_URL,
  ).toString();

  return {
    from: Book.BG,
    libraryLink: link,
    tgLink,
    title,
    translation,
  };
};

const getSBVerse: GetOrderedVerse = (verseInd) => {
  const [canto, chapter, verse] = SB_VERSES[verseInd].split('.');
  const title = `${BOOK_TITLE[Book.SB]} ${canto}.${chapter}.${verse}`;

  const link = new URL(
    path.join(Book.SB, canto, chapter, verse),
    LIBRARY_BASE_URL,
  ).toString();

  return {
    from: Book.SB,
    libraryLink: link,
    title,
  };
};

const getCCVerse: GetOrderedVerse = (verseInd) => {
  const [lila, chapter, verse] = CC_VERSES[verseInd].split('.');
  const lilaTitle = CC_LILA_TITLE[lila as CcLila];
  const title = `${BOOK_TITLE[Book.CC]} ${lilaTitle} ${chapter}.${verse}`;

  const link = new URL(
    path.join(Book.CC, lila, chapter, verse),
    LIBRARY_BASE_URL,
  ).toString();

  return {
    from: Book.CC,
    libraryLink: link,
    title,
  };
};

const getByBook: Record<Book, GetOrderedVerse> = {
  [Book.BG]: getBGVerse,
  [Book.SB]: getSBVerse,
  [Book.CC]: getCCVerse,
};

export const getVerse = (from?: Book, verseInd?: number) => {
  const book = from || random.pick(BOOKS);
  const index = getIndex(verseInd, book);
  const verse = getByBook[book](index);

  return verse;
};
