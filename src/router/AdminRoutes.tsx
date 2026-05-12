import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import UserManagement from "@/pages/Admin/UserManagement/UserManagement";
import RolesPermissions from "@/pages/Admin/RolesPermissions/RolesPermissions";
import NotificationCenter from "@/pages/Admin/NotificationCenter/NotificationCenter";

interface AdminRoutesProps {
  adminRoleId: number;
}

/**
 * Admin Routes
 * Routes for system administrators
 */
export default function AdminRoutes({ adminRoleId }: AdminRoutesProps) {
  return (
    <>
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={[adminRoleId]}>
            <UserManagement />
          </RoleGuard>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleGuard allowedRoles={[adminRoleId]}>
            <UserManagement />
          </RoleGuard>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <RoleGuard allowedRoles={[adminRoleId]}>
            <RolesPermissions />
          </RoleGuard>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <RoleGuard allowedRoles={[adminRoleId]}>
            <NotificationCenter />
          </RoleGuard>
        }
      />
    </>
  );
}
