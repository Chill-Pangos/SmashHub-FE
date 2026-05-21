import { Navigate, Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import RefereeLayout from "@/layouts/RefereeLayout";
import PendingInvitations from "@/pages/Referee/PendingInvitations";
import Tournaments from "@/pages/Referee/Tournaments";
import TournamentDetail from "@/pages/Referee/TournamentDetail";
import Notifications from "@/pages/Referee/Notifications";

interface RefereeRoutesProps {
  refereeRoleId: number;
  chiefRefereeRoleId?: number;
}

/**
 * Referee Routes
 * Routes for referees (Trọng tài)
 */
export default function RefereeRoutes({
  refereeRoleId,
  chiefRefereeRoleId,
}: RefereeRoutesProps) {
  const refereeRoleIds = [refereeRoleId, chiefRefereeRoleId].filter(
    (id): id is number => typeof id === "number",
  );

  return (
    <>
      <Route
        element={
          <RoleGuard allowedRoles={refereeRoleIds}>
            <RefereeLayout />
          </RoleGuard>
        }
      >
        <Route
          path="/referee"
          element={<Navigate to="/referee/invitations" replace />}
        />
        <Route path="/referee/invitations" element={<PendingInvitations />} />
        <Route path="/referee/tournaments" element={<Tournaments />} />
        <Route
          path="/referee/tournaments/:tournamentId"
          element={<TournamentDetail />}
        />
        <Route path="/referee/notifications" element={<Notifications />} />
      </Route>
    </>
  );
}
