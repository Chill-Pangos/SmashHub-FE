/**
 * Overview Tab (Tournament Detail - Referee View)
 * View-only tournament basic information
 *
 * Features to implement:
 * - Display tournament header:
 *   - Tournament name, banner/image
 *   - Status (Upcoming, Ongoing, Completed)
 *   - Event dates (start/end)
 * - Tournament details:
 *   - Location/venue
 *   - Description
 *   - Organizer information
 *   - Categories/events list (with event names, entry fees, max participants)
 *   - Total participants count
 *   - Tournament format (Round Robin, Knockout, Swiss, etc.)
 * - All fields are READ-ONLY (unlike Organizer's edit mode)
 * - Reference: Organizer's OverviewTab structure for layout consistency
 */

import { useTranslation } from "react-i18next";

export default function OverviewTab() {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">{t("referee.overviewTab.title", "Tournament Overview")}</h2>
      <p className="text-muted-foreground mt-4">
        {t("referee.overviewTab.todo", "TODO: Display tournament basic information (view-only)")}
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>{t("referee.overviewTab.bullet1", "• Tournament name, status, dates")}</li>
        <li>{t("referee.overviewTab.bullet2", "• Location, description, organizer info")}</li>
        <li>{t("referee.overviewTab.bullet3", "• Categories/events list")}</li>
        <li>{t("referee.overviewTab.bullet4", "• Participant count, tournament format")}</li>
        <li>{t("referee.overviewTab.bullet5", "• All fields in view-only mode")}</li>
      </ul>
    </div>
  );
}
