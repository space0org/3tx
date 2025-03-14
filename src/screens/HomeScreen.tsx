import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useWallet } from '../contexts/WalletContext';
import { setupMainButton, hideBackButton } from '../services/telegram';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wallet, tokens, selectedToken, selectToken, refreshBalances } = useWallet();

  useEffect(() => {
    hideBackButton();
    refreshBalances();
    
    // Setup Telegram main button
    setupMainButton(t('wallet.send'), () => {
      navigate('/send');
    });
  }, []);

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('wallet.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
      <h1 className="text-2xl font-bold mb-6">{t('wallet.title')}</h1>
      
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tokens.map((token) => (
          <Button
            key={token.symbol}
            variant={selectedToken?.symbol === token.symbol ? 'default' : 'outline'}
            onClick={() => selectToken(token.symbol)}
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
          {selectedToken?.balance} {selectedToken?.symbol}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => navigate('/send')} className="flex items-center justify-center gap-2">
          <Send size={18} />
          {t('wallet.send')}
        </Button>
        <Button onClick={() => navigate('/receive')} variant="outline" className="flex items-center justify-center gap-2">
          <Download size={18} />
          {t('wallet.receive')}
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
