import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import ChiefRefereePage from "@/pages/ChiefReferee/ChiefRefereePage";
import ComplaintBoard from "@/pages/ChiefReferee/ComplaintBoard/ComplaintBoard";
import DisputeResolution from "@/pages/ChiefReferee/DisputeResolution/DisputeResolution";

interface ChiefRefereeRoutesProps {
  chiefRefereeRoleId: number;
}

/**
 * Chief Referee Routes
 * Routes for chief referees (Tổng TT)
 */
export default function ChiefRefereeRoutes({
  chiefRefereeRoleId,
}: ChiefRefereeRoutesProps) {
  return (
    <>
      <Route
        path="/chief-referee"
        element={
          <RoleGuard allowedRoles={[chiefRefereeRoleId]}>
            <ChiefRefereePage />
          </RoleGuard>
        }
      >
        <Route
          path="complaints"
          element={
            <RoleGuard allowedRoles={[chiefRefereeRoleId]}>
              <ComplaintBoard />
            </RoleGuard>
          }
        />
        <Route
          path="disputes"
          element={
            <RoleGuard allowedRoles={[chiefRefereeRoleId]}>
              <DisputeResolution />
            </RoleGuard>
          }
        />
      </Route>
    </>
  );
}
