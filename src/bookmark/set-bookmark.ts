import { kv } from '@vercel/kv';
import { Middleware, Context } from 'grammy';

import { handleError } from '../handle-error';
import { mainKeyboard } from '../keyboard';

import { ErrorCode, Book, Env } from '../types';
import {
  VEDABASE_LIBRARY_BASE_URL,
  GITABASE_LIBRARY_BASE_URL,
  SANDWICH_KEY,
  SANDWICH_TEST_KEY,
  OCEAN_LIBRARY_BASE_URL,
} from '../constants';
import { VERSES_BY_BOOK } from '../constants/book-constants';
import { CC_LILA_LIST } from '../constants/cc-constants';
import { FINAL_SET_BOOKMARK_MESSAGE } from '../constants/messages';

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
}

const sandwichKey =
  process.env.ENV === Env.Prod ? SANDWICH_KEY : SANDWICH_TEST_KEY;
const baseUrlRegExp = new RegExp(
  `^(${escapeRegExp(VEDABASE_LIBRARY_BASE_URL)}|${escapeRegExp(GITABASE_LIBRARY_BASE_URL)}|${escapeRegExp(OCEAN_LIBRARY_BASE_URL)})`,
  'gi',
);

export const setBookmark: Middleware<Context> = async (ctx) => {
  try {
    const sandwichData: Record<string, number> | null = await kv.hget(
      sandwichKey,
      String(ctx.chatId),
    );

    if (!sandwichData || !ctx.chatId) {
      throw new Error(ErrorCode.NoSandwichData);
    }

    const url = new URL(ctx.entities('url')[0].text);
    const gitabaseUrl = new URL(GITABASE_LIBRARY_BASE_URL);
    const isGitabase = url.hostname === gitabaseUrl.hostname;

    if (!baseUrlRegExp.test(url.toString())) {
      throw new Error(ErrorCode.UnsupportedLibraryHostname);
    }

    const bookmarkTarget = ctx.message?.reply_to_message?.text
      ?.match(/^#(bg|sb|cc)/)?.[0]
      .replace('#', '');

    const [urlBook, ...versePathParts] = url
      .toString()
      .replace(baseUrlRegExp, '')
      .split('/')
      .filter(Boolean);

    if (bookmarkTarget !== urlBook?.toLowerCase()) {
      throw new Error(ErrorCode.InvalidBookmarkTarget);
    }

    const book = bookmarkTarget! as Book;

    if (book === Book.CC && isGitabase) {
      const lilaIdx = Number(versePathParts[0]) - 1;
      const lila = CC_LILA_LIST[lilaIdx];
      versePathParts[0] = lila;
    }

    const versePath = versePathParts.join('.');
    const bookmarkedVerseIndex = VERSES_BY_BOOK[book].indexOf(versePath);
    const newSandwichData = JSON.stringify({
      ...sandwichData,
      [book]: bookmarkedVerseIndex + 1,
    });

    await kv.hset(sandwichKey, { [ctx.chatId]: newSandwichData });
    await ctx.reply(FINAL_SET_BOOKMARK_MESSAGE, {
      reply_markup: mainKeyboard,
    });
  } catch (error) {
    handleError(error, ctx);
  }
};
