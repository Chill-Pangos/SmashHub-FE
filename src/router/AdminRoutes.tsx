import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import AdminLayout from "@/layouts/AdminLayout";
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
        element={
          <RoleGuard allowedRoles={[adminRoleId]}>
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
