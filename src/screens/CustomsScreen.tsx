import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useCustoms } from '../contexts/CustomsContext';
import { setupMainButton, setupBackButton } from '../services/telegram';
import { CustomsInfo } from '../services/customs';

const CustomsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { payCustoms } = useCustoms();
  const [customsInfo, setCustomsInfo] = useState<CustomsInfo | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.customsInfo) {
      setCustomsInfo(location.state.customsInfo);
    } else {
      navigate('/');
    }

    setupBackButton(() => {
      navigate('/send');
    });
    
    setupMainButton(t('customs.pay'), handlePayCustoms);
  }, [location, navigate, t]);

  const handlePayCustoms = async () => {
    if (!customsInfo) return;
    
    try {
      setIsPaying(true);
      await payCustoms(customsInfo);
      navigate('/customs/receipt', { state: { customsInfo } });
    } catch (error) {
      console.error('Error paying customs:', error);
      setError(String(error));
    } finally {
      setIsPaying(false);
    }
  };

  if (!customsInfo) {
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('customs.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">{t('wallet.enterAmount')}</div>
            <div className="text-sm font-medium text-right">
              {customsInfo.amount} {customsInfo.tokenSymbol}
            </div>
            
            <div className="text-sm text-muted-foreground">{t('customs.rate')}</div>
            <div className="text-sm font-medium text-right">
              {(customsInfo.customsRate * 100).toFixed(2)}%
            </div>
            
            <div className="text-sm text-muted-foreground">{t('customs.amount')}</div>
            <div className="text-sm font-medium text-right">
              {customsInfo.customsAmount} {customsInfo.tokenSymbol}
            </div>
            
            <div className="text-sm font-bold">{t('customs.total')}</div>
            <div className="text-sm font-bold text-right">
              {(parseFloat(customsInfo.amount) + parseFloat(customsInfo.customsAmount)).toFixed(2)} {customsInfo.tokenSymbol}
            </div>
          </div>
          
          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>
      </Card>
      
      {isPaying && (
        <div className="text-center">
          <p>{t('customs.processing')}</p>
        </div>
      )}
      
      <Button 
        onClick={handlePayCustoms} 
        className="w-full mb-2"
        disabled={isPaying}
      >
        {t('customs.pay')}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate('/send')}
        disabled={isPaying}
      >
        {t('wallet.back')}
      </Button>
    </div>
  );
};

export default CustomsScreen;
