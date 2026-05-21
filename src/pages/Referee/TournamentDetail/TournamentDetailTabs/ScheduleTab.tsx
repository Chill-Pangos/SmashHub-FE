/**
 * Schedule Tab (Tournament Detail - Referee View)
 * View-only match schedule and calendar
 *
 * Features to implement:
 * - Display tournament schedule:
 *   - Calendar view or list view of matches
 *   - Match details: ID, players/teams, date/time, category, stage, status
 * - Filters:
 *   - By date range
 *   - By category/event
 *   - By stage (Round Robin, Knockout, etc.)
 *   - By match status (Scheduled, Ongoing, Completed)
 * - Search:
 *   - By player name
 *   - By match ID
 * - Click match → show expanded details (but view-only)
 * - All fields READ-ONLY
 * - Reference: Organizer's ScheduleTab for layout consistency
 */

export default function ScheduleTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Schedule</h2>
      <p className="text-muted-foreground mt-4">
        TODO: Display tournament schedule with filters and search (view-only)
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• Calendar/list view of matches</li>
        <li>• Match details: ID, players, date/time, category, status</li>
        <li>• Filters: date, category, stage, status</li>
        <li>• Search: by player name or match ID</li>
        <li>• Click match to expand details (view-only)</li>
      </ul>
    </div>
  );
}
