import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import RefereePage from "@/pages/Referee/RefereePage";

interface RefereeRoutesProps {
  refereeRoleId: number;
}

/**
 * Referee Routes
 * Routes for referees (Trọng tài)
 */
export default function RefereeRoutes({ refereeRoleId }: RefereeRoutesProps) {
  return (
    <>
      <Route
        path="/referee"
        element={
          <RoleGuard allowedRoles={[refereeRoleId]}>
            <RefereePage />
          </RoleGuard>
        }
      />
    </>
  );
}
