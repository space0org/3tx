// Private key display screen implementation
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Copy, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useWallet } from '../contexts/WalletContext';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { useNetwork } from '../contexts/NetworkContext';
import { setupBackButton } from '../services/telegram';

const PrivateKeyScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { network } = useNetwork();
  const { wallet } = useWallet();
  const { wallet: solanaWallet } = useSolanaWallet();
  const [copied, setCopied] = useState(false);
  
  const activeWallet = network === 'ethereum' ? wallet : solanaWallet;
  const privateKey = activeWallet?.privateKey || '';

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
  }, [navigate]);

  const handleCopyPrivateKey = () => {
    if (activeWallet) {
      navigator.clipboard.writeText(privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!activeWallet) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('wallet.privateKey')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('wallet.privateKeyWarning')}
            </AlertDescription>
          </Alert>

          <div>
            <Input
              value={privateKey}
              readOnly
              className="font-mono text-xs mb-2"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleCopyPrivateKey}
            >
              <Copy size={16} />
              {copied ? t('wallet.copied') : t('wallet.copy')}
            </Button>
          </div>

          <Button
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

export default PrivateKeyScreen;
