import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import TeamManagerPage from "@/pages/TeamManager/TeamManagerPage";

interface TeamManagerRoutesProps {
  teamManagerRoleId: number;
}

/**
 * Team Manager Routes
 * Routes for team managers (Trưởng đoàn)
 * Team managers can:
 * - View team dashboard
 * - Manage team members
 * - Register athletes for tournaments using Excel upload
 * - View team tournaments and schedules
 */
export default function TeamManagerRoutes({
  teamManagerRoleId,
}: TeamManagerRoutesProps) {
  return (
    <>
      <Route
        path="/team-manager/*"
        element={
          <RoleGuard allowedRoles={[teamManagerRoleId]}>
            <TeamManagerPage />
          </RoleGuard>
        }
      />
    </>
  );
}
