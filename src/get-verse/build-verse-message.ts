import { VerseType } from '../types';

export const buildVerseMessage = ({
  libraryLink,
  title,
  translation,
}: VerseType) => {
  let message = `*${title}*
  
${translation}`;

  const links = `[Gitabase](${libraryLink.gitabase}) | [Vedabase](${libraryLink.vedabase})`;

  message = `${message}

Читать полностью: ${links}`;

  return message;
};

export const buildRandomVerseMessage = (verse: VerseType) => {
  const baseMessage = buildVerseMessage(verse);
  const message = `Вот, что я нашел для Вас:

${baseMessage}`;

  return message;
};

export const buildDailyMessage = (verse: VerseType) => {
  const baseMessage = buildVerseMessage(verse);

  const message = `Стих дня: ${baseMessage}`;

  return message;
};
