import { waitUntil } from '@vercel/functions';
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { bot } from '../src/bot';
import { getRandomVerse } from '../src/get-random-verse';
import { DAILY_VERSE_KEY, DAILY_VERSE_TEST_KEY } from '../src/constants';
import { Env, VerseType } from '../src/types';

const { ENV: env } = process.env;
const dailyVerseKey = env === Env.Prod ? DAILY_VERSE_KEY : DAILY_VERSE_TEST_KEY;

const buildDailyMessage = ({ link, title }: VerseType) => {
  const message = `*Стих дня:* [${title}](${link})`;

  return message;
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const chatIdList = await kv.hkeys(dailyVerseKey);

    chatIdList.forEach((chatId) => {
      const verse = getRandomVerse();
      const message = buildDailyMessage(verse);

      waitUntil(
        bot.api.raw.sendMessage({
          chat_id: Number(chatId),
          text: message,
          parse_mode: 'Markdown',
        }),
      );
    });

    return response.json({ ok: true });
  } catch (error) {
    return response.json({ ok: false, error });
  }
}
