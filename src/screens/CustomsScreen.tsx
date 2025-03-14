import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useCustoms } from '../contexts/CustomsContext';
import { payCustomsDuty } from '../services/customs';
import { setupBackButton, setupMainButton } from '../services/telegram';

const CustomsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const customsInfo = location.state?.customsInfo;

  useEffect(() => {
    setupBackButton(() => {
      navigate('/send');
    });
    
    setupMainButton(t('customs.pay'), handlePayCustoms);
  }, [t, navigate]);

  // 関税情報がない場合は送金画面に戻る
  if (!customsInfo) {
    navigate('/send');
    return null;
  }

  const handlePayCustoms = async () => {
    try {
      setIsProcessing(true);
      await payCustomsDuty(customsInfo);
      navigate(`/customs/receipt/${customsInfo.id}`);
    } catch (error) {
      console.error('Failed to pay customs duty', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('customs.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">{t('wallet.enterAmount')}</div>
            <div className="text-right">{customsInfo.amount} {customsInfo.tokenSymbol}</div>
            
            <div className="text-muted-foreground">{t('customs.rate')}</div>
            <div className="text-right">{(customsInfo.customsRate * 100).toFixed(2)}%</div>
            
            <div className="text-muted-foreground">{t('customs.amount')}</div>
            <div className="text-right">{customsInfo.customsAmount} {customsInfo.tokenSymbol}</div>
            
            <div className="font-medium">{t('customs.total')}</div>
            <div className="font-medium text-right">
              {(parseFloat(customsInfo.amount) + parseFloat(customsInfo.customsAmount)).toFixed(2)} {customsInfo.tokenSymbol}
            </div>
          </div>
          
          <Button 
            onClick={handlePayCustoms}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? t('customs.processing') : t('customs.pay')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/send')}
            disabled={isProcessing}
          >
            {t('wallet.cancel')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomsScreen;
