import { useTranslation } from "@/hooks/useTranslation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsersPaginated } from "@/hooks/queries/useUserQueries";
import { useTournaments } from "@/hooks/queries/useTournamentQueries";
import { Users, Trophy, ShieldAlert, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { data: usersData, isLoading: isLoadingUsers } = useUsersPaginated(1, 1);
  const { data: tournamentsData, isLoading: isLoadingTournaments } = useTournaments(1, 1);

  const totalUsers = usersData?.meta?.total || 0;
  const totalTournaments = tournamentsData?.pagination?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("admin.dashboard.title", "Admin Dashboard")}
        </h2>
        <p className="text-muted-foreground">
          {t("admin.dashboard.description", "Overview of system statistics and quick actions.")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.totalUsers", "Total Users")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingUsers ? "..." : totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.dashboard.registeredUsers", "Registered accounts")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.totalTournaments", "Total Tournaments")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingTournaments ? "..." : totalTournaments}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.dashboard.createdTournaments", "Created on platform")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.systemHealth", "System Health")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {t("admin.dashboard.online", "Online")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.dashboard.allSystemsOperational", "All systems operational")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.pendingAlerts", "Pending Alerts")}
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {t("admin.dashboard.noActiveAlerts", "No active alerts")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.quickActions", "Quick Actions")}</CardTitle>
            <CardDescription>
              {t("admin.dashboard.manageSystemEntities", "Manage system entities directly.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                {t("admin.dashboard.manageUsers", "Manage Users")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/roles">
                <ShieldAlert className="mr-2 h-4 w-4" />
                {t("admin.dashboard.manageRoles", "Manage Roles & Permissions")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
