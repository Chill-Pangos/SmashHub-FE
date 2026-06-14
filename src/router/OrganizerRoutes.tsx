import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import OrganizerLayout from "@/layouts/OrganizerLayout";
import OrganizerDashboard from "@/pages/Organizer/OrganizerDashboard/OrganizerDashboard";
import OrganizerNotifications from "@/pages/Organizer/Notifications/Notifications";
import OrganizerTournaments from "@/pages/Organizer/Tournaments/Tournaments";
import TournamentForm from "@/pages/Organizer/TournamentForm/TournamentForm";
import TournamentDetail from "@/pages/Organizer/Tournaments/TournamentDetail";
import CategoryManagement from "@/pages/Organizer/CategoryManagement/CategoryManagement";
import BulkImport from "@/pages/Organizer/BulkImport/BulkImport";
import FinanceVerification from "@/pages/Organizer/FinanceVerification/FinanceVerification";
import GroupStageDraw from "@/pages/Organizer/GroupStageDraw/GroupStageDraw";
import UserProfile from "@/pages/PublicPlayer/UserProfile/UserProfile";
import ChatbotScreen from "@/pages/Shared/Chatbot/ChatbotScreen";

/**
 * Organizer Routes
 * Routes for tournament organizers
 */
export default function OrganizerRoutes() {
  return (
    <>
      <Route
        element={
          <RoleGuard allowedRoles={["organizer"]}>
            <OrganizerLayout />
          </RoleGuard>
        }
      >
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route
          path="/organizer/tournaments"
          element={<OrganizerTournaments />}
        />
        <Route
          path="/organizer/notifications"
          element={<OrganizerNotifications />}
        />
        <Route path="/organizer/tournaments/new" element={<TournamentForm />} />
        <Route
          path="/organizer/tournaments/:tournamentId"
          element={<TournamentDetail />}
        />
        <Route
          path="/organizer/tournaments/:tournamentId/edit"
          element={<TournamentForm />}
        />
        <Route path="/organizer/categories" element={<CategoryManagement />} />
        <Route path="/organizer/bulk-import" element={<BulkImport />} />
        <Route path="/organizer/finance" element={<FinanceVerification />} />
        <Route path="/organizer/draw" element={<GroupStageDraw />} />
        <Route path="/organizer/profile" element={<UserProfile />} />
        <Route path="/organizer/chatbot" element={<ChatbotScreen />} />
      </Route>
    </>
  );
}
