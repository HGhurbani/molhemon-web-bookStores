import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from './languages.js';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'ar',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(({ code }) => code),
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/api/translations/{{lng}}',
      requestOptions: {
        credentials: 'same-origin',
        cache: 'no-store',
      },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;