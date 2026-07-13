import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    </AppProvider>
  );
}