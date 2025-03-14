import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useWallet } from '../contexts/WalletContext';
import { useCustoms } from '../contexts/CustomsContext';
import { setupMainButton, setupBackButton } from '../services/telegram';
import { sendToken } from '../services/wallet';

const SendScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wallet, selectedToken } = useWallet();
  const { calculateTransactionCustoms, createCustomsInfo } = useCustoms();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customsInfo, setCustomsInfo] = useState<{
    customsRate: number;
    customsAmount: string;
    totalAmount: string;
  } | null>(null);

  useEffect(() => {
    setupBackButton(() => {
      navigate('/');
    });
    
    setupMainButton(t('wallet.confirm'), handleSend);
  }, [recipient, amount, t, navigate]);

  // 金額が変更されたときに関税を計算
  useEffect(() => {
    if (amount && selectedToken) {
      const info = calculateTransactionCustoms(amount, selectedToken.symbol);
      setCustomsInfo(info);
    } else {
      setCustomsInfo(null);
    }
  }, [amount, selectedToken, calculateTransactionCustoms]);

  const handleSend = async () => {
    if (!wallet || !selectedToken) return;
    
    if (!recipient) {
      setError(t('wallet.error.emptyAddress'));
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError(t('wallet.error.invalidAmount'));
      return;
    }
    
    try {
      // 関税情報を作成
      if (customsInfo && parseFloat(customsInfo.customsAmount) > 0) {
        const info = createCustomsInfo(amount, selectedToken.symbol);
        navigate('/customs', { state: { customsInfo: info } });
        return;
      }
      
      // 関税がない場合は直接送金
      setIsSending(true);
      await sendToken(
        wallet.privateKey,
        recipient,
        amount,
        selectedToken.symbol
      );
      navigate('/');
    } catch (error) {
      console.error('Error sending token:', error);
      setError(String(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>{t('wallet.send')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('wallet.enterAddress')}
            </label>
            <Input
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                setError('');
              }}
              placeholder="0x..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('wallet.enterAmount')}
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="0.00"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {selectedToken?.symbol} - {t('wallet.balance')}: {selectedToken?.balance}
            </p>
          </div>
          
          {customsInfo && parseFloat(customsInfo.customsAmount) > 0 && (
            <Card className="bg-muted">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">{t('customs.info')}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">{t('customs.rate')}</div>
                  <div className="text-right">{(customsInfo.customsRate * 100).toFixed(2)}%</div>
                  
                  <div className="text-muted-foreground">{t('customs.amount')}</div>
                  <div className="text-right">{customsInfo.customsAmount} {selectedToken?.symbol}</div>
                  
                  <div className="font-medium">{t('customs.total')}</div>
                  <div className="font-medium text-right">{customsInfo.totalAmount} {selectedToken?.symbol}</div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>
      </Card>
      
      {isSending && (
        <div className="text-center">
          <p>{t('wallet.sending')}</p>
        </div>
      )}
    </div>
  );
};

export default SendScreen;
