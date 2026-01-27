import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import AdminPage from "@/pages/Admin/Admin";
import SystemDashboard from "@/pages/Admin/SystemDashboard/SystemDashboard";
import UserManagement from "@/pages/Admin/UserManagement/UserManagement";
import RBACSettings from "@/pages/Admin/RBACSettings/RBACSettings";
import SystemLogs from "@/pages/Admin/SystemLogs/SystemLogs";

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
            <AdminPage />
          </RoleGuard>
        }
      >
        <Route
          index
          element={
            <RoleGuard allowedRoles={[adminRoleId]}>
              <SystemDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="dashboard"
          element={
            <RoleGuard allowedRoles={[adminRoleId]}>
              <SystemDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={[adminRoleId]}>
              <UserManagement />
            </RoleGuard>
          }
        />
        <Route
          path="rbac"
          element={
            <RoleGuard allowedRoles={[adminRoleId]}>
              <RBACSettings />
            </RoleGuard>
          }
        />
        <Route
          path="logs"
          element={
            <RoleGuard allowedRoles={[adminRoleId]}>
              <SystemLogs />
            </RoleGuard>
          }
        />
      </Route>
    </>
  );
}
