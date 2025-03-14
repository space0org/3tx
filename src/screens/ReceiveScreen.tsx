import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useWallet } from '../contexts/WalletContext';
import { setupBackButton } from '../services/telegram';

const ReceiveScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wallet, selectedToken } = useWallet();

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
  }, [navigate]);

  const handleCopyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
    }
  };

  if (!wallet) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('wallet.walletAddress')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full">
            <Input
              value={wallet.address}
              readOnly
              className="font-mono text-xs"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 w-full flex items-center justify-center gap-2"
              onClick={handleCopyAddress}
            >
              <Copy size={16} />
              {t('wallet.copy')}
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={wallet.address} size={200} />
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            {t('wallet.scanToReceive')} {selectedToken?.symbol}
          </p>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            {t('wallet.back')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiveScreen;
