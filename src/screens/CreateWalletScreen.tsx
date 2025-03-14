import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useWallet } from '../contexts/WalletContext';
import { setupMainButton, setupBackButton } from '../services/telegram';

const CreateWalletScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createNewWallet } = useWallet();

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
    
    setupMainButton(t('wallet.create'), handleCreate);
  }, [t, navigate]);

  const handleCreate = () => {
    try {
      createNewWallet();
      navigate('/');
    } catch (error) {
      console.error('Failed to create wallet', error);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('wallet.create')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t('wallet.createDescription')}
          </p>
          
          <Button onClick={handleCreate} className="w-full">
            {t('wallet.create')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            {t('wallet.cancel')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWalletScreen;
