/**
 * Match Control Center Tab (Tournament Detail - Chief Referee Only)
 * Manage and monitor upcoming matches for tournament
 *
 * Features to implement:
 * - Display list of upcoming/scheduled matches for this tournament
 *   - Show: Match ID, players/teams, scheduled date/time, category, stage, assigned referee
 * - Search:
 *   - By match ID
 *   - By player names
 * - Filters:
 *   - By date/date range
 *   - By category/event
 *   - By stage (Round Robin, Knockout, etc.)
 *   - By assigned referee name
 * - Sort options: by date, by stage, by referee
 * - Click match → expand to show full match details (read-only, for monitoring)
 *   - Can view assigned referee assignment
 *   - Monitor match preparation status
 * - Ability to reassign matches if needed (API: PATCH match/assign endpoint)
 * - State management: React Query for upcoming matches list
 *
 * Reference: Moved from src/pages/Referee/AssignedMatches/
 */

export default function MatchControlCenterTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Match Control Center</h2>
      <p className="text-muted-foreground mt-4">
        TODO: List of upcoming matches with search, filters, and assignment
        management
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• List of upcoming/scheduled matches</li>
        <li>• Search: by match ID or player names</li>
        <li>• Filters: date, category, stage, assigned referee</li>
        <li>• Sort: by date, stage, referee</li>
        <li>• Click to view match details and verify assignments</li>
        <li>• Ability to reassign matches if needed</li>
      </ul>
    </div>
  );
}
