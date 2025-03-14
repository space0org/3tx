// Network selection context implementation
import React, { createContext, useContext, useState, useEffect } from 'react';

export type NetworkType = 'ethereum' | 'solana';

interface NetworkContextType {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetworkState] = useState<NetworkType>('ethereum');

  useEffect(() => {
    // Try to load network preference from localStorage
    const savedNetwork = localStorage.getItem('selectedNetwork');
    if (savedNetwork === 'ethereum' || savedNetwork === 'solana') {
      setNetworkState(savedNetwork as NetworkType);
    }
  }, []);

  const setNetwork = (newNetwork: NetworkType) => {
    setNetworkState(newNetwork);
    localStorage.setItem('selectedNetwork', newNetwork);
  };

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
