import React, { createContext, useContext, useState, useEffect } from 'react';

export const languages = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
];

const LanguageContext = createContext({ language: languages[0], setLanguage: () => {}, languages });

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('language');
    return languages.find(l => l.code === stored) || languages[0];
  });

  useEffect(() => {
    localStorage.setItem('language', language.code);
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.code === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
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
