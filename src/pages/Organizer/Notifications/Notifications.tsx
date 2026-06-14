import { useTranslation } from "react-i18next";

export default function OrganizerNotifications() {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t('tournamentManager.placeholders.notificationsTitle', 'Notifications')}</h1>
      <p className="mt-2 text-muted-foreground">
        {t('tournamentManager.placeholders.notificationsDesc', 'Organizer notification center placeholder.')}
      </p>
    </div>
  );
}
