import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { setupBackButton } from '../services/telegram';
import { CustomsInfo, generateCustomsReceipt } from '../services/customs';

const CustomsReceiptScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [customsInfo, setCustomsInfo] = useState<CustomsInfo | null>(null);
  const [receipt, setReceipt] = useState('');

  useEffect(() => {
    if (location.state?.customsInfo) {
      const info = location.state.customsInfo as CustomsInfo;
      setCustomsInfo(info);
      setReceipt(generateCustomsReceipt(info));
    } else {
      navigate('/');
    }

    setupBackButton(() => {
      navigate('/customs/history');
    });
  }, [location, navigate]);

  if (!customsInfo) {
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('customs.receipt')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="border p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
            {receipt}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // 実際のアプリでは、ここでPDFダウンロードなどを実装
              alert(t('customs.downloadSuccess'));
            }}
          >
            {t('customs.download')}
          </Button>
        </CardContent>
      </Card>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate('/customs/history')}
      >
        {t('wallet.back')}
      </Button>
    </div>
  );
};

export default CustomsReceiptScreen;
