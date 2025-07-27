import React, { createContext, useContext, useState } from 'react';

export const defaultCurrencies = [
  {
    code: 'AED',
    name: 'الدرهم الإماراتي',
    flag: 'https://cdn.countryflags.com/thumbs/united-arab-emirates/flag-round-250.png',
    symbol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/960px-UAE_Dirham_Symbol.svg.png',
  },
  {
    code: 'SAR',
    name: 'الريال السعودي',
    flag: 'https://cdn.countryflags.com/thumbs/saudi-arabia/flag-round-250.png',
    symbol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Saudi_Riyal_Symbol.svg/512px-Saudi_Riyal_Symbol.svg.png',
  },
];

export const getStoredCurrencies = () => {
  try {
    const stored = localStorage.getItem('currencies');
    return stored ? JSON.parse(stored) : defaultCurrencies;
  } catch {
    return defaultCurrencies;
  }
};

export const currencies = getStoredCurrencies();

const CurrencyContext = createContext({ currency: currencies[0], setCurrency: () => {}, currencies });

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(currencies[0]);
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const getPriceForCurrency = (book, code) => {
  if (!book) return 0;
  const val = book.prices?.[code] ?? book.price;
  return Number(val || 0);
};
