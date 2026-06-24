import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";

export default function PrivateLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user) {
    const isEmailVerificationRoute = location.pathname === "/verify-email";
    const isProfileRoute = location.pathname === "/profile";
    const isChangePasswordRoute = location.pathname === "/change-password";

    // 1. Force email verification
    if (!user.isEmailVerified && !isEmailVerificationRoute && !isChangePasswordRoute) {
      return <Navigate to="/verify-email" replace />;
    }

    // 2. Force profile completion
    const isProfileComplete = user.firstName && user.lastName && user.dob;
    if (user.isEmailVerified && !isProfileComplete && !isProfileRoute && !isChangePasswordRoute) {
      return <Navigate to="/profile" state={{ requireCompletion: true }} replace />;
    }
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
