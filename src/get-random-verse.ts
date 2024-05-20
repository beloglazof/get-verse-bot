import { Random } from 'random-js';
import {
  BG_CHAPTERS_COUNT,
  BG_VERSES_BY_CHAPTER,
  BOOKS,
  Book,
  SB_CANTOS_COUNT,
  SB_CHAPTER_COUNT_BY_CANTO,
  SB_VERSES_BY_CANTO_AND_CHAPTER,
} from './constants';

const random = new Random();

const getRandomBGVerse = () => {
  const chapter = random.integer(1, BG_CHAPTERS_COUNT).toString();
  const verse = random.pick(BG_VERSES_BY_CHAPTER[chapter]);

  return [Book.BG, chapter, verse];
};

const getRandomSBVerse = () => {
  const canto = random.integer(1, SB_CANTOS_COUNT).toString();
  const chapter = random.integer(1, SB_CHAPTER_COUNT_BY_CANTO[canto]).toString();
  const verse = random.pick(SB_VERSES_BY_CANTO_AND_CHAPTER[canto][chapter]);

  return [Book.SB, canto, chapter, verse];
};

const getByBook: Record<Book, () => string[]> = {
  [Book.BG]: getRandomBGVerse,
  [Book.SB]: getRandomSBVerse,
};

export const getRandomVerse = () => {
  const book = random.pick(BOOKS);
  const verse = getByBook[book]();

  return verse;
};
