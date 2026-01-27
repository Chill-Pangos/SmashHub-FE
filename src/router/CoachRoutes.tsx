import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import CoachPage from "@/pages/Coach/CoachPage";

interface CoachRoutesProps {
  coachRoleId: number;
}

/**
 * Coach Routes
 * Routes for coaches (Huấn luyện viên)
 * Coaches can:
 * - View dashboard
 * - Manage athletes under their supervision
 * - View tournaments they participate in
 * - View match schedules
 * - Manage training plans
 */
export default function CoachRoutes({ coachRoleId }: CoachRoutesProps) {
  return (
    <>
      <Route
        path="/coach/*"
        element={
          <RoleGuard allowedRoles={[coachRoleId]}>
            <CoachPage />
          </RoleGuard>
        }
      />
    </>
  );
}
