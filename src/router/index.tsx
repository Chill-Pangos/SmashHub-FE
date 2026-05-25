import { Routes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound/NotFound";
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
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      {PublicRoutes()}

      {/* Admin routes - only render if admin role exists in database */}
      {AdminRoutes()}

      {/* Organizer routes - only render if organizer role exists */}
      {OrganizerRoutes()}

      {/* Referee routes - render if referee or chief referee role exists */}
      {RefereeRoutes()}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
