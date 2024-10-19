import {
  BOOK_TITLE,
  CC_LILA_TITLE,
  BG_VERSES,
  CC_VERSES,
  SB_VERSES,
} from './book-constants';
import { Book, CcLila, VerseType } from './types';
import { LIBRARY_BASE_URL } from './constants';

const path = require('node:path');

type GetOrderedVerse = (verseInd: number) => VerseType;

const getOrderedBGVerse: GetOrderedVerse = (verseInd) => {
  const [chapter, verse] = BG_VERSES[verseInd].split('.');

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

const getOrderedSBVerse: GetOrderedVerse = (verseInd) => {
  const [canto, chapter, verse] = SB_VERSES[verseInd].split('.');

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

const getOrderedCCVerse: GetOrderedVerse = (verseInd) => {
  const [lila, chapter, verse] = CC_VERSES[verseInd].split('.');
  const lilaTitle = CC_LILA_TITLE[lila as CcLila];

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

const getByBook: Record<Book, GetOrderedVerse> = {
  [Book.BG]: getOrderedBGVerse,
  [Book.SB]: getOrderedSBVerse,
  [Book.CC]: getOrderedCCVerse,
};

export const getOrderedVerse = (book: Book, verseInd: number) => {
  const verse = getByBook[book](verseInd);

  return verse;
};
