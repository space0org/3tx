import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useWallet } from '../contexts/WalletContext';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { useNetwork } from '../contexts/NetworkContext';
import { setupMainButton, setupBackButton } from '../services/telegram';

const ImportWalletScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { network } = useNetwork();
  const { importWallet } = useWallet();
  const { importWallet: importSolanaWallet } = useSolanaWallet();
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
    
    setupMainButton(t('wallet.import'), handleImport);
  }, [privateKey, t, navigate]);

  const handleImport = () => {
    if (!privateKey) {
      setError(t('wallet.error.emptyKey'));
      return;
    }
    
    try {
      if (network === 'ethereum') {
        importWallet(privateKey);
      } else {
        importSolanaWallet(privateKey);
      }
      navigate('/');
    } catch (error) {
      setError(t('wallet.error.invalidKey'));
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {network === 'ethereum' 
              ? t('wallet.importEthereum') 
              : t('wallet.importSolana')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('wallet.secretKey')}
            </label>
            <Input
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
                setError('');
              }}
              placeholder={network === 'ethereum' ? "0x..." : "Base58 encoded key..."}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode size={18} />
            {t('wallet.scan')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportWalletScreen;
