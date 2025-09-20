import i18n from './i18n.js';
import { SUPPORTED_LANGUAGES } from './languages.js';

export const DEFAULT_LANGUAGE = 'ar';

export const normalizeLanguage = (language) => {
  if (!language || typeof language !== 'string') {
    return null;
  }

  return language.toLowerCase().split('-')[0];
};

export const isSupportedLanguage = (language) =>
  Boolean(language) && SUPPORTED_LANGUAGES.some(({ code }) => code === language);

export const resolveLanguage = (language) => {
  const normalized = normalizeLanguage(language);

  if (normalized && isSupportedLanguage(normalized)) {
    return normalized;
  }

  return DEFAULT_LANGUAGE;
};

export const getActiveLanguage = () => {
  if (i18n && typeof i18n === 'object') {
    const activeLanguage = i18n.language || i18n.resolvedLanguage;

    if (activeLanguage) {
      return resolveLanguage(activeLanguage);
    }
  }

  return DEFAULT_LANGUAGE;
};
