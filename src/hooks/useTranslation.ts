import { useTranslation as useI18nTranslation } from "react-i18next";

/**
 * Custom hook for translations with type safety
 * Usage:
 * const { t } = useTranslation();
 * <button>{t('common.save')}</button>
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lng: "vi" | "en") => {
    i18n.changeLanguage(lng);
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language as "vi" | "en",
  };
}

// Export type for autocomplete
export type TranslationKey = string;
