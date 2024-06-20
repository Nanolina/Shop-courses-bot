import { en } from './en';
import { ru } from './ru';

export function getTranslatedText(text: string, language: string) {
  switch (language) {
    case 'ru':
      return ru[text] || '';
    case 'en':
    default:
      return en[text] || '';
  }
}
