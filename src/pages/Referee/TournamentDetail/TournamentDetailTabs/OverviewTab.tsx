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

export default function OverviewTab() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold">Tournament Overview</h2>
      <p className="text-muted-foreground mt-4">
        TODO: Display tournament basic information (view-only)
      </p>
      <ul className="text-sm text-muted-foreground mt-4 space-y-2">
        <li>• Tournament name, status, dates</li>
        <li>• Location, description, organizer info</li>
        <li>• Categories/events list</li>
        <li>• Participant count, tournament format</li>
        <li>• All fields in view-only mode</li>
      </ul>
    </div>
  );
}
