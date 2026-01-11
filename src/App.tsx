import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import Rankings from "./pages/Rankings/Rankings";
import NotFound from "./pages/NotFound/NotFound";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import AdminPage from "./pages/Admin/Admin";

// Admin Pages
import SystemDashboard from "./pages/Admin/SystemDashboard/SystemDashboard";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import RBACSettings from "./pages/Admin/RBACSettings/RBACSettings";
import SystemLogs from "./pages/Admin/SystemLogs/SystemLogs";

// Tournament Manager Pages (QLGĐ)
import TournamentManagerPage from "./pages/TournamentManager/TournamentManagerPage";
import TournamentDashboard from "./pages/TournamentManager/TournamentDashboard/TournamentDashboard";
import TournamentSetupWizard from "./pages/TournamentManager/TournamentSetupWizard/TournamentSetupWizard";
import DelegationManagement from "./pages/TournamentManager/DelegationManagement/DelegationManagement";
import RefereeAssignment from "./pages/TournamentManager/RefereeAssignment/RefereeAssignment";
import SchedulingMatrix from "./pages/TournamentManager/SchedulingMatrix/SchedulingMatrix";
import ResultCorrection from "./pages/TournamentManager/ResultCorrection/ResultCorrection";
import ReportsCenter from "./pages/TournamentManager/ReportsCenter/ReportsCenter";
import DelegationAccountManagement from "./pages/TournamentManager/DelegationAccountManagement/DelegationAccountManagement";
import MatchManagement from "./pages/TournamentManager/MatchManagement/MatchManagement";

// Chief Referee Pages (Tổng TT)
import ChiefRefereePage from "./pages/ChiefReferee/ChiefRefereePage";
import ComplaintBoard from "./pages/ChiefReferee/ComplaintBoard/ComplaintBoard";
import DisputeResolution from "./pages/ChiefReferee/DisputeResolution/DisputeResolution";

// Public Pages
import MasterScoreboard from "./pages/Public/MasterScoreboard/MasterScoreboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/scoreboard" element={<MasterScoreboard />} />
        </Route>

        {/* Private routes - Admin */}
        <Route element={<PrivateLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/system-dashboard" element={<SystemDashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/rbac-settings" element={<RBACSettings />} />
          <Route path="/admin/system-logs" element={<SystemLogs />} />
        </Route>

        {/* Private routes - Tournament Manager (QLGĐ) */}
        <Route element={<PrivateLayout />}>
          <Route
            path="/tournament-manager"
            element={<TournamentManagerPage />}
          />
          <Route
            path="/tournament-manager/dashboard"
            element={<TournamentDashboard />}
          />
          <Route
            path="/tournament-manager/setup-wizard"
            element={<TournamentSetupWizard />}
          />
          <Route
            path="/tournament-manager/delegations"
            element={<DelegationManagement />}
          />
          <Route
            path="/tournament-manager/referee-assignment"
            element={<RefereeAssignment />}
          />
          <Route
            path="/tournament-manager/scheduling"
            element={<SchedulingMatrix />}
          />
          <Route
            path="/tournament-manager/result-correction"
            element={<ResultCorrection />}
          />
          <Route
            path="/tournament-manager/reports"
            element={<ReportsCenter />}
          />
          <Route
            path="/tournament-manager/delegation-accounts"
            element={<DelegationAccountManagement />}
          />
          <Route
            path="/tournament-manager/matches"
            element={<MatchManagement />}
          />
        </Route>

        {/* Private routes - Chief Referee (Tổng TT) */}
        <Route element={<PrivateLayout />}>
          <Route path="/chief-referee" element={<ChiefRefereePage />} />
          <Route
            path="/chief-referee/complaint-board"
            element={<ComplaintBoard />}
          />
          <Route
            path="/chief-referee/dispute-resolution/:id"
            element={<DisputeResolution />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
