/**
 * Match Results Review Tab (Tournament Detail - Chief Referee Only)
 * Approve or reject match results submitted by referees
 *
 * Features to implement:
 * - Split-screen layout:
 *   - LEFT PANEL: List of matches with results pending chief approval
 *     - Display as selectable cards/rows showing:
 *       - Match ID, players, submitted score, submission timestamp, referee name
 *     - Highlight selected match
 *     - Filter/search by match ID, player names, referee name
 *     - Sort: by submission time, by referee, by players
 *   - RIGHT PANEL: Detail view of selected match
 *     - Match info header: players/teams, category, stage, date
 *     - Submitted score display:
 *       - Set-by-set scores
 *       - Game scores per set
 *       - Final score/winner
 *     - ELO information:
 *       - Player 1: ELO before match → ELO after match (Δ +/-)
 *       - Player 2: ELO before match → ELO after match (Δ +/-)
 *     - Metadata:
 *       - Referee who submitted
 *       - Submission timestamp
 *     - Action buttons:
 *       - "Approve Result" button
 *         - PATCH /matches/:id/approve
 *         - Show success toast
 *         - Move match from pending list
 *         - Update tournament standings/ELO
 *       - "Reject & Request Resubmission" button
 *         - Opens modal/dialog for rejection comment
 *         - PATCH /matches/:id/reject with comment
 *         - Match returns to referee's Results Submission tab for correction
 *         - Show toast "Result rejected, notify referee"
 * - Empty state: "No pending results to review"
 * - Error handling: show API errors, retry capability
 *
 * Reference: Merged from src/pages/Referee/MatchApprovalDashboard/ and ApprovalDetailEloPreview/
 */

export default function MatchResultsReviewTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Match Results Review</h2>
      <p className="text-muted-foreground mt-4">
        TODO: Split-screen view for reviewing and approving/rejecting match
        results
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• Left: List of pending approval matches (selectable cards)</li>
        <li>• Filter/search by match ID, players, or referee name</li>
        <li>• Right: Detail view with score, ELO before/after, metadata</li>
        <li>• "Approve Result" button with API call and toast</li>
        <li>• "Reject & Request Resubmission" with comment modal</li>
        <li>• Empty state for no pending reviews</li>
      </ul>
    </div>
  );
}
