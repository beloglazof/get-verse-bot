import { BG_VERSES, BOOK_TITLE } from './book-constants';
import { Book, VerseType } from './types';
import { LIBRARY_BASE_URL } from './constants';

const path = require('node:path');

const getOrderedBGVerse = (verseInd: number): VerseType => {
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

// const getOrderedSBVerse = (): VerseType => {
//   const canto = random.integer(1, SB_CANTOS_COUNT).toString();
//   const chapter = random
//     .integer(1, SB_CHAPTER_COUNT_BY_CANTO[canto])
//     .toString();
//   const verse = random.pick(SB_VERSES_BY_CANTO_AND_CHAPTER[canto][chapter]);

//   const link = new URL(
//     path.join(Book.SB, canto, chapter, verse),
//     LIBRARY_BASE_URL,
//   ).toString();

//   const title = `${BOOK_TITLE[Book.SB]} ${canto}.${chapter}.${verse}`;

//   return {
//     link,
//     title,
//   };
// };

// const getOrderedCCVerse = (): VerseType => {
//   const lila = random.pick(CC_LILA_LIST);
//   const chapter = random.integer(1, CC_CHAPTER_COUNT_BY_LILA[lila]).toString();
//   const verse = random.pick(CC_VERSES_BY_LILA_AND_CHAPTER[lila][chapter]);

//   const lilaTitle = CC_LILA_TITLE[lila];

//   const link = new URL(
//     path.join(Book.CC, lila, chapter, verse),
//     LIBRARY_BASE_URL,
//   ).toString();

//   const title = `${BOOK_TITLE[Book.CC]} ${lilaTitle} ${chapter}.${verse}`;

//   return {
//     link,
//     title,
//   };
// };

const getByBook: Record<Book, (verseInd: number) => VerseType> = {
  [Book.BG]: getOrderedBGVerse,
  [Book.SB]: (verseInd) => ({ link: '', title: '' }),
  [Book.CC]: (verseInd) => ({ link: '', title: '' }),
};

export const getOrderedVerse = (book: Book, verseInd: number) => {
  const verse = getByBook[book](verseInd);

  return verse;
};
