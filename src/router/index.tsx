import { Routes, Route } from "react-router-dom";
import { useRole } from "@/store/useRole";
import NotFound from "@/pages/NotFound/NotFound";
import RoleLoadingScreen from "@/components/custom/RoleLoadingScreen";
import RoleErrorScreen from "@/components/custom/RoleErrorScreen";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoutes from "./AdminRoutes";
import TournamentManagerRoutes from "./TournamentManagerRoutes";
import ChiefRefereeRoutes from "./ChiefRefereeRoutes"; // RE-ENABLED: MatchSupervision uses React Query
import RefereeRoutes from "./RefereeRoutes";
import TeamManagerRoutes from "./TeamManagerRoutes";
import CoachRoutes from "./CoachRoutes";
import AthleteRoutes from "./AthleteRoutes";
import SpectatorRoutes from "./SpectatorRoutes";

/**
 * AppRouter - Main application router
 * Uses getRoleByName() to get role objects from API, then uses role.id for guards
 * Routes are only rendered if the role exists in the database
 */
export default function AppRouter() {
  const { getRoleByName, isLoading, error, fetchRoles } = useRole();

  // Show loading screen while roles are being fetched
  if (isLoading) {
    return <RoleLoadingScreen />;
  }

  // Show error screen if roles failed to load
  // Pass fetchRoles as onRetry callback to allow retrying without full page reload
  // Navigation and logout will use window.location for full page reload
  if (error) {
    return <RoleErrorScreen error={error} onRetry={fetchRoles} />;
  }

  // Get role objects from API using getRoleByName()
  // Returns Role object with { id, name, description } or undefined if not found
  const adminRole = getRoleByName("admin");
  const organizerRole = getRoleByName("organizer");
  const chiefRefereeRole = getRoleByName("chief_referee"); // RE-ENABLED: MatchSupervision uses React Query
  const refereeRole = getRoleByName("referee");
  const teamManagerRole = getRoleByName("team_manager");
  const coachRole = getRoleByName("coach");
  const athleteRole = getRoleByName("athlete");

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      {PublicRoutes()}

      {/* Protected routes - require authentication but no specific role */}
      {ProtectedRoutes()}

      {/* Admin routes - only render if admin role exists in database */}
      {adminRole && AdminRoutes({ adminRoleId: adminRole.id })}

      {/* Tournament Manager routes - only render if organizer role exists */}
      {organizerRole &&
        TournamentManagerRoutes({ organizerRoleId: organizerRole.id })}

      {/* Chief Referee routes - RE-ENABLED: MatchSupervision uses React Query */}
      {/* Note: dashboard/complaint/dispute/decision tabs are hidden (mock data) */}
      {chiefRefereeRole &&
        ChiefRefereeRoutes({ chiefRefereeRoleId: chiefRefereeRole.id })}

      {/* Referee routes - only render if referee role exists */}
      {refereeRole && RefereeRoutes({ refereeRoleId: refereeRole.id })}

      {/* Team Manager routes - only render if team_manager role exists */}
      {teamManagerRole &&
        TeamManagerRoutes({ teamManagerRoleId: teamManagerRole.id })}

      {/* Coach routes - only render if coach role exists */}
      {coachRole && CoachRoutes({ coachRoleId: coachRole.id })}

      {/* Athlete routes - only render if athlete role exists */}
      {athleteRole && AthleteRoutes({ athleteRoleId: athleteRole.id })}

      {/* Spectator routes - accessible to any authenticated user */}
      {SpectatorRoutes()}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
