import { Route } from "react-router-dom";
import RoleGuard from "@/components/custom/RoleGuard";
import UserPage from "@/pages/User/UserPage";

interface UserRoutesProps {
  userRoleId: number;
}

/**
 * User Routes
 * Routes for default authenticated users.
 */
export default function UserRoutes({ userRoleId }: UserRoutesProps) {
  return (
    <>
      <Route
        path="/user/*"
        element={
          <RoleGuard allowedRoles={[userRoleId]}>
            <UserPage />
          </RoleGuard>
        }
      />
    </>
  );
}
