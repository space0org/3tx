// UUID is used in the CustomsContext, not directly here

export interface CustomsInfo {
  id: string;
  transactionId?: string;
  tokenSymbol: string;
  amount: string;
  customsRate: number;
  customsAmount: string;
  status: 'pending' | 'paid' | 'exempted';
  timestamp: number;
}

export interface CustomsRateTable {
  [tokenSymbol: string]: {
    baseRate: number;
    thresholds: {
      amount: number;
      rate: number;
    }[];
  };
}

// デフォルト関税率テーブル
export const DEFAULT_CUSTOMS_RATES: CustomsRateTable = {
  'USDT': {
    baseRate: 0.10, // 10%
    thresholds: [
      { amount: 1000, rate: 0.15 }, // 1000以上は15%
      { amount: 5000, rate: 0.20 }, // 5000以上は20%
    ],
  },
  'GameCoin': {
    baseRate: 0.05, // 5%
    thresholds: [
      { amount: 1000, rate: 0.08 }, // 1000以上は8%
      { amount: 5000, rate: 0.12 }, // 5000以上は12%
    ],
  },
  'BCM': {
    baseRate: 0.08, // 8%
    thresholds: [
      { amount: 500, rate: 0.12 }, // 500以上は12%
      { amount: 2000, rate: 0.18 }, // 2000以上は18%
    ],
  },
};

// 関税計算関数
export const calculateCustoms = (
  amount: string,
  tokenSymbol: string
): { customsRate: number; customsAmount: string } => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { customsRate: 0, customsAmount: '0.00' };
  }
  
  const rateInfo = DEFAULT_CUSTOMS_RATES[tokenSymbol] || { baseRate: 0, thresholds: [] };
  let rate = rateInfo.baseRate;
  
  // 閾値に基づいて税率を決定
  for (const threshold of rateInfo.thresholds) {
    if (numAmount >= threshold.amount) {
      rate = threshold.rate;
    } else {
      break;
    }
  }
  
  const customsAmount = (numAmount * rate).toFixed(2);
  
  return {
    customsRate: rate,
    customsAmount,
  };
};

// 関税情報の保存
export const saveCustomsInfo = (customsInfo: CustomsInfo): void => {
  const storedInfos = getCustomsHistory();
  storedInfos.push(customsInfo);
  localStorage.setItem('customsHistory', JSON.stringify(storedInfos));
};

// 関税履歴の取得
export const getCustomsHistory = (): CustomsInfo[] => {
  const storedData = localStorage.getItem('customsHistory');
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse customs history', error);
    return [];
  }
};

// 関税支払い処理
export const payCustomsDuty = async (
  customsInfo: CustomsInfo
): Promise<boolean> => {
  // 実際のアプリでは、ここで支払い処理を実行
  // このモックでは、単に状態を更新
  customsInfo.status = 'paid';
  
  // 履歴を更新
  const history = getCustomsHistory();
  const updatedHistory = history.map(item => 
    item.id === customsInfo.id ? customsInfo : item
  );
  
  localStorage.setItem('customsHistory', JSON.stringify(updatedHistory));
  
  return true;
};

// 関税領収書の生成
export const generateCustomsReceipt = (
  customsInfo: CustomsInfo
): string => {
  // 実際のアプリでは、PDFなどの領収書を生成
  // このモックでは、単に文字列を返す
  return `
    関税領収書
    ID: ${customsInfo.id}
    トークン: ${customsInfo.tokenSymbol}
    金額: ${customsInfo.amount}
    関税率: ${(customsInfo.customsRate * 100).toFixed(2)}%
    関税額: ${customsInfo.customsAmount}
    状態: ${customsInfo.status === 'paid' ? '支払い済み' : '未払い'}
    日時: ${new Date(customsInfo.timestamp).toLocaleString()}
  `;
};
