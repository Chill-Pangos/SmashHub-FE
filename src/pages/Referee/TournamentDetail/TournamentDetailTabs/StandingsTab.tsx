/**
 * Standings Tab (Tournament Detail - Referee View)
 * View-only group standings and knockout bracket results
 *
 * Features to implement:
 * - Display tournament standings:
 *   - Group stage standings (if applicable):
 *     - Table with player/team names, wins, losses, points, ranking
 *     - Multiple groups if tournament has multiple groups
 *   - Knockout bracket results (if applicable):
 *     - Bracket visualization with match results
 *     - Show winners and progression
 *   - ELO leaderboard:
 *     - Ranking with ELO scores
 *     - ELO change vs before tournament
 * - All fields READ-ONLY
 * - Reference: Organizer's standings display for visual consistency
 */

import { useTranslation } from "react-i18next";

export default function StandingsTab() {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">{t("referee.standingsTab.title", "Standings")}</h2>
      <p className="text-muted-foreground mt-4">
        {t("referee.standingsTab.todo", "TODO: Display group standings, bracket results, and ELO leaderboard (view-only)")}
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>{t("referee.standingsTab.bullet1", "• Group stage standings with win/loss/points")}</li>
        <li>{t("referee.standingsTab.bullet2", "• Knockout bracket visualization")}</li>
        <li>{t("referee.standingsTab.bullet3", "• ELO leaderboard with score changes")}</li>
        <li>{t("referee.standingsTab.bullet4", "• All fields in view-only mode")}</li>
      </ul>
    </div>
  );
}
