import { Routes, Route } from "react-router-dom";
import { useRole } from "@/store/useRole";
import NotFound from "@/pages/NotFound/NotFound";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoutes from "./AdminRoutes";
import TournamentManagerRoutes from "./TournamentManagerRoutes";
import ChiefRefereeRoutes from "./ChiefRefereeRoutes";

/**
 * AppRouter - Main application router
 * Uses getRoleByName() to get role objects from API, then uses role.id for guards
 * Routes are only rendered if the role exists in the database
 */
export default function AppRouter() {
  const { getRoleByName, isLoading, error } = useRole();

  // Show loading while roles are being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải vai trò...</p>
        </div>
      </div>
    );
  }

  // Show error if roles failed to load
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-muted-foreground">Vui lòng tải lại trang</p>
        </div>
      </div>
    );
  }

  // Get role objects from API using getRoleByName()
  // Returns Role object with { id, name, description } or undefined if not found
  const adminRole = getRoleByName("admin");
  const organizerRole = getRoleByName("organizer");
  const chiefRefereeRole = getRoleByName("chief_referee");

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <PublicRoutes />

      {/* Protected routes - require authentication but no specific role */}
      <ProtectedRoutes />

      {/* Admin routes - only render if admin role exists in database */}
      {adminRole && <AdminRoutes adminRoleId={adminRole.id} />}

      {/* Tournament Manager routes - only render if organizer role exists */}
      {organizerRole && (
        <TournamentManagerRoutes organizerRoleId={organizerRole.id} />
      )}

      {/* Chief Referee routes - only render if chief_referee role exists */}
      {chiefRefereeRole && (
        <ChiefRefereeRoutes chiefRefereeRoleId={chiefRefereeRole.id} />
      )}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
