import { useTranslation } from "react-i18next";

export default function CategoryManagement() {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">{t('tournamentManager.placeholders.categoryManagementTitle', 'Category Management')}</h1>
      <p className="text-muted-foreground">
        {t('tournamentManager.placeholders.categoryManagementDesc', 'Placeholder for the Category Management screen.')}
      </p>
    </div>
  );
}
