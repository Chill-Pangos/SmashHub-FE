import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useNotificationConnection } from "@/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";

export default function PrivateLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  // Auto-connect to notification service when authenticated
  useNotificationConnection();

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

  return (
    <div>
      <Outlet />
    </div>
  );
}
