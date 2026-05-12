import { Route, Outlet } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import Invitations from "@/pages/Referee/Invitations/Invitations";
import AssignedMatches from "@/pages/Referee/AssignedMatches/AssignedMatches";
import LiveScoreController from "@/pages/Referee/LiveScoreController/LiveScoreController";
import MatchSubmission from "@/pages/Referee/MatchSubmission/MatchSubmission";
import MatchApprovalDashboard from "@/pages/Referee/MatchApprovalDashboard/MatchApprovalDashboard";
import ApprovalDetailEloPreview from "@/pages/Referee/ApprovalDetailEloPreview/ApprovalDetailEloPreview";

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

  const chiefRoleIds = [chiefRefereeRoleId].filter(
    (id): id is number => typeof id === "number",
  );

  return (
    <>
      <Route
        element={
          <RoleGuard allowedRoles={refereeRoleIds}>
            <Outlet />
          </RoleGuard>
        }
      >
        <Route path="/referee" element={<Invitations />} />
        <Route path="/referee/invitations" element={<Invitations />} />
        <Route path="/referee/assigned" element={<AssignedMatches />} />
        <Route path="/referee/live" element={<LiveScoreController />} />
        <Route path="/referee/submit" element={<MatchSubmission />} />
      </Route>
      {chiefRoleIds.length > 0 && (
        <>
          <Route
            path="/referee/approvals"
            element={
              <RoleGuard allowedRoles={chiefRoleIds}>
                <MatchApprovalDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/referee/approvals/:matchId"
            element={
              <RoleGuard allowedRoles={chiefRoleIds}>
                <ApprovalDetailEloPreview />
              </RoleGuard>
            }
          />
        </>
      )}
    </>
  );
}
