import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useCustoms } from '../contexts/CustomsContext';
import { setupBackButton } from '../services/telegram';

const CustomsHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { customsHistory, refreshHistory } = useCustoms();

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
    
    refreshHistory();
  }, [navigate, refreshHistory]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('customs.status.pending');
      case 'paid':
        return t('customs.status.paid');
      case 'exempted':
        return t('customs.status.exempted');
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'paid':
        return 'text-green-500';
      case 'exempted':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('customs.history')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {customsHistory.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t('customs.noHistory')}
            </p>
          ) : (
            customsHistory.map((item) => (
              <Card key={item.id} className="w-full">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">{t('wallet.enterAmount')}</div>
                    <div className="text-sm font-medium text-right">
                      {item.amount} {item.tokenSymbol}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">{t('customs.amount')}</div>
                    <div className="text-sm font-medium text-right">
                      {item.customsAmount} {item.tokenSymbol}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">{t('customs.status')}</div>
                    <div className={`text-sm font-medium text-right ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">{t('customs.date')}</div>
                    <div className="text-sm font-medium text-right">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {item.status === 'paid' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => navigate('/customs/receipt', { state: { customsInfo: item } })}
                    >
                      {t('customs.viewReceipt')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate('/')}
      >
        {t('wallet.back')}
      </Button>
    </div>
  );
};

export default CustomsHistoryScreen;
