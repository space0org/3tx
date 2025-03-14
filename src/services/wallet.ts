import { ethers } from 'ethers';

export interface Wallet {
  address: string;
  privateKey: string;
}

export interface Token {
  symbol: string;
  balance: string;
  decimals: number;
}

export const createWallet = (): Wallet => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

export const importWalletFromPrivateKey = (privateKey: string): Wallet => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    throw new Error('Invalid private key');
  }
};

export const getTokenBalance = async (
  _address: string,
  tokenSymbol: string
): Promise<string> => {
  // Mock implementation - in a real app, this would call a blockchain API
  // Return different mock balances based on token symbol for demonstration
  switch (tokenSymbol) {
    case 'USDT':
      return '1000.00';
    case 'GameCoin':
      return '500.00';
    case 'BCM':
      return '250.00';
    default:
      return '0.00';
  }
};

export const sendToken = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string,
  tokenSymbol: string
): Promise<boolean> => {
  // Mock implementation - in a real app, this would send a transaction to the blockchain
  try {
    // Validate inputs
    if (!fromPrivateKey || !toAddress || !amount || !tokenSymbol) {
      throw new Error('Missing required parameters');
    }
    
    // Validate address format
    if (!ethers.isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }
    
    // Validate amount is a number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Invalid amount');
    }
    
    // In a real implementation, we would:
    // 1. Create a wallet from the private key
    // 2. Connect to the appropriate network
    // 3. Get the contract for the token
    // 4. Send the transaction
    
    // For this mock, we just return success
    return true;
  } catch (error) {
    console.error('Error sending token:', error);
    throw error;
  }
};

export const generateQRCode = (address: string): string => {
  // In a real app, this would generate a QR code for the address
  // For now, we just return the address
  return address;
};
