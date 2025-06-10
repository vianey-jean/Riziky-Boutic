
import React from 'react';
import './App.css';
import AppProviders from './app/AppProviders';
import AppRoutes from './app/AppRoutes';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
