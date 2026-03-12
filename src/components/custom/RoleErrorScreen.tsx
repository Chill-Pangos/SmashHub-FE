import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Home, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useState } from "react";

interface RoleErrorScreenProps {
  error: string;
  onRetry?: () => void;
}

/**
 * RoleErrorScreen - Displays when role data fails to load
 * Provides options to: Reload, Logout, or Go Home
 */
export default function RoleErrorScreen({
  error,
  onRetry,
}: RoleErrorScreenProps) {
  const { logout } = useAuth();
  const { t } = useTranslation();

  // Single state to prevent race conditions when user clicks multiple buttons quickly
  const [loadingAction, setLoadingAction] = useState<
    "retry" | "home" | "logout" | null
  >(null);

  const handleLogout = async () => {
    if (loadingAction) return; // Prevent multiple actions

    try {
      setLoadingAction("logout");
      logout();
      // Force full page reload to clear all state and navigate to signin
      window.location.href = "/signin";
    } catch (err) {
      setLoadingAction(null);
      toast.error(t("roleError.logoutFailed"), {
        description:
          err instanceof Error ? err.message : t("message.pleaseTryAgain"),
      });
    }
  };

  const handleHome = async () => {
    if (loadingAction) return; // Prevent multiple actions

    try {
      setLoadingAction("home");
      // Force full page reload to reset role error state
      window.location.href = "/";
    } catch (err) {
      setLoadingAction(null);
      toast.error(t("roleError.navigationFailed"), {
        description:
          err instanceof Error ? err.message : t("message.pleaseTryAgain"),
      });
    }
  };

  const handleRetry = async () => {
    if (loadingAction) return; // Prevent multiple actions

    try {
      setLoadingAction("retry");
      if (onRetry) {
        // Call the fetchRoles function passed from router to retry loading roles
        await onRetry();
        // If successful, the router will re-render with roles loaded
      } else {
        // Fallback: Full page reload if no retry function provided
        window.location.reload();
      }
    } catch (err) {
      setLoadingAction(null);
      toast.error(t("roleError.retryFailed"), {
        description:
          err instanceof Error ? err.message : t("message.pleaseTryAgain"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <Card className="bg-card border-border p-12 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {t("roleError.title")}
            </h2>

            {/* Error Message */}
            <div className="mb-2">
              <p className="text-destructive text-sm font-medium">
                {t("roleError.errorLabel")}: {error}
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 text-balance text-sm">
              {t("roleError.description")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Retry Button */}
              <Button
                size="lg"
                onClick={handleRetry}
                disabled={loadingAction !== null}
                className="w-full rounded-lg hover:bg-white hover:text-primary hover:border-2 hover:border-primary"
                variant="default"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loadingAction === "retry" ? "animate-spin" : ""}`}
                />
                {loadingAction === "retry"
                  ? t("common.loading")
                  : t("roleError.btnRetry")}
              </Button>

              {/* Home Button */}
              <Button
                size="lg"
                variant="outline"
                onClick={handleHome}
                disabled={loadingAction !== null}
                className="w-full rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <Home className="w-4 h-4 mr-2" />
                {loadingAction === "home"
                  ? t("common.loading")
                  : t("roleError.btnHome")}
              </Button>

              {/* Logout Button */}
              <Button
                size="lg"
                variant="outline"
                onClick={handleLogout}
                disabled={loadingAction !== null}
                className="w-full rounded-lg hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {loadingAction === "logout"
                  ? t("common.loading")
                  : t("roleError.btnLogout")}
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground mt-6">
              {t("roleError.helpText")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
