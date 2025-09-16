import { useEffect } from 'react';

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

const resolveDirection = (language) => (RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr');

export function useDirection(language) {
  useEffect(() => {
    if (!language || typeof document === 'undefined') {
      return;
    }

    const direction = resolveDirection(language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language]);
}

export default useDirection;
