import { InlineKeyboard, Keyboard } from 'grammy';
import { Book } from './types';
import {
  GET_RANDOM_VERSE_MESSAGE,
  GET_RANDOM_BG_VERSE_MESSAGE,
  GET_RANDOM_SB_VERSE_MESSAGE,
  GET_RANDOM_CC_VERSE_MESSAGE,
  BOOKMARK_BUTTON_TEXT,
} from './constants/messages';

export const mainKeyboard = new Keyboard()
  .text(GET_RANDOM_VERSE_MESSAGE)
  .row()
  .text(GET_RANDOM_BG_VERSE_MESSAGE)
  .row()
  .text(GET_RANDOM_SB_VERSE_MESSAGE)
  .row()
  .text(GET_RANDOM_CC_VERSE_MESSAGE);

export const getBookmarkInlineKeyboard = (book: Book) =>
  new InlineKeyboard().text(BOOKMARK_BUTTON_TEXT, `${book}-bookmark`);
