import { useEffect } from 'react';

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

const resolveDirection = (language) => {
  if (!language) {
    return 'ltr';
  }

  const normalized = language.split('-')[0];
  return RTL_LANGUAGES.has(normalized) ? 'rtl' : 'ltr';
};

export function useDirection(i18nOrLanguage) {
  const language =
    typeof i18nOrLanguage === 'object' && i18nOrLanguage !== null
      ? i18nOrLanguage.language || i18nOrLanguage.resolvedLanguage
      : i18nOrLanguage;

  useEffect(() => {
    if (!i18nOrLanguage || typeof document === 'undefined') {
      return undefined;
    }

    const isI18nInstance =
      typeof i18nOrLanguage === 'object' &&
      i18nOrLanguage !== null &&
      (typeof i18nOrLanguage.dir === 'function' || typeof i18nOrLanguage.on === 'function');

    const getDirection = (lng) => {
      if (isI18nInstance && typeof i18nOrLanguage.dir === 'function') {
        return i18nOrLanguage.dir(lng);
      }

      return resolveDirection(lng);
    };

    const applyDirection = (lng) => {
      const nextLanguage = lng || language || 'en';
      const direction = getDirection(nextLanguage) || 'ltr';

      document.documentElement.dir = direction;
      document.documentElement.lang = nextLanguage;
    };

    applyDirection(language);

    if (isI18nInstance && typeof i18nOrLanguage.on === 'function') {
      const handleLanguageChanged = (lng) => {
        applyDirection(lng);
      };

      i18nOrLanguage.on('languageChanged', handleLanguageChanged);

      return () => {
        if (typeof i18nOrLanguage.off === 'function') {
          i18nOrLanguage.off('languageChanged', handleLanguageChanged);
        }
      };
    }

    return undefined;
  }, [i18nOrLanguage, language]);
}

export default useDirection;
