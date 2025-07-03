import React, { createContext, useContext, useState } from 'react';

export const currencies = [
  {
    code: 'AED',
    name: 'الإمارات العربية المتحدة',
    flag: 'https://cdn.countryflags.com/thumbs/united-arab-emirates/flag-round-250.png',
  },
  {
    code: 'USD',
    name: 'دولار أمريكي',
    flag: 'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-round-250.png',
  },
  {
    code: 'EUR',
    name: 'يورو',
    flag: 'https://cdn.countryflags.com/thumbs/european-union/flag-round-250.png',
  },
  {
    code: 'GBP',
    name: 'جنيه إسترليني',
    flag: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-round-250.png',
  },
  {
    code: 'BTC',
    name: 'بيتكوين',
    flag: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?width=32',
  },
];

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
