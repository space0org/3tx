// Solana wallet implementation
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import bs58 from 'bs58';

export interface SolanaWallet {
  publicKey: string;
  privateKey: string; // Base58 encoded private key
}

export interface SolanaToken {
  symbol: string;
  balance: string;
  decimals: number;
}

// Solana network connection (devnet for testing)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Create a new Solana wallet
export const createSolanaWallet = (): SolanaWallet => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const privateKey = bs58.encode(keypair.secretKey);

  return {
    publicKey,
    privateKey,
  };
};

// Import a Solana wallet from private key
export const importSolanaWalletFromPrivateKey = (privateKey: string): SolanaWallet => {
  try {
    const secretKey = bs58.decode(privateKey);
    const keypair = Keypair.fromSecretKey(secretKey);
    const publicKey = keypair.publicKey.toString();

    return {
      publicKey,
      privateKey,
    };
  } catch (error) {
    throw new Error('Invalid Solana private key');
  }
};

// Get token balance (mock implementation for now)
export const getSolanaTokenBalance = async (
  publicKey: string,
  tokenSymbol: string
): Promise<string> => {
  // For SOL native token, get actual balance from network
  if (tokenSymbol === 'SOL') {
    try {
      const pubKey = new PublicKey(publicKey);
      const balance = await connection.getBalance(pubKey);
      return (balance / LAMPORTS_PER_SOL).toString();
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      return '0';
    }
  }

  // Mock implementation for other tokens
  switch (tokenSymbol) {
    case 'USDT':
      return '500.00';
    case 'GameCoin':
      return '250.00';
    case 'BCM':
      return '100.00';
    default:
      return '0.00';
  }
};

// Send SOL tokens
export const sendSolanaToken = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: string,
  tokenSymbol: string
): Promise<boolean> => {
  try {
    // Validate inputs
    if (!fromPrivateKey || !toAddress || !amount || !tokenSymbol) {
      throw new Error('Missing required parameters');
    }

    // Validate amount is a number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Invalid amount');
    }

    // For SOL native token, send actual transaction
    if (tokenSymbol === 'SOL') {
      // Create keypair from private key
      const secretKey = bs58.decode(fromPrivateKey);
      const fromKeypair = Keypair.fromSecretKey(secretKey);

      // Create recipient public key
      const toPublicKey = new PublicKey(toAddress);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: numAmount * LAMPORTS_PER_SOL,
        })
      );

      // Set recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromKeypair.publicKey;

      // Sign and send transaction
      const signature = await connection.sendTransaction(transaction, [fromKeypair]);
      await connection.confirmTransaction(signature);

      return true;
    }

    // For other tokens, we would implement SPL token transfers here
    // This is a mock implementation for now
    return true;
  } catch (error) {
    console.error('Error sending Solana token:', error);
    throw error;
  }
};
