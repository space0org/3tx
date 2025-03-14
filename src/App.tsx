import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import HomeScreen from './screens/HomeScreen';
import ImportWalletScreen from './screens/ImportWalletScreen';
import CreateWalletScreen from './screens/CreateWalletScreen';
import SendScreen from './screens/SendScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import { initTelegramApp } from './services/telegram';
import './i18n/i18n';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramApp();
  }, []);

  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/import" element={<ImportWalletScreen />} />
          <Route path="/create" element={<CreateWalletScreen />} />
          <Route path="/send" element={<SendScreen />} />
          <Route path="/receive" element={<ReceiveScreen />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
};

export default App;
