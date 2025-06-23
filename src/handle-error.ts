import { Context } from 'grammy';
import { ERROR_MESSAGE } from './constants/messages';
import { ErrorCode } from './types';

export const handleError = (error: unknown, ctx: Context) => {
  let code = ErrorCode.Unknown;

  if (error instanceof Error) {
    code = error.message as ErrorCode;
  }

  const message = ERROR_MESSAGE[code];

  ctx.reply(message, { parse_mode: 'Markdown' });

  console.error(error);
};
