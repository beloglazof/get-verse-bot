import { kv } from '@vercel/kv';
import { waitUntil } from '@vercel/functions';
import { HttpStatusCode } from 'axios';
import { GrammyError } from 'grammy';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { bot } from '../src/bot';
import { buildVerseMessage } from '../src/get-verse/build-verse-message';
import { getVerse } from '../src/get-verse/';
import { getBookmarkInlineKeyboard } from '../src/keyboard';

import { Book, Env } from '../src/types';
import { SANDWICH_KEY, SANDWICH_TEST_KEY } from '../src/constants';

const { ENV: env } = process.env;
const sandwichKey = env === Env.Prod ? SANDWICH_KEY : SANDWICH_TEST_KEY;

type SandwichStoredType = Record<string, Record<string, number>>;

export const config = {
  supportsResponseStreaming: true,
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const { book: queryBook, type: requestType } = request.query;

    if (requestType === 'warm') {
      return response.json({ ok: true, type: 'warm' });
    }

    if (
      !queryBook ||
      !(queryBook === Book.BG || queryBook === Book.CC || queryBook === Book.SB)
    ) {
      response.status(HttpStatusCode.BadRequest);
      return response.json({ ok: false });
    }

    const sandwichDataByChatId: SandwichStoredType | null =
      await kv.hgetall(sandwichKey);

    if (!sandwichDataByChatId) {
      response.status(HttpStatusCode.InternalServerError);
      return response.json({ ok: false, message: 'No sandwich data' });
    }

    const book = queryBook as Book;
    const chatIdList = Object.keys(sandwichDataByChatId);

    chatIdList.forEach((chatId) => {
      const sandwichData = sandwichDataByChatId[chatId];
      const verseInd = sandwichData[book];
      const verse = getVerse(book, verseInd);
      const message = buildVerseMessage(verse);
      const bookmarkKeyboard = getBookmarkInlineKeyboard(book);

      waitUntil(
        new Promise(async (resolve, reject) => {
          try {
            await bot.api.sendMessage(chatId, message, {
              parse_mode: 'Markdown',
              reply_markup: bookmarkKeyboard,
            });
          } catch (error) {
            console.error(error);

            if (
              error instanceof GrammyError &&
              error.error_code === HttpStatusCode.Forbidden
            ) {
              await kv.hdel(`${sandwichKey}`, chatId);
            }

            reject(error);
          }

          try {
            const newSandwichData = JSON.stringify({
              ...sandwichData,
              [book]: verseInd + 1,
            });

            await kv.hset(`${sandwichKey}`, { [chatId]: newSandwichData });
          } catch (error) {
            console.error(error);

            reject(error);
          }

          resolve(true);
        }),
      );
    });

    return response.json({ ok: true });
  } catch (error) {
    console.error(error);

    response.status(HttpStatusCode.InternalServerError);
    return response.json({ ok: false });
  }
}
