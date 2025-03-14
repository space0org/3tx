import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { SolanaWalletProvider } from './contexts/SolanaWalletContext';
import { NetworkProvider } from './contexts/NetworkContext';
import HomeScreen from './screens/HomeScreen';
import ImportWalletScreen from './screens/ImportWalletScreen';
import CreateWalletScreen from './screens/CreateWalletScreen';
import SendScreen from './screens/SendScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import PrivateKeyScreen from './screens/PrivateKeyScreen';
import { initTelegramApp } from './services/telegram';
import './i18n/i18n';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramApp();
  }, []);

  return (
    <NetworkProvider>
      <WalletProvider>
        <SolanaWalletProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/import" element={<ImportWalletScreen />} />
              <Route path="/create" element={<CreateWalletScreen />} />
              <Route path="/send" element={<SendScreen />} />
              <Route path="/receive" element={<ReceiveScreen />} />
              <Route path="/private-key" element={<PrivateKeyScreen />} />
            </Routes>
          </BrowserRouter>
        </SolanaWalletProvider>
      </WalletProvider>
    </NetworkProvider>
  );
};

export default App;
