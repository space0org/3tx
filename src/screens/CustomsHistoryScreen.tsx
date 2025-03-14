import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getCustomsHistory, CustomsInfo } from '../services/customs';
import { setupBackButton } from '../services/telegram';

const CustomsHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<CustomsInfo[]>([]);

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
    
    // 関税履歴を取得
    const customsHistory = getCustomsHistory();
    setHistory(customsHistory);
  }, [navigate]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusText = (status: string) => {
    return t(`customs.status.${status}`);
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('customs.history')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t('customs.noHistory')}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <Card key={item.id} className="bg-muted">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <div className="text-muted-foreground">{t('wallet.enterAmount')}</div>
                      <div className="text-right">{item.amount} {item.tokenSymbol}</div>
                      
                      <div className="text-muted-foreground">{t('customs.amount')}</div>
                      <div className="text-right">{item.customsAmount} {item.tokenSymbol}</div>
                      
                      <div className="text-muted-foreground">{t('customs.status')}</div>
                      <div className="text-right">{getStatusText(item.status)}</div>
                      
                      <div className="text-muted-foreground">{t('customs.date')}</div>
                      <div className="text-right">{formatDate(item.timestamp)}</div>
                    </div>
                    
                    {item.status === 'paid' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => navigate(`/customs/receipt/${item.id}`)}
                      >
                        {t('customs.viewReceipt')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
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

export default CustomsHistoryScreen;
