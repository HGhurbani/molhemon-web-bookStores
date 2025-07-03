import React, { createContext, useContext, useState } from 'react';
import { DollarSign, Euro, PoundSterling, Coins, Bitcoin } from 'lucide-react';

export const currencies = [
  { code: 'AED', icon: Coins },
  { code: 'USD', icon: DollarSign },
  { code: 'EUR', icon: Euro },
  { code: 'GBP', icon: PoundSterling },
  { code: 'BTC', icon: Bitcoin },
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
