import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateCustoms, saveCustomsInfo, CustomsInfo } from '../services/customs';

interface CustomsContextType {
  calculateTransactionCustoms: (amount: string, tokenSymbol: string) => {
    customsRate: number;
    customsAmount: string;
    totalAmount: string;
  };
  createCustomsInfo: (amount: string, tokenSymbol: string) => CustomsInfo;
}

const CustomsContext = createContext<CustomsContextType | undefined>(undefined);

export const CustomsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 関税計算関数
  const calculateTransactionCustoms = useCallback((amount: string, tokenSymbol: string) => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return {
        customsRate: 0,
        customsAmount: '0.00',
        totalAmount: amount
      };
    }
    
    const { customsRate, customsAmount } = calculateCustoms(amount, tokenSymbol);
    const totalAmount = (numAmount + parseFloat(customsAmount)).toFixed(2);
    
    return {
      customsRate,
      customsAmount,
      totalAmount
    };
  }, []);
  
  // 関税情報作成関数
  const createCustomsInfo = useCallback((amount: string, tokenSymbol: string) => {
    const { customsRate, customsAmount } = calculateCustoms(amount, tokenSymbol);
    
    const customsInfo: CustomsInfo = {
      id: uuidv4(),
      tokenSymbol,
      amount,
      customsRate,
      customsAmount,
      status: 'pending',
      timestamp: Date.now()
    };
    
    saveCustomsInfo(customsInfo);
    
    return customsInfo;
  }, []);
  
  return (
    <CustomsContext.Provider value={{
      calculateTransactionCustoms,
      createCustomsInfo
    }}>
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
