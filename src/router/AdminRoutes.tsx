import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import AdminLayout from "@/layouts/AdminLayout";
import UserManagement from "@/pages/Admin/UserManagement/UserManagement";
import RolesPermissions from "@/pages/Admin/RolesPermissions/RolesPermissions";
import NotificationCenter from "@/pages/Admin/NotificationCenter/NotificationCenter";
import AdminDashboard from "@/pages/Admin/AdminDashboard/AdminDashboard";
import UserProfile from "@/pages/PublicPlayer/UserProfile/UserProfile";
import ChatbotScreen from "@/pages/Shared/Chatbot/ChatbotScreen";
import ChatbotManagement from "@/pages/Admin/ChatbotManagement/ChatbotManagement";
import SystemLogs from "@/pages/Admin/SystemLogs/SystemLogs";

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/roles" element={<RolesPermissions />} />
        <Route path="/admin/notifications" element={<NotificationCenter />} />
        <Route path="/admin/profile" element={<UserProfile />} />
        <Route path="/admin/chatbot" element={<ChatbotScreen />} />
        <Route path="/admin/chatbot-management" element={<ChatbotManagement />} />
        <Route path="/admin/system-logs" element={<SystemLogs />} />
      </Route>
    </>
  );
}
