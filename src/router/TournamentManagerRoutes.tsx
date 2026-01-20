import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import TournamentManagerPage from "@/pages/TournamentManager/TournamentManagerPage";
import TournamentDashboard from "@/pages/TournamentManager/TournamentDashboard/TournamentDashboard";
import TournamentSetupWizard from "@/pages/TournamentManager/TournamentSetupWizard/TournamentSetupWizard";
import DelegationManagement from "@/pages/TournamentManager/DelegationManagement/DelegationManagement";
import RefereeAssignment from "@/pages/TournamentManager/RefereeAssignment/RefereeAssignment";
import ScheduleGenerator from "@/pages/TournamentManager/SchedulingGenerator/ScheduleGenerator";
import ResultCorrection from "@/pages/TournamentManager/ResultCorrection/ResultCorrection";
import ReportsCenter from "@/pages/TournamentManager/ReportsCenter/ReportsCenter";
import DelegationAccountManagement from "@/pages/TournamentManager/DelegationAccountManagement/DelegationAccountManagement";
import MatchManagement from "@/pages/TournamentManager/MatchManagement/MatchManagement";

interface TournamentManagerRoutesProps {
  organizerRoleId: number;
}

/**
 * Tournament Manager Routes
 * Routes for tournament organizers (QLGĐ)
 */
export default function TournamentManagerRoutes({
  organizerRoleId,
}: TournamentManagerRoutesProps) {
  return (
    <>
      <Route
        path="/tournament-manager"
        element={
          <RoleGuard allowedRoles={[organizerRoleId]}>
            <TournamentManagerPage />
          </RoleGuard>
        }
      >
        <Route
          index
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <TournamentDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="dashboard"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <TournamentDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="setup"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <TournamentSetupWizard />
            </RoleGuard>
          }
        />
        <Route
          path="delegations"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <DelegationManagement />
            </RoleGuard>
          }
        />
        <Route
          path="referees"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <RefereeAssignment />
            </RoleGuard>
          }
        />
        <Route
          path="scheduling"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <ScheduleGenerator />
            </RoleGuard>
          }
        />
        <Route
          path="results"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <ResultCorrection />
            </RoleGuard>
          }
        />
        <Route
          path="reports"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <ReportsCenter />
            </RoleGuard>
          }
        />
        <Route
          path="delegation-accounts"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <DelegationAccountManagement />
            </RoleGuard>
          }
        />
        <Route
          path="matches"
          element={
            <RoleGuard allowedRoles={[organizerRoleId]}>
              <MatchManagement />
            </RoleGuard>
          }
        />
      </Route>
    </>
  );
}
