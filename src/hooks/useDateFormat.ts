import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";

export function useDateFormat() {
  const { i18n } = useTranslation();
  
  const formatDate = (date?: Date | string | number | null, formatStr?: string) => {
    if (!date) return "";
    
    const d = new Date(date);
    const locale = i18n.language === 'vi' ? vi : enUS;
    
    if (formatStr) {
      return format(d, formatStr, { locale });
    }
    
    // Default format
    if (i18n.language === 'vi') {
      return format(d, "dd/MM/yyyy", { locale });
    } else {
      return format(d, "MMMM dd, yyyy", { locale });
    }
  };

  const formatDateTime = (date?: Date | string | number | null) => {
    if (!date) return "";
    
    const d = new Date(date);
    const locale = i18n.language === 'vi' ? vi : enUS;
    
    if (i18n.language === 'vi') {
      return format(d, "dd/MM/yyyy - HH:mm", { locale });
    } else {
      return format(d, "MMM dd, yyyy - HH:mm", { locale });
    }
  };

  return { formatDate, formatDateTime };
}
