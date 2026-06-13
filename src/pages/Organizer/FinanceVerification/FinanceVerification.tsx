import { useTranslation } from "react-i18next";

export default function FinanceVerification() {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">{t('tournamentManager.placeholders.financeVerificationTitle', 'Finance & Verification')}</h1>
      <p className="text-muted-foreground">
        {t('tournamentManager.placeholders.financeVerificationDesc', 'Placeholder for the Finance & Verification screen.')}
      </p>
    </div>
  );
}
