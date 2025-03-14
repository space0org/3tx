import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, Download, Plus, History, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useWallet } from '../contexts/WalletContext';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { useNetwork, NetworkType } from '../contexts/NetworkContext';
import { setupMainButton, hideBackButton } from '../services/telegram';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { network, setNetwork } = useNetwork();
  const { wallet, tokens, selectedToken, selectToken, refreshBalances } = useWallet();
  const { wallet: solanaWallet, tokens: solanaTokens, selectedToken: selectedSolanaToken, selectToken: selectSolanaToken, refreshBalances: refreshSolanaBalances } = useSolanaWallet();

  const activeWallet = network === 'ethereum' ? wallet : solanaWallet;
  const activeTokens = network === 'ethereum' ? tokens : solanaTokens;
  const activeSelectedToken = network === 'ethereum' ? selectedToken : selectedSolanaToken;
  const activeSelectToken = network === 'ethereum' ? selectToken : selectSolanaToken;

  useEffect(() => {
    hideBackButton();
    if (network === 'ethereum') {
      refreshBalances();
    } else {
      refreshSolanaBalances();
    }
    
    // Setup Telegram main button
    setupMainButton(t('wallet.send'), () => {
      navigate('/send');
    });
  }, [network]);

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
  };

  if (!activeWallet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('wallet.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-2 mb-4">
              <Button 
                variant={network === 'ethereum' ? 'default' : 'outline'} 
                onClick={() => handleNetworkChange('ethereum')}
                className="flex-1"
              >
                {t('network.ethereum')}
              </Button>
              <Button 
                variant={network === 'solana' ? 'default' : 'outline'} 
                onClick={() => handleNetworkChange('solana')}
                className="flex-1"
              >
                {t('network.solana')}
              </Button>
            </div>
            <Button onClick={() => navigate('/import')} className="flex items-center gap-2">
              <Download size={18} />
              {t('wallet.import')}
            </Button>
            <Button onClick={() => navigate('/create')} variant="outline" className="flex items-center gap-2">
              <Plus size={18} />
              {t('wallet.create')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 pb-16">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('wallet.title')}</h1>
        <div className="flex gap-2">
          <Button 
            variant={network === 'ethereum' ? 'default' : 'outline'} 
            onClick={() => handleNetworkChange('ethereum')}
            size="sm"
          >
            ETH
          </Button>
          <Button 
            variant={network === 'solana' ? 'default' : 'outline'} 
            onClick={() => handleNetworkChange('solana')}
            size="sm"
          >
            SOL
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {activeTokens.map((token) => (
          <Button
            key={token.symbol}
            variant={activeSelectedToken?.symbol === token.symbol ? 'default' : 'outline'}
            onClick={() => activeSelectToken(token.symbol)}
            className="flex-shrink-0"
          >
            {t(`crypto.${token.symbol.toLowerCase()}`)}
          </Button>
        ))}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('wallet.balance')}</CardTitle>
        </CardHeader>
        <CardContent className="text-4xl font-bold">
          {activeSelectedToken?.balance} {activeSelectedToken?.symbol}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button onClick={() => navigate('/send')} className="flex items-center justify-center gap-2">
          <Send size={18} />
          {t('wallet.send')}
        </Button>
        <Button onClick={() => navigate('/receive')} variant="outline" className="flex items-center justify-center gap-2">
          <Download size={18} />
          {t('wallet.receive')}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/private-key')} 
          variant="outline" 
          className="flex items-center justify-center gap-2"
        >
          <Key size={18} />
          {t('wallet.viewPrivateKey')}
        </Button>
        <Button 
          onClick={() => navigate('/customs/history')} 
          variant="outline" 
          className="flex items-center justify-center gap-2"
        >
          <History size={18} />
          {t('customs.history')}
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
