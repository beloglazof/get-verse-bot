import {
  VEDABASE_LIBRARY_BASE_URL,
  GITABASE_LIBRARY_BASE_URL,
  OCEAN_LIBRARY_BASE_URL,
} from '.';
import { Command } from '../types';

export const START_MESSAGE = `Привет! Чтобы получить случайный стих, нажмите на одну из кнопок`;

export const START_DAILY_MESSAGE =
  'Я буду присылать Вам стих каждый день в 11:00 по МСК';
export const STOP_DAILY_MESSAGE = 'Больше никаких ежедневных стихов';

export const START_SANDWICH_MESSAGE =
  'Я буду присылать каждый день по стиху из Шримад-Бхагаватам, Чайтанья-Чаритамриты и Бхагавад-гиты. С самого первого стиха и до конца. Утром, днем и вечером';
export const STOP_SANDWICH_MESSAGE =
  'Хорошо! Больше не будет ежедневного "сэндвича"';

export const BOOKMARK_BUTTON_TEXT = 'Прочли дальше? 📖 Поставить закладку';
export const INITIAL_SET_BOOKMARK_MESSAGE = `Отправьте мне ссылку с [Vedabase](${VEDABASE_LIBRARY_BASE_URL}), [Gitabase](${GITABASE_LIBRARY_BASE_URL}) или [Океан](${OCEAN_LIBRARY_BASE_URL}) на стих на котором Вы остановились`;
export const FINAL_SET_BOOKMARK_MESSAGE =
  'Отлично! Завтра пришлю следующий стих';

export const GET_RANDOM_VERSE_MESSAGE = 'Любой случайный стих, пожалуйста 🔮';
export const GET_RANDOM_BG_VERSE_MESSAGE =
  'Стих из Бхагавад-гиты, пожалуйста 🪈';
export const GET_RANDOM_SB_VERSE_MESSAGE =
  'Стих из Шримад-Бхагаватам, пожалуйста 🦜';
export const GET_RANDOM_CC_VERSE_MESSAGE =
  'Стих из Шри Чайтанья-чаритамриты, пожалуйста 🌕';

export const HELP_MESSAGE = `Нажмите на одну из кнопок, чтобы получить случайный стих.

Чтобы каждый день получать случайный стих, используйте команду:
/${Command.StartDaily}

Для отключения используйте команду: 
/${Command.StopDaily}

Чтобы каждый день получать стихи по порядку из Шримад-Бхагаватам, Чайтанья-Чаритамриты и Бхагавад-гиты, используйте команду:
/${Command.StartSandwich}

Для отключения используйте команду: 
/${Command.StopSandwich}

У стихов из "сэндвича" есть функция "Закладка".
Это буквально закладка как в книгах. Она нужна в случае, если Вы прочли несколько стихов за раз и хотите продолжить читать завтра следующие.
Чтобы воспользоваться, нажмите на кнопку "${BOOKMARK_BUTTON_TEXT}" под сообщением со стихом и следуйте инструкциям.

Если бот ведет себя странно, напишите мне - @Beloglazof`;
