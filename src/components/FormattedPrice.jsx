import React from 'react';
import { useCurrency, getPriceForCurrency } from '@/lib/currencyContext.jsx';

const FormattedPrice = ({ book, value }) => {
  const { currency } = useCurrency();
  const Icon = currency.icon;
  const priceValue = value !== undefined ? value : getPriceForCurrency(book, currency.code);
  const amount = Number(priceValue || 0).toFixed(2);
  return (
    <span className="inline-flex items-center gap-0.5">
      {amount}
      <Icon className="w-3.5 h-3.5" />
    </span>
  );
};

export default FormattedPrice;
