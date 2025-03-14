// Solana wallet context implementation
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SolanaWallet, SolanaToken, createSolanaWallet, importSolanaWalletFromPrivateKey, getSolanaTokenBalance } from '../services/solana/wallet';

interface SolanaWalletContextType {
  wallet: SolanaWallet | null;
  tokens: SolanaToken[];
  createNewWallet: () => void;
  importWallet: (privateKey: string) => void;
  refreshBalances: () => Promise<void>;
  selectedToken: SolanaToken | null;
  selectToken: (symbol: string) => void;
}

const SolanaWalletContext = createContext<SolanaWalletContextType | undefined>(undefined);

export const SolanaWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [tokens, setTokens] = useState<SolanaToken[]>([
    { symbol: 'SOL', balance: '0.00', decimals: 9 },
    { symbol: 'USDT', balance: '0.00', decimals: 6 },
    { symbol: 'GameCoin', balance: '0.00', decimals: 9 },
    { symbol: 'BCM', balance: '0.00', decimals: 9 },
  ]);
  const [selectedToken, setSelectedToken] = useState<SolanaToken | null>(null);

  useEffect(() => {
    // Try to load wallet from localStorage
    const savedWallet = localStorage.getItem('solanaWallet');
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
        refreshBalances();
      } catch (error) {
        console.error('Failed to load Solana wallet', error);
      }
    }
  }, []);

  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0]);
    }
  }, [tokens, selectedToken]);

  const createNewWallet = () => {
    const newWallet = createSolanaWallet();
    setWallet(newWallet);
    localStorage.setItem('solanaWallet', JSON.stringify(newWallet));
    refreshBalances();
  };

  const importWallet = (privateKey: string) => {
    try {
      const importedWallet = importSolanaWalletFromPrivateKey(privateKey);
      setWallet(importedWallet);
      localStorage.setItem('solanaWallet', JSON.stringify(importedWallet));
      refreshBalances();
    } catch (error) {
      console.error('Failed to import Solana wallet', error);
      throw error;
    }
  };

  const refreshBalances = async () => {
    if (!wallet) return;

    const updatedTokens = await Promise.all(
      tokens.map(async (token) => {
        const balance = await getSolanaTokenBalance(wallet.publicKey, token.symbol);
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
    <SolanaWalletContext.Provider
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
    </SolanaWalletContext.Provider>
  );
};

export const useSolanaWallet = () => {
  const context = useContext(SolanaWalletContext);
  if (context === undefined) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
};
