import React, { createContext, useContext, useState, useEffect } from 'react';
import { Wallet, Token, createWallet, importWalletFromPrivateKey, getTokenBalance } from '../services/wallet';

interface WalletContextType {
  wallet: Wallet | null;
  tokens: Token[];
  createNewWallet: () => void;
  importWallet: (privateKey: string) => void;
  refreshBalances: () => Promise<void>;
  selectedToken: Token | null;
  selectToken: (symbol: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [tokens, setTokens] = useState<Token[]>([
    { symbol: 'USDT', balance: '0.00', decimals: 6 },
    { symbol: 'GameCoin', balance: '0.00', decimals: 18 },
    { symbol: 'BCM', balance: '0.00', decimals: 18 },
  ]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    // Try to load wallet from localStorage
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
        refreshBalances();
      } catch (error) {
        console.error('Failed to load wallet', error);
      }
    }
  }, []);

  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0]);
    }
  }, [tokens, selectedToken]);

  const createNewWallet = () => {
    const newWallet = createWallet();
    setWallet(newWallet);
    localStorage.setItem('wallet', JSON.stringify(newWallet));
    refreshBalances();
  };

  const importWallet = (privateKey: string) => {
    try {
      const importedWallet = importWalletFromPrivateKey(privateKey);
      setWallet(importedWallet);
      localStorage.setItem('wallet', JSON.stringify(importedWallet));
      refreshBalances();
    } catch (error) {
      console.error('Failed to import wallet', error);
      throw error;
    }
  };

  const refreshBalances = async () => {
    if (!wallet) return;

    const updatedTokens = await Promise.all(
      tokens.map(async (token) => {
        const balance = await getTokenBalance(wallet.address, token.symbol);
        return { ...token, balance };
      })
    );

    setTokens(updatedTokens);
  };

  const selectToken = (symbol: string) => {
    const token = tokens.find((t) => t.symbol === symbol);
    if (token) {
      setSelectedToken(token);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        tokens,
        createNewWallet,
        importWallet,
        refreshBalances,
        selectedToken,
        selectToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
