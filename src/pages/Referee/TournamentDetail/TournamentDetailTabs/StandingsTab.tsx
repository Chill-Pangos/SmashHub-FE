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

export default function StandingsTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Standings</h2>
      <p className="text-muted-foreground mt-4">
        TODO: Display group standings, bracket results, and ELO leaderboard
        (view-only)
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• Group stage standings with win/loss/points</li>
        <li>• Knockout bracket visualization</li>
        <li>• ELO leaderboard with score changes</li>
        <li>• All fields in view-only mode</li>
      </ul>
    </div>
  );
}
