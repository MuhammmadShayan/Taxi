'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Currency configuration for KIRASTAY platform
const CURRENCIES = {
  MAD: { symbol: 'DH', name: 'Moroccan Dirham', code: 'MAD' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' }
};

const DEFAULT_CURRENCY = 'MAD';

// Exchange rates (MAD as base currency)
// In production, these should be fetched from an API
const EXCHANGE_RATES = {
  MAD: 1,
  USD: 0.1,
  EUR: 0.092,
  GBP: 0.079,
  CNY: 0.72,
  JPY: 14.5
};

const CurrencyContext = createContext({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  currencies: CURRENCIES,
  exchangeRates: EXCHANGE_RATES,
  convertAmount: (amount, fromCurrency, toCurrency) => amount,
  formatCurrency: (amount, currencyCode) => amount,
  getSymbol: (currencyCode) => '',
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved currency from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('kirastay_currency');
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save currency to localStorage when changed
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('kirastay_currency', currency);
      
      // Dispatch custom event for components to listen to currency changes
      window.dispatchEvent(new CustomEvent('currencyChange', {
        detail: { currency }
      }));
    }
  }, [currency, isInitialized]);

  // Convert amount from one currency to another
  const convertAmount = useMemo(() => 
    (amount, fromCurrency = 'MAD', toCurrency = currency) => {
      if (!amount || isNaN(amount)) return 0;
      
      const fromRate = exchangeRates[fromCurrency] || 1;
      const toRate = exchangeRates[toCurrency] || 1;
      
      // Convert to MAD first, then to target currency
      const madAmount = amount / fromRate;
      const convertedAmount = madAmount * toRate;
      
      return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
    }, [currency, exchangeRates]
  );

  // Format amount with currency symbol and proper locale
  const formatCurrency = useMemo(() =>
    (amount, currencyCode = currency, locale = 'en-MA') => {
      if (!amount || isNaN(amount)) return `${CURRENCIES[currencyCode]?.symbol || ''}0`;
      
      try {
        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
        
        return formatter.format(amount);
      } catch (error) {
        // Fallback formatting if Intl.NumberFormat fails
        const symbol = CURRENCIES[currencyCode]?.symbol || '';
        return `${symbol}${amount.toLocaleString()}`;
      }
    }, [currency]
  );

  // Get currency symbol
  const getSymbol = (currencyCode = currency) => {
    return CURRENCIES[currencyCode]?.symbol || '';
  };

  // Change currency with validation
  const changeCurrency = (newCurrency) => {
    if (CURRENCIES[newCurrency] && newCurrency !== currency) {
      setCurrency(newCurrency);
    }
  };

  // Fetch latest exchange rates (in production, this would be from an API)
  const updateExchangeRates = async () => {
    try {
      // In a real app, you would fetch from an API like:
      // const response = await fetch('/api/exchange-rates');
      // const rates = await response.json();
      // setExchangeRates(rates);
      
      console.log('Exchange rates updated (mock)');
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  };

  const value = useMemo(() => ({
    currency,
    setCurrency: changeCurrency,
    currencies: CURRENCIES,
    exchangeRates,
    convertAmount,
    formatCurrency,
    getSymbol,
    updateExchangeRates,
    isInitialized
  }), [currency, exchangeRates, convertAmount, formatCurrency, isInitialized]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
