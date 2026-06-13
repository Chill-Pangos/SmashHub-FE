import { useTranslation } from "react-i18next";

export default function BulkImport() {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">{t('tournamentManager.placeholders.bulkImportTitle', 'Bulk Import')}</h1>
      <p className="text-muted-foreground">
        {t('tournamentManager.placeholders.bulkImportDesc', 'Placeholder for the Bulk Import screen.')}
      </p>
    </div>
  );
}
