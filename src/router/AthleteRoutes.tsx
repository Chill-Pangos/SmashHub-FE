import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import AthletePage from "@/pages/Athlete/AthletePage";

interface AthleteRoutesProps {
  athleteRoleId: number;
}

/**
 * Athlete Routes
 * Routes for athletes (Vận động viên)
 * Athletes can:
 * - View their dashboard and profile
 * - View tournaments they are registered in
 * - View their match schedules
 * - View match history and results
 * - Track ELO statistics
 */
export default function AthleteRoutes({ athleteRoleId }: AthleteRoutesProps) {
  return (
    <>
      <Route
        path="/athlete/*"
        element={
          <RoleGuard allowedRoles={[athleteRoleId]}>
            <AthletePage />
          </RoleGuard>
        }
      />
    </>
  );
}
