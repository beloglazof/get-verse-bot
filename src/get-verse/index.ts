import { Random } from 'random-js';

import { Book, CcLila, VerseType } from '../types';
import {
  BOOK_TITLE,
  BOOK_VERSES_COUNT,
  BOOKS,
} from '../constants/book-constants';
import {
  VEDABASE_LIBRARY_BASE_URL,
  GITABASE_LIBRARY_BASE_URL,
  OCEAN_LIBRARY_BASE_URL,
} from '../constants';
import { BG_VERSES, BG_VERSE_TRANSLATIONS } from '../constants/bg-constants';
import {
  CC_VERSES,
  CC_LILA_TITLE,
  CC_LILA_LIST,
  CC_VERSE_TRANSLATIONS,
} from '../constants/cc-constants';
import { SB_VERSES, SB_VERSE_TRANSLATIONS } from '../constants/sb-constants';

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

  const vedabaseLink = new URL(
    path.join(Book.BG, chapter, verse),
    VEDABASE_LIBRARY_BASE_URL,
  ).toString();

  const gitabaseLink = new URL(
    path.join(Book.BG, chapter, verse),
    GITABASE_LIBRARY_BASE_URL,
  ).toString();

  const oceanLink = new URL(
    path.join(Book.BG, chapter, verse),
    OCEAN_LIBRARY_BASE_URL,
  ).toString();

  const translation = BG_VERSE_TRANSLATIONS[verseInd];

  return {
    from: Book.BG,
    libraryLink: {
      vedabase: vedabaseLink,
      gitabase: gitabaseLink,
      ocean: oceanLink,
    },
    title,
    translation,
  };
};

const getSBVerse: GetOrderedVerse = (verseInd) => {
  const [canto, chapter, verse] = SB_VERSES[verseInd].split('.');
  const title = `${BOOK_TITLE[Book.SB]} ${canto}.${chapter}.${verse}`;
  const translation = SB_VERSE_TRANSLATIONS[verseInd];

  const vedabaseLink = new URL(
    path.join(Book.SB, canto, chapter, verse),
    VEDABASE_LIBRARY_BASE_URL,
  ).toString();

  const gitabaseLink = new URL(
    path.join(Book.SB, canto, chapter, verse),
    GITABASE_LIBRARY_BASE_URL,
  ).toString();

  const oceanLink = new URL(
    path.join(Book.SB, canto, chapter, verse),
    OCEAN_LIBRARY_BASE_URL,
  ).toString();

  return {
    from: Book.SB,
    libraryLink: {
      vedabase: vedabaseLink,
      gitabase: gitabaseLink,
      ocean: oceanLink,
    },
    title,
    translation,
  };
};

const getCCVerse: GetOrderedVerse = (verseInd) => {
  const [lila, chapter, verse] = CC_VERSES[verseInd].split('.');
  const lilaTitle = CC_LILA_TITLE[lila as CcLila];
  const lilaNum = `${CC_LILA_LIST.indexOf(lila as CcLila) + 1}`;
  const title = `${BOOK_TITLE[Book.CC]} ${lilaTitle} ${chapter}.${verse}`;
  const translation = CC_VERSE_TRANSLATIONS[verseInd];

  const vedabaseLink = new URL(
    path.join(Book.CC, lila, chapter, verse),
    VEDABASE_LIBRARY_BASE_URL,
  ).toString();

  const gitabaseLink = new URL(
    path.join(Book.CC, lilaNum, chapter, verse),
    GITABASE_LIBRARY_BASE_URL,
  ).toString();

  const oceanLink = new URL(
    path.join(Book.CC, lila, chapter, verse),
    OCEAN_LIBRARY_BASE_URL,
  ).toString();

  return {
    from: Book.CC,
    libraryLink: {
      vedabase: vedabaseLink,
      gitabase: gitabaseLink,
      ocean: oceanLink,
    },
    title,
    translation,
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
