import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { CustomsProvider } from "./contexts/CustomsContext";
import HomeScreen from "./screens/HomeScreen";
import CustomsScreen from "./screens/CustomsScreen";
import CustomsHistoryScreen from "./screens/CustomsHistoryScreen";
import CustomsReceiptScreen from "./screens/CustomsReceiptScreen";

// Telegram Mini App 3Xs Wallet
// Implementation of customs duty functionality
const App = () => {
  return (
    <WalletProvider>
      <CustomsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/customs" element={<CustomsScreen />} />
            <Route path="/customs/history" element={<CustomsHistoryScreen />} />
            <Route path="/customs/receipt" element={<CustomsReceiptScreen />} />
          </Routes>
        </BrowserRouter>
      </CustomsProvider>
    </WalletProvider>
  );
};

export default App;
