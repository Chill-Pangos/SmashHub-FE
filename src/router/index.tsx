import { Routes, Route } from "react-router-dom";
import { useRole } from "@/store/useRole";
import NotFound from "@/pages/NotFound/NotFound";
import RoleLoadingScreen from "@/components/custom/RoleLoadingScreen";
import RoleErrorScreen from "@/components/custom/RoleErrorScreen";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import RefereeRoutes from "./RefereeRoutes";
import OrganizerRoutes from "./OrganizerRoutes";

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
  const chiefRefereeRole = getRoleByName("chief_referee");
  const refereeRole = getRoleByName("referee");

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      {PublicRoutes()}

      {/* Admin routes - only render if admin role exists in database */}
      {adminRole && AdminRoutes({ adminRoleId: adminRole.id })}

      {/* Organizer routes - only render if organizer role exists */}
      {organizerRole && OrganizerRoutes({ organizerRoleId: organizerRole.id })}

      {/* Referee routes - render if referee or chief referee role exists */}
      {(refereeRole || chiefRefereeRole) &&
        RefereeRoutes({
          refereeRoleId: refereeRole?.id ?? chiefRefereeRole?.id ?? 0,
          chiefRefereeRoleId: chiefRefereeRole?.id,
        })}

      {/* Loading state for role-protected routes while role list is being fetched */}
      {isLoading && (
        <>
          <Route path="/admin/*" element={<RoleLoadingScreen />} />
          <Route path="/referee/*" element={<RoleLoadingScreen />} />
          <Route path="/organizer/*" element={<RoleLoadingScreen />} />
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
            path="/organizer/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
          <Route
            path="/referee/*"
            element={<RoleErrorScreen error={error} onRetry={fetchRoles} />}
          />
        </>
      )}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
