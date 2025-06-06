import { InlineKeyboard, Keyboard } from 'grammy';
import { Book } from './types';

export const randomVerseMessageText = 'Любой случайный стих, пожалуйста 🔮';
export const randomBGVerseMessageText = 'Стих из Бхагавад-гиты, пожалуйста 🪈';
export const randomSBVerseMessageText =
  'Стих из Шримад-Бхагаватам, пожалуйста 🦜';
export const randomCCVerseMessageText =
  'Стих из Шри Чайтанья-чаритамриты, пожалуйста 🌕';

export const mainKeyboard = new Keyboard()
  .text(randomVerseMessageText)
  .row()
  .text(randomBGVerseMessageText)
  .row()
  .text(randomSBVerseMessageText)
  .row()
  .text(randomCCVerseMessageText);

export const getBookmarkInlineKeyboard = (book: Book) =>
  new InlineKeyboard().text('Закладка', `${book}-bookmark`);
