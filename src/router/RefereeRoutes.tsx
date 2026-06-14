import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import RefereeLayout from "@/layouts/RefereeLayout";
import PendingInvitations from "@/pages/Referee/PendingInvitations";
import Tournaments from "@/pages/Referee/Tournaments";
import TournamentDetail from "@/pages/Referee/TournamentDetail";
import Notifications from "@/pages/Referee/Notifications";
import MatchExecution from "@/pages/Referee/MatchExecution/MatchExecution";
import PendingMatchesGlobal from "@/pages/Referee/PendingMatchesGlobal";
import RefereeDashboard from "@/pages/Referee/RefereeDashboard/RefereeDashboard";
import UserProfile from "@/pages/PublicPlayer/UserProfile/UserProfile";
import ChatbotScreen from "@/pages/Shared/Chatbot/ChatbotScreen";

/**
 * Referee Routes
 * Routes for referees (Trọng tài)
 */
export default function RefereeRoutes() {
  const refereeRoleNames = ["referee", "chief_referee"];

  return (
    <>
      <Route
        element={
          <RoleGuard allowedRoles={refereeRoleNames}>
            <RefereeLayout />
          </RoleGuard>
        }
      >
        <Route
          path="/referee"
          element={<RefereeDashboard />}
        />
        <Route path="/referee/invitations" element={<PendingInvitations />} />
        <Route path="/referee/tournaments" element={<Tournaments />} />
        <Route
          path="/referee/tournaments/:tournamentId"
          element={<TournamentDetail />}
        />
        <Route path="/referee/matches/:matchId" element={<MatchExecution />} />
        <Route path="/referee/pending-matches" element={<PendingMatchesGlobal />} />
        <Route path="/referee/notifications" element={<Notifications />} />
        <Route path="/referee/profile" element={<UserProfile />} />
        <Route path="/referee/chatbot" element={<ChatbotScreen />} />
      </Route>
    </>
  );
}
