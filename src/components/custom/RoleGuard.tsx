import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: number[];
  redirectTo?: string;
}

/**
 * RoleGuard Component
 * Protects routes based on user roles
 *
 * @param children - Components to render if user has required role
 * @param allowedRoles - Array of role IDs that are allowed to access
 * @param redirectTo - Optional redirect path if user doesn't have required role (default: "/")
 *
 * @example
 * <RoleGuard allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.ORGANIZER]}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/",
}: RoleGuardProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasAnyRole } = useRole();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {t("components.roleGuard.checkingAccess")}
          </p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has any of the allowed roles
  if (!hasAnyRole(user.roles, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
