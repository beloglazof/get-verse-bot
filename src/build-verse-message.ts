import { VerseType } from './types';

export const buildVerseMessage = ({
  libraryLink,
  title,
  translation,
  tgLink,
}: VerseType) => {
  let message = `*${title}*`;
  let links = `Читать полность: [vedabase.io](${libraryLink})`;

  if (translation) {
    message = `${message}

${translation}`;
  }

  if (tgLink) {
    links = `${links}, [Telegram](${tgLink})`;
  }

  message = `${message}
  
${links}`;

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
