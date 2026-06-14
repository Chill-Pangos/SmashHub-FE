import { useTranslation } from "react-i18next";

export default function GroupStageDraw() {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">{t('tournamentManager.placeholders.groupStageDrawTitle', 'Group Stage Draw')}</h1>
      <p className="text-muted-foreground">
        {t('tournamentManager.placeholders.groupStageDrawDesc', 'Placeholder for the Group Stage Draw screen.')}
      </p>
    </div>
  );
}
