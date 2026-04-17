import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CurrencyType = 'LKR' | 'USD';

interface CurrencyContextProps {
  currency: CurrencyType;
  currencySymbol: string;
  setCurrency: (c: CurrencyType) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextProps>({
  currency: 'LKR',
  currencySymbol: 'Rs.',
  setCurrency: async () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>('LKR');

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const stored = await AsyncStorage.getItem('@preferred_currency');
        if (stored === 'USD' || stored === 'LKR') {
          setCurrencyState(stored as CurrencyType);
        }
      } catch (e) {
        console.error('Failed to load currency', e);
      }
    };
    loadCurrency();
  }, []);

  const setCurrency = async (newCurrency: CurrencyType) => {
    try {
      await AsyncStorage.setItem('@preferred_currency', newCurrency);
      setCurrencyState(newCurrency);
    } catch (e) {
      console.error('Failed to save currency', e);
    }
  };

  const currencySymbol = currency === 'LKR' ? 'Rs.' : '$';

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
