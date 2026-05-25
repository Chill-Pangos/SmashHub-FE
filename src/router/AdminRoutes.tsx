import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import AdminLayout from "@/layouts/AdminLayout";
import UserManagement from "@/pages/Admin/UserManagement/UserManagement";
import RolesPermissions from "@/pages/Admin/RolesPermissions/RolesPermissions";
import NotificationCenter from "@/pages/Admin/NotificationCenter/NotificationCenter";

/**
 * Admin Routes
 * Routes for system administrators
 */
export default function AdminRoutes() {
  return (
    <>
      <Route
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route path="/admin" element={<UserManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/roles" element={<RolesPermissions />} />
        <Route path="/admin/notifications" element={<NotificationCenter />} />
      </Route>
    </>
  );
}
