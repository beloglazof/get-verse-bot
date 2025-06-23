import { kv } from '@vercel/kv';
import { waitUntil } from '@vercel/functions';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { bot } from '../src/bot';
import { buildDailyMessage } from '../src/get-verse/build-verse-message';
import { getVerse } from '../src/get-verse/';
import { mainKeyboard } from '../src/keyboard';

import { Env } from '../src/types';
import { DAILY_VERSE_KEY, DAILY_VERSE_TEST_KEY } from '../src/constants';

const { ENV: env } = process.env;
const dailyVerseKey = env === Env.Prod ? DAILY_VERSE_KEY : DAILY_VERSE_TEST_KEY;

export const config = {
  supportsResponseStreaming: true,
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.query.type === 'warm') {
      return response.json({ ok: true, type: 'warm' });
    }

    const chatIdList = await kv.hkeys(dailyVerseKey);

    chatIdList.forEach((chatId) => {
      const verse = getVerse();
      const message = buildDailyMessage(verse);

      waitUntil(
        bot.api.sendMessage(Number(chatId), message, {
          parse_mode: 'Markdown',
          reply_markup: mainKeyboard,
        }),
      );
    });

    return response.json({ ok: true });
  } catch (error) {
    return response.json({ ok: false, error });
  }
}
