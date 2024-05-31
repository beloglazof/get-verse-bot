import jsdom from 'jsdom';

import { VerseType } from './types';

const { JSDOM } = jsdom;

export const fetchVerseData = async (
  verseLink: string,
): Promise<Omit<VerseType, 'link' | 'title'>> => {
  try {
    const response = await fetch(verseLink);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();
    const { document } = new JSDOM(data).window;
    const translation =
      document.body.querySelector('.r-translation')?.textContent;

    const firstPuportParagraph =
      document.body.querySelector('.r-paragraph')?.textContent;
    const needReadMore =
      (document.body.querySelector('.wrapper-puport')?.childElementCount || 0) >
      2;

    return { translation, firstPuportParagraph, needReadMore };
  } catch (e) {
    console.error(e);
    return {};
  }
};
