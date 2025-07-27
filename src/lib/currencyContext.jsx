import React, { createContext, useContext, useState, useEffect } from 'react';

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

const getStoredCurrency = () => {
  try {
    return localStorage.getItem('currency');
  } catch {
    return null;
  }
};

export const countryCurrencyMap = {
  AE: 'AED',
  SA: 'SAR',
  US: 'USD',
  EG: 'EGP',
  KW: 'KWD',
  QA: 'QAR'
};

export const detectUserCurrency = (currencies, defaultCode) => {
  try {
    const locale = navigator.language || '';
    const region = locale.split('-')[1]?.toUpperCase();
    const code = countryCurrencyMap[region];
    if (code) {
      const found = currencies.find(c => c.code === code);
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return currencies.find(c => c.code === defaultCode) || currencies[0];
};

const CurrencyContext = createContext({
  currency: defaultCurrencies[0],
  setCurrency: () => {},
  currencies: defaultCurrencies,
  setCurrencies: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState(getStoredCurrencies());
  const [currency, setCurrencyState] = useState(() => {
    const stored = getStoredCurrency();
    const found = currencies.find(c => c.code === stored);
    return found || currencies[0];
  });

  const setCurrency = (cur) => {
    setCurrencyState(cur);
    try {
      localStorage.setItem('currency', cur.code);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    localStorage.setItem('currencies', JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'currencies') {
        const updated = getStoredCurrencies();
        setCurrencies(updated);
        if (!updated.find((c) => c.code === currency.code)) {
          setCurrency(updated[0]);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies, setCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const getPriceForCurrency = (book, code) => {
  if (!book) return 0;
  const val = book.prices?.[code] ?? book.price;
  return Number(val || 0);
};
