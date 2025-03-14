import React from "react";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { Button } from "../components/ui/button";

// Home screen with customs history button
const HomeScreen = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col p-4">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
      >
        <History size={18} />
        {t("customs.history")}
      </Button>
    </div>
  );
};

export default HomeScreen;
