import { Route, Outlet } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import OrganizerDashboard from "@/pages/Organizer/OrganizerDashboard/OrganizerDashboard";
import TournamentForm from "@/pages/Organizer/TournamentForm/TournamentForm";
import CategoryManagement from "@/pages/Organizer/CategoryManagement/CategoryManagement";
import ScheduleConfig from "@/pages/Organizer/ScheduleConfig/ScheduleConfig";
import EntriesManagement from "@/pages/Organizer/EntriesManagement/EntriesManagement";
import BulkImport from "@/pages/Organizer/BulkImport/BulkImport";
import FinanceVerification from "@/pages/Organizer/FinanceVerification/FinanceVerification";
import GroupStageDraw from "@/pages/Organizer/GroupStageDraw/GroupStageDraw";
import ScheduleGeneration from "@/pages/Organizer/ScheduleGeneration/ScheduleGeneration";
import RefereeManagement from "@/pages/Organizer/RefereeManagement/RefereeManagement";

interface OrganizerRoutesProps {
  organizerRoleId: number;
}

/**
 * Organizer Routes
 * Routes for tournament organizers
 */
export default function OrganizerRoutes({ organizerRoleId }: OrganizerRoutesProps) {
  return (
    <>
      <Route
        element={
          <RoleGuard allowedRoles={[organizerRoleId]}>
            <Outlet />
          </RoleGuard>
        }
      >
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/tournaments/new" element={<TournamentForm />} />
        <Route
          path="/organizer/tournaments/:tournamentId/edit"
          element={<TournamentForm />}
        />
        <Route path="/organizer/categories" element={<CategoryManagement />} />
        <Route
          path="/organizer/schedule-config"
          element={<ScheduleConfig />}
        />
        <Route path="/organizer/entries" element={<EntriesManagement />} />
        <Route path="/organizer/bulk-import" element={<BulkImport />} />
        <Route path="/organizer/finance" element={<FinanceVerification />} />
        <Route path="/organizer/draw" element={<GroupStageDraw />} />
        <Route
          path="/organizer/schedule-generation"
          element={<ScheduleGeneration />}
        />
        <Route path="/organizer/referees" element={<RefereeManagement />} />
      </Route>
    </>
  );
}
