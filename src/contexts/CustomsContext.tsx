import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomsInfo,
  calculateCustoms,
  saveCustomsInfo,
  getCustomsHistory,
  payCustomsDuty,
} from '../services/customs';

interface CustomsContextType {
  calculateTransactionCustoms: (amount: string, tokenSymbol: string) => { 
    customsRate: number; 
    customsAmount: string;
    totalAmount: string;
  };
  createCustomsInfo: (amount: string, tokenSymbol: string, transactionId?: string) => CustomsInfo;
  payCustoms: (customsInfo: CustomsInfo) => Promise<boolean>;
  customsHistory: CustomsInfo[];
  refreshHistory: () => void;
}

const CustomsContext = createContext<CustomsContextType | undefined>(undefined);

export const CustomsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customsHistory, setCustomsHistory] = useState<CustomsInfo[]>([]);

  useEffect(() => {
    refreshHistory();
  }, []);

  const refreshHistory = () => {
    const history = getCustomsHistory();
    setCustomsHistory(history);
  };

  const calculateTransactionCustoms = (amount: string, tokenSymbol: string) => {
    const { customsRate, customsAmount } = calculateCustoms(amount, tokenSymbol);
    const numAmount = parseFloat(amount) || 0;
    const numCustomsAmount = parseFloat(customsAmount) || 0;
    const totalAmount = (numAmount + numCustomsAmount).toFixed(2);
    
    return {
      customsRate,
      customsAmount,
      totalAmount,
    };
  };

  const createCustomsInfo = (amount: string, tokenSymbol: string, transactionId?: string): CustomsInfo => {
    const { customsRate, customsAmount } = calculateCustoms(amount, tokenSymbol);
    
    const customsInfo: CustomsInfo = {
      id: uuidv4(),
      transactionId,
      tokenSymbol,
      amount,
      customsRate,
      customsAmount,
      status: 'pending',
      timestamp: Date.now(),
    };
    
    saveCustomsInfo(customsInfo);
    refreshHistory();
    
    return customsInfo;
  };

  const payCustoms = async (customsInfo: CustomsInfo): Promise<boolean> => {
    const result = await payCustomsDuty(customsInfo);
    refreshHistory();
    return result;
  };

  return (
    <CustomsContext.Provider
      value={{
        calculateTransactionCustoms,
        createCustomsInfo,
        payCustoms,
        customsHistory,
        refreshHistory,
      }}
    >
      {children}
    </CustomsContext.Provider>
  );
};

export const useCustoms = () => {
  const context = useContext(CustomsContext);
  if (context === undefined) {
    throw new Error('useCustoms must be used within a CustomsProvider');
  }
  return context;
};
