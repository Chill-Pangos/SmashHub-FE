/**
 * Tournaments List Page (Referee Portal)
 * Displays tournaments the referee has accepted/joined
 *
 * Features to implement:
 * - Fetch list of tournaments referee has joined (API: GET /referee/tournaments or similar)
 * - Display similar to Organizer's tournament list:
 *   - As card grid or table with columns: tournament name, organizer, dates, status, participants
 *   - Show tournament image/thumbnail if available
 * - Filters:
 *   - Status: Upcoming, Ongoing, Completed
 *   - Date range
 * - Search: by tournament name, organizer
 * - Click tournament card/row → navigate to /referee/tournaments/:tournamentId
 * - Empty state: "You haven't joined any tournaments yet"
 * - Loading state with skeleton cards
 * - Error handling with retry button
 *
 * State management: Use React Query to fetch tournaments list
 * Pagination: If large list, implement pagination (page size, next/prev buttons)
 */

export default function Tournaments() {
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">Tournaments</h1>
      <p className="text-muted-foreground">
        Placeholder for the Tournaments list screen.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        TODO: Display tournaments referee has accepted with search/filter and
        click to detail
      </p>
    </div>
  );
}
