import { Random } from 'random-js';
import {
  BG_CHAPTERS_COUNT,
  BG_VERSES_BY_CHAPTER,
  BOOKS,
  SB_CANTOS_COUNT,
  SB_CHAPTER_COUNT_BY_CANTO,
  SB_VERSES_BY_CANTO_AND_CHAPTER,
} from './constants';
import { BGVerseType, Book, SBVerseType, VerseType } from './types';

const random = new Random();

export const getRandomBGVerse = (): BGVerseType => {
  const chapter = random.integer(1, BG_CHAPTERS_COUNT).toString();
  const verse = random.pick(BG_VERSES_BY_CHAPTER[chapter]);

  return [Book.BG, chapter, verse];
};

export const getRandomSBVerse = (): SBVerseType => {
  const canto = random.integer(1, SB_CANTOS_COUNT).toString();
  const chapter = random
    .integer(1, SB_CHAPTER_COUNT_BY_CANTO[canto])
    .toString();
  const verse = random.pick(SB_VERSES_BY_CANTO_AND_CHAPTER[canto][chapter]);

  return [Book.SB, canto, chapter, verse];
};

const getByBook: Record<Book, () => VerseType> = {
  [Book.BG]: getRandomBGVerse,
  [Book.SB]: getRandomSBVerse,
};

export const getRandomVerse = () => {
  const book = random.pick(BOOKS);
  const verse = getByBook[book]();

  return verse;
};
