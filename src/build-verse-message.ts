//@ts-ignore
import trunc from 'trunc-text';

import { VerseType } from './types';

export const buildVerseMessage = ({
  link,
  title,
  translation,
  firstPuportParagraph,
  needReadMore,
}: VerseType) => {
  const baseMessage = `Вот, что я нашел для Вас:

[${title}](${link})`;

  if (!translation) {
    return baseMessage;
  }

  let message = `${baseMessage}
    
*${translation}*`;

  if (!firstPuportParagraph) {
    return message;
  }

  if (firstPuportParagraph.length <= 600) {
    const readMoreLink = `[Читать дальше](${link})`;
    message = `${message}

*Комментарий:* ${firstPuportParagraph} ${needReadMore ? readMoreLink : ''}`;
  } else {
    const puportExcerpt = trunc(firstPuportParagraph, 300);

    message = `${message}

*Комментарий:* ${puportExcerpt} [Читать дальше](${link})`;
  }

  return message;
};
