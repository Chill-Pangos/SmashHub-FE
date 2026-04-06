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
import UserRoutes from "@/router/UserRoutes";

/**
 * AppRouter - Main application router
 * Uses getRoleByName() to get role objects from API, then uses role.id for guards
 * Routes are only rendered if the role exists in the database
 */
export default function AppRouter() {
  const { getRoleByName, isLoading, error, fetchRoles } = useRole();

  // Get role objects from API using getRoleByName()
  // Returns Role object with { id, name, description } or undefined if not found
  const adminRole = getRoleByName("admin");
  const organizerRole = getRoleByName("organizer");
  const chiefRefereeRole = getRoleByName("chief_referee"); // RE-ENABLED: MatchSupervision uses React Query
  const refereeRole = getRoleByName("referee");
  const userRole = getRoleByName("user");

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

      {/* User routes - only render if user role exists */}
      {userRole && UserRoutes({ userRoleId: userRole.id })}

      {/* Loading state for role-protected routes while role list is being fetched */}
      {isLoading && (
        <>
          <Route path="/admin/*" element={<RoleLoadingScreen />} />
          <Route path="/tournament-manager/*" element={<RoleLoadingScreen />} />
          <Route path="/chief-referee/*" element={<RoleLoadingScreen />} />
          <Route path="/referee/*" element={<RoleLoadingScreen />} />
          <Route path="/user/*" element={<RoleLoadingScreen />} />
        </>
      )}

      {/* Error state for role-protected routes when role list fails to load */}
      {error && (
        <>
          <Route
            path="/admin/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
          <Route
            path="/tournament-manager/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
          <Route
            path="/chief-referee/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
          <Route
            path="/referee/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
          <Route
            path="/user/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
        </>
      )}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
