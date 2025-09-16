import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api.js';

export const defaultLanguages = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
];

export const getStoredLanguages = () => {
  try {
    const stored = localStorage.getItem('languages');
    return stored ? JSON.parse(stored) : defaultLanguages;
  } catch {
    return defaultLanguages;
  }
};

const LanguageContext = createContext({ language: defaultLanguages[0], setLanguage: () => {}, languages: defaultLanguages, setLanguages: () => {} });

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState(getStoredLanguages());
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('language');
    return languages.find(l => l.code === stored) || languages[0];
  });

  useEffect(() => {
    localStorage.setItem('language', language.code);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('languages', JSON.stringify(languages));
  }, [languages]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'languages') {
        const updated = getStoredLanguages();
        setLanguages(updated);
        if (!updated.find(l => l.code === language.code)) {
          setLanguage(updated[0]);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, setLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const { language } = useLanguage();
  return (key) => translations[language.code]?.[key] || key;
};

export const translations = {
  ar: {
    trackOrder: 'تتبع الطلب',
    downloadApp: 'حمل تطبيقنا',
    help: 'المساعدة',
    locations: 'مواقعنا',
  },
  en: {
    trackOrder: 'Track Order',
    downloadApp: 'Download App',
    help: 'Help',
    locations: 'Our Locations',
  }
};
