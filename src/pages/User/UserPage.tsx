import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useTranslation } from "@/hooks/useTranslation";

export default function UserPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getRoleNames } = useRole();
  const { logout, loading } = useAuthOperations();

  if (!user) {
    return null;
  }

  const displayName =
    `${user.firstName} ${user.lastName}`.trim() || user.username || user.email;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("authFlow.userPage.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("authFlow.userPage.description", { name: displayName })}
            </p>
            <div className="text-sm text-muted-foreground">
              {t("authFlow.userPage.currentRoles")}:{" "}
              {getRoleNames(user.roles).join(", ") ||
                t("authFlow.userPage.defaultRole")}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/change-password">{t("auth.changePassword")}</Link>
              </Button>
              <Button variant="outline" onClick={logout} disabled={loading}>
                {t("auth.signOut")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
