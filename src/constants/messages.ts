import {
  VEDABASE_LIBRARY_BASE_URL,
  GITABASE_LIBRARY_BASE_URL,
  OCEAN_LIBRARY_BASE_URL,
} from '.';
import { Command, ErrorCode } from '../types';

export const START_MESSAGE = `Привет! Чтобы получить случайный стих, нажмите на одну из кнопок`;

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
Чтобы воспользоваться, нажмите на кнопку "Закладка" под сообщением со стихом и следуйте инструкциям.

Если бот ведет себя странно, напишите мне - @Beloglazof`;

export const START_DAILY_MESSAGE =
  'Я буду присылать Вам стих каждый день в 11:00 по МСК';

export const STOP_DAILY_MESSAGE = 'Больше никаких ежедневных стихов';

export const START_SANDWICH_MESSAGE =
  'Я буду присылать каждый день по стиху из Шримад-Бхагаватам, Чайтанья-Чаритамриты и Бхагавад-гиты. С самого первого стиха и до конца. Утром, днем и вечером.';

export const STOP_SANDWICH_MESSAGE =
  'Хорошо! Больше не будет ежедневного "сэндвича"';

export const INITIAL_SET_BOOKMARK_MESSAGE = `Отправьте мне ссылку с [Vedabase](${VEDABASE_LIBRARY_BASE_URL}), [Gitabase](${GITABASE_LIBRARY_BASE_URL}) или [Океан](${OCEAN_LIBRARY_BASE_URL}) на стих на котором Вы остановились`;

export const GET_RANDOM_VERSE_MESSAGE = 'Любой случайный стих, пожалуйста 🔮';
export const GET_RANDOM_BG_VERSE_MESSAGE =
  'Стих из Бхагавад-гиты, пожалуйста 🪈';
export const GET_RANDOM_SB_VERSE_MESSAGE =
  'Стих из Шримад-Бхагаватам, пожалуйста 🦜';
export const GET_RANDOM_CC_VERSE_MESSAGE =
  'Стих из Шри Чайтанья-чаритамриты, пожалуйста 🌕';

const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так 😔';

const NO_SANDWICH_DATA_ERROR_MESSAGE = `Вы не подписаны на "сэндвич". 

Чтобы получать по порядку стихи из Шримад-Бхагаватам, Чайтанья-Чаритамриты и Бхагавад-гиты используйте команду /${Command.StartSandwich}`;

const UNSUPPORTED_LIBRARY_HOSTNAME_ERROR_MESSAGE = `Я умею работать только с ссылками из [Vedabase](${VEDABASE_LIBRARY_BASE_URL}), [Gitabase](${GITABASE_LIBRARY_BASE_URL}) или [Океан](${OCEAN_LIBRARY_BASE_URL}).

Чтобы поставить закладку, отправьте ссылку на стих в ответе на сообщение с хэштегом #bookmark`;

const INVALID_BOOKMARK_TARGET_ERROR_MESSAGE = `Вы отправили ссылку не на ту книгу.

Чтобы поставить закладку, отправьте ссылку на стих в ответе на сообщение с хэштегом #bookmark`;

export const ERROR_MESSAGE: Record<ErrorCode, string> = {
  [ErrorCode.Unknown]: DEFAULT_ERROR_MESSAGE,
  [ErrorCode.NoSandwichData]: NO_SANDWICH_DATA_ERROR_MESSAGE,
  [ErrorCode.UnsupportedLibraryHostname]:
    UNSUPPORTED_LIBRARY_HOSTNAME_ERROR_MESSAGE,
  [ErrorCode.InvalidBookmarkTarget]: INVALID_BOOKMARK_TARGET_ERROR_MESSAGE,
};
