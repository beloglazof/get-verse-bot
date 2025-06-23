import { Book } from '../types';
import { BG_VERSES } from './bg-constants';
import { CC_VERSES } from './cc-constants';
import { SB_VERSES } from './sb-constants';

export const BOOKS = [Book.SB, Book.BG, Book.CC];
export const BOOK_TITLE = {
  [Book.BG]: 'Бхагавад-гита',
  [Book.SB]: 'Шримад-Бхагаватам',
  [Book.CC]: 'Шри Чайтанья-чаритамрита',
};

const BG_VERSES_COUNT = 657;
const SB_VERSES_COUNT = 13003;
const CC_VERSES_COUNT = 11359;

export const BOOK_VERSES_COUNT = {
  [Book.BG]: BG_VERSES_COUNT,
  [Book.SB]: SB_VERSES_COUNT,
  [Book.CC]: CC_VERSES_COUNT,
};

export const VERSES_BY_BOOK: Record<Book, string[]> = {
  [Book.BG]: BG_VERSES,
  [Book.SB]: SB_VERSES,
  [Book.CC]: CC_VERSES,
};
