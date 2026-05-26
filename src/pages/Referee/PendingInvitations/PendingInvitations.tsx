/**
 * Pending Invitations Page
 * Displays tournament invitations awaiting referee acceptance/rejection
 *
 * Features to implement:
 * - Fetch list of pending tournament invitations for current referee (API: GET /referee/invitations?status=pending)
 * - Display as cards or table with columns: tournament name, organizer, event date, location, status
 * - Filter: by tournament status, date range
 * - Search: by tournament name, organizer name
 * - Actions per invitation:
 *   - Accept button → sends PATCH /referee/invitations/:id/accept → redirects user to tournaments/:id
 *   - Decline button → sends PATCH /referee/invitations/:id/decline → shows success toast
 * - Empty state: "No pending invitations"
 * - Loading state with skeleton cards
 * - Error handling with retry button
 *
 * Accepted invitations should appear in the Tournaments list immediately
 * State management: Consider using React Query for invitation list + mutations
 */

export default function PendingInvitations() {
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">Pending Invitations</h1>
      <p className="text-muted-foreground">
        Placeholder for the Pending Invitations screen.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        TODO: Display list of pending tournament invitations with Accept/Decline
        actions
      </p>
    </div>
  );
}
