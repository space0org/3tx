declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        onEvent: (eventType: string, callback: (...args: any[]) => void) => void;
        offEvent: (eventType: string, callback: (...args: any[]) => void) => void;
        sendData: (data: any) => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
          secondary_bg_color: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
      };
    };
  }
}

export const initTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
};

export const setupMainButton = (text: string, callback: () => void) => {
  if (window.Telegram?.WebApp?.MainButton) {
    window.Telegram.WebApp.MainButton.setText(text);
    window.Telegram.WebApp.MainButton.onClick(callback);
    window.Telegram.WebApp.MainButton.show();
  }
};

export const setupBackButton = (callback: () => void) => {
  if (window.Telegram?.WebApp?.BackButton) {
    window.Telegram.WebApp.BackButton.onClick(callback);
    window.Telegram.WebApp.BackButton.show();
  }
};

export const hideBackButton = () => {
  if (window.Telegram?.WebApp?.BackButton) {
    window.Telegram.WebApp.BackButton.hide();
  }
};

export const getColorScheme = () => {
  return window.Telegram?.WebApp?.colorScheme || 'dark';
};

export const getThemeParams = () => {
  return window.Telegram?.WebApp?.themeParams;
};

export const getUserInfo = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
};
