/**
 * Live Score Controller Tab (Tournament Detail - Referee Only)
 * Manage ongoing match scores and end match
 *
 * Features to implement:
 * - Display list of ongoing/active matches assigned to this referee
 *   - Show: Match ID, players/teams, current score status
 *   - Filter/search: by match ID, player names
 * - Click match card to expand and reveal score input form:
 *   - Match details header: players, category, stage
 *   - Current score display (if any)
 *   - Set-by-set score input form:
 *     - Multiple set rows with points input fields
 *     - Points per set validation (typically first to 11 points, win by 2)
 *   - Update score in real-time: POST/PATCH match score update
 *   - "End Match" button to mark match as completed
 *   - After end match → match disappears from this list, appears in Results Submission
 * - State management: React Query for ongoing matches list + mutations
 * - Error handling: validation feedback for invalid scores
 *
 * Reference: Moved from src/pages/Referee/LiveScoreController/
 */

export default function LiveScoreControllerTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Live Score Controller</h2>
      <p className="text-muted-foreground mt-4">
        TODO: List of ongoing matches with score update and end match
        functionality
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• List of ongoing matches assigned to this referee</li>
        <li>• Search/filter by match ID or player names</li>
        <li>• Click to expand and show score input form</li>
        <li>• Set-by-set score input with validation</li>
        <li>• "End Match" button to mark completion</li>
        <li>• Real-time API updates</li>
      </ul>
    </div>
  );
}
