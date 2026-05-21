/**
 * Results Submission Tab (Tournament Detail - Referee Only)
 * Submit completed match results for chief referee approval
 *
 * Features to implement:
 * - Split-screen layout:
 *   - LEFT PANEL: List of completed matches (marked "End Match" by this referee)
 *     - Display as selectable cards/rows showing:
 *       - Match ID, players, final score, completion time
 *     - Highlight selected match
 *     - Filter/search by match ID, player names
 *   - RIGHT PANEL: Detail view of selected match
 *     - Match header: players, category, stage
 *     - Final score display (set-by-set scores, total points)
 *     - Match metadata (date, venue, duration)
 *     - "Submit Result" button
 * - On submit:
 *   - POST /matches/:id/submit (or similar endpoint)
 *   - Show success toast "Result submitted for approval"
 *   - Move match to "awaiting approval" state (disappears from this list)
 * - Empty state: "No completed matches awaiting submission"
 * - Error handling: show why match can't be submitted
 *
 * Reference: Moved from src/pages/Referee/MatchSubmission/
 */

export default function ResultsSubmissionTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Results Submission</h2>
      <p className="text-muted-foreground mt-4">
        TODO: Split-screen list of completed matches with submit functionality
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• Left: List of completed matches (selectable cards)</li>
        <li>• Filter/search by match ID or player names</li>
        <li>• Right: Detail view of selected match with final score</li>
        <li>• "Submit Result" button for chief referee approval</li>
        <li>• Success toast after submission</li>
        <li>• Empty state for no pending matches</li>
      </ul>
    </div>
  );
}
