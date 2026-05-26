/**
 * Notifications Page (Referee Portal)
 * General notifications for referee activities
 *
 * Features to implement:
 * - Fetch notifications: GET /referee/notifications?page=1&limit=20 (with pagination)
 * - Display as a list with:
 *   - Notification icon (based on type)
 *   - Message/title
 *   - Timestamp (e.g., "2 hours ago")
 *   - Read/unread indicator (dot or highlight)
 *   - Click to view detail or navigate to relevant page
 *
 * Notification types:
 * 1. Invitation accepted/declined by tournament organizer
 * 2. Match assignment (chief referee assigns match to this referee)
 * 3. Match start time changed/postponed
 * 4. Result submission received (chief referee notifies regular referee)
 * 5. Result approval/rejection (chief referee approves/rejects submitted result)
 * 6. General tournament updates (if watching/subscribed)
 *
 * Features:
 * - Filter: by type (All, Invitations, Assignments, Submissions, etc.)
 * - Search: by tournament name, message text
 * - Mark as read/unread
 * - Delete notification
 * - Pagination or infinite scroll
 *
 * Empty state: "No notifications"
 * Loading state: skeleton list items
 *
 * State management: Use React Query with infinite query for pagination
 */

export default function Notifications() {
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="text-muted-foreground">
        Placeholder for the Notifications screen.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        TODO: Display referee notifications (invitations, assignments, result
        approvals, etc.)
      </p>
    </div>
  );
}
