import { Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import PrivateLayout from "@/layouts/PrivateLayout";
import ProPlayerLayout from "@/layouts/ProPlayerLayout";
import SignIn from "@/pages/Auth/SignIn/SignIn";
import SignUp from "@/pages/Auth/SignUp/SignUp";
import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword/ResetPassword";
import EmailVerification from "@/pages/Auth/EmailVerification/EmailVerification";
import ChangePassword from "@/pages/Auth/ChangePassword/ChangePassword";
import Landing from "@/pages/PublicPlayer/Landing";
import TournamentListing from "@/pages/PublicPlayer/TournamentListing";
import TournamentDetail from "@/pages/PublicPlayer/TournamentDetail/TournamentDetail";
import EntryRegistration from "@/pages/PublicPlayer/EntryRegistration";
import TeamManagement from "@/pages/PublicPlayer/TeamManagement";
import Checkout from "@/pages/PublicPlayer/Checkout";
import MatchCenter from "@/pages/PublicPlayer/MatchCenter";
import BracketsStandings from "@/pages/PublicPlayer/BracketsStandings";
import EloLeaderboard from "@/pages/PublicPlayer/EloLeaderboard";
import EloHistory from "@/pages/PublicPlayer/EloHistory";
import UserProfile from "@/pages/PublicPlayer/UserProfile";
import Analytics from "@/pages/PublicPlayer/Analytics";
import UserDashboard from "@/pages/PublicPlayer/UserDashboard/UserDashboard";
import ChatbotScreen from "@/pages/Shared/Chatbot/ChatbotScreen";

/**
 * Public Routes
 * Routes accessible without authentication
 */
export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<EmailVerification />} />
      </Route>
      {/* Routes utilizing the Pro Player Portal layout */}
      <Route element={<ProPlayerLayout />}>
        {/* Public portal routes */}
        <Route path="tournaments" element={<TournamentListing />} />
        <Route
          path="tournaments/:tournamentId"
          element={<TournamentDetail />}
        />
        <Route path="brackets" element={<BracketsStandings />} />
        <Route path="elo" element={<EloLeaderboard />} />

        {/* Private portal routes */}
        <Route element={<PrivateLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route
            path="tournaments/:tournamentId/register"
            element={<EntryRegistration />}
          />
          <Route path="team" element={<TeamManagement />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="history" element={<MatchCenter />} />
          <Route path="matches" element={<MatchCenter />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="elo/history" element={<EloHistory />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="chatbot" element={<ChatbotScreen />} />
        </Route>
      </Route>
    </>
  );
}
