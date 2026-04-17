import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { CurrencyProvider } from './src/context/CurrencyContext';

export default function App() {
  return (
    <CurrencyProvider>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </CurrencyProvider>
  );
}
