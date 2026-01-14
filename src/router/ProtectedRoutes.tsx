import { Route } from "react-router-dom";
import PrivateLayout from "@/layouts/PrivateLayout";
import ChangePassword from "@/pages/Auth/ChangePassword/ChangePassword";

/**
 * Protected Routes
 * Routes that require authentication but no specific role
 */
export default function ProtectedRoutes() {
  return (
    <>
      <Route element={<PrivateLayout />}>
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </>
  );
}
