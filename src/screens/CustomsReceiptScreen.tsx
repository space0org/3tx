import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getCustomsHistory, generateCustomsReceipt, CustomsInfo } from '../services/customs';
import { setupBackButton } from '../services/telegram';

const CustomsReceiptScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<CustomsInfo | null>(null);
  const [receiptText, setReceiptText] = useState('');

  useEffect(() => {
    setupBackButton(() => {
      navigate('/customs/history');
    });
    
    if (id) {
      // 関税履歴から領収書情報を取得
      const history = getCustomsHistory();
      const receiptInfo = history.find(item => item.id === id);
      
      if (receiptInfo) {
        setReceipt(receiptInfo);
        const text = generateCustomsReceipt(receiptInfo);
        setReceiptText(text);
      } else {
        navigate('/customs/history');
      }
    }
  }, [id, navigate]);

  const handleDownload = () => {
    if (!receiptText) return;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customs_receipt_${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 成功メッセージを表示
    alert(t('customs.downloadSuccess'));
  };

  if (!receipt) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('customs.receipt')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="bg-muted p-4 rounded-lg font-mono text-xs whitespace-pre-wrap">
            {receiptText}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">{t('wallet.enterAmount')}</div>
            <div className="text-right">{receipt.amount} {receipt.tokenSymbol}</div>
            
            <div className="text-muted-foreground">{t('customs.rate')}</div>
            <div className="text-right">{(receipt.customsRate * 100).toFixed(2)}%</div>
            
            <div className="text-muted-foreground">{t('customs.amount')}</div>
            <div className="text-right">{receipt.customsAmount} {receipt.tokenSymbol}</div>
            
            <div className="text-muted-foreground">{t('customs.status')}</div>
            <div className="text-right">{t(`customs.status.${receipt.status}`)}</div>
            
            <div className="text-muted-foreground">{t('customs.date')}</div>
            <div className="text-right">{formatDate(receipt.timestamp)}</div>
          </div>
          
          <Button 
            onClick={handleDownload}
            className="w-full"
          >
            {t('customs.download')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/customs/history')}
          >
            {t('wallet.back')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomsReceiptScreen;
