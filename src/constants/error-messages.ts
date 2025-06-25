import {
  VEDABASE_LIBRARY_BASE_URL,
  GITABASE_LIBRARY_BASE_URL,
  OCEAN_LIBRARY_BASE_URL,
} from '.';
import { Command, ErrorCode } from '../types';

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
