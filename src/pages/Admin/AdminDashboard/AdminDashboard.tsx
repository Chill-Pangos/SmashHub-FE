import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsersPaginated } from "@/hooks/queries/useUserQueries";
import { useTournaments } from "@/hooks/queries/useTournamentQueries";
import { useAdminSystemSummary } from "@/hooks/queries/useNotificationQueries";
import { useNotification } from "@/store";
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  ShieldAlert,
  Trophy,
  Users,
  Wifi,
  Database,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusClassName = (status?: string) => {
  switch (status) {
    case "ok":
    case "up":
      return "text-green-500";
    case "warning":
    case "degraded":
      return "text-amber-500";
    case "critical":
    case "down":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

const formatGbPair = (
  usedGb?: number | null,
  totalGb?: number | null,
) => {
  if (usedGb === null || totalGb === null || usedGb === undefined || totalGb === undefined) {
    return "N/A";
  }

  return `${usedGb}/${totalGb} GB`;
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { data: usersData, isLoading: isLoadingUsers } = useUsersPaginated(1, 1);
  const { data: tournamentsData, isLoading: isLoadingTournaments } = useTournaments(1, 1);
  const { data: systemSummary } = useAdminSystemSummary();
  const { systemSummary: liveSystemSummary, hydrateAdminSystem } = useNotification();

  const totalUsers = usersData?.meta?.total || 0;
  const totalTournaments = tournamentsData?.pagination?.total || 0;
  const summary = liveSystemSummary;
  const cpu = summary?.resources.cpu;
  const ram = summary?.resources.ram;
  const disk = summary?.resources.disk;
  const traffic = summary?.traffic;
  const realtime = summary?.realtime;
  const alerts = summary?.alerts;
  const services = summary?.services;
  const serviceCards = [
    {
      key: "db",
      title: "Database",
      value: services?.db,
      icon: Database,
    },
    {
      key: "redis",
      title: "Redis",
      value: services?.redis,
      icon: Activity,
    },
    {
      key: "socket",
      title: "Socket.IO",
      value: services?.socket,
      icon: Wifi,
    },
    {
      key: "cron",
      title: "Cron",
      value: services?.cron,
      icon: Activity,
    },
  ];

  useEffect(() => {
    if (systemSummary?.data) {
      hydrateAdminSystem(systemSummary.data);
    }
  }, [hydrateAdminSystem, systemSummary?.data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("adminPage.dashboard.title", "Admin Dashboard")}
        </h2>
        <p className="text-muted-foreground">
          {t("adminPage.dashboard.description", "Overview of system statistics and quick actions.")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("adminPage.dashboard.totalUsers", "Total Users")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingUsers ? "..." : totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("adminPage.dashboard.registeredUsers", "Registered accounts")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("adminPage.dashboard.totalTournaments", "Total Tournaments")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingTournaments ? "..." : totalTournaments}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("adminPage.dashboard.createdTournaments", "Created on platform")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("adminPage.dashboard.systemStatus", "System Status")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold uppercase ${statusClassName(summary?.status)}`}>
              {summary?.status ?? "--"}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {summary?.generatedAt
                ? new Date(summary.generatedAt).toLocaleTimeString()
                : t("adminPage.dashboard.noSystemSnapshot", "No system snapshot")}
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("adminPage.dashboard.pendingAlerts", "Pending Alerts")}
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="text-2xl font-bold">{alerts?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mb-3">
              {t("adminPage.dashboard.alertBreakdown", "{{critical}} critical / {{warning}} warning", {
                critical: alerts?.critical ?? 0,
                warning: alerts?.warning ?? 0,
              })}
            </p>
            {alerts?.items && alerts.items.length > 0 && (
              <div className="space-y-2 mt-auto">
                {alerts.items.slice(0, 2).map((alert: any, idx: number) => (
                  <div key={idx} className="text-xs p-2 rounded bg-destructive/10 text-destructive truncate" title={alert.message}>
                    {alert.message}
                  </div>
                ))}
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs mt-1">
                  <Link to="/admin/system-logs">
                    {t("adminPage.dashboard.viewAllLogs", "View system logs →")}
                  </Link>
                </Button>
              </div>
            )}
            {(!alerts?.items || alerts.items.length === 0) && (
               <div className="mt-auto pt-2">
                 <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs text-muted-foreground">
                   <Link to="/admin/system-logs">
                     {t("adminPage.dashboard.viewAllLogs", "View system logs →")}
                   </Link>
                 </Button>
               </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {serviceCards.map((service) => {
          const Icon = service.icon;

          return (
            <Card key={service.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {service.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold uppercase ${statusClassName(service.value)}`}>
                  {service.value ?? "--"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {service.value === "up"
                    ? t("adminPage.dashboard.serviceAvailable", "Available")
                    : t("adminPage.dashboard.serviceNeedsAttention", "Needs attention")}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusClassName(cpu?.status)}`}>
              {cpu?.label ?? "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {cpu?.percent !== undefined ? `${cpu.percent}%` : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RAM</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusClassName(ram?.status)}`}>
              {ram?.label ?? "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatGbPair(ram?.usedGb, ram?.totalGb)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusClassName(disk?.status)}`}>
              {disk?.label ?? "--"}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {formatGbPair(disk?.usedGb, disk?.totalGb)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("adminPage.dashboard.traffic", "Traffic")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {traffic?.requestCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {traffic
                ? `${traffic.window} / ${traffic.errorPercent}% errors / p95 ${traffic.p95LatencyMs}ms`
                : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("adminPage.dashboard.realtime", "Realtime")}
            </CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtime?.connectedUsers ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("adminPage.dashboard.roomCount", "{{count}} rooms", {
                count: realtime?.roomCount ?? 0,
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("adminPage.dashboard.quickActions", "Quick Actions")}</CardTitle>
            <CardDescription>
              {t("adminPage.dashboard.manageSystemEntities", "Manage system entities directly.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                {t("adminPage.dashboard.manageUsers", "Manage Users")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/roles">
                <ShieldAlert className="mr-2 h-4 w-4" />
                {t("adminPage.dashboard.manageRoles", "Manage Roles & Permissions")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
