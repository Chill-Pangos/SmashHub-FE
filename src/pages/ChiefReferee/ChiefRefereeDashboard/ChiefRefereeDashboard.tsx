import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";
import { RecentComplaints, QuickActions, ActivityChart } from "./components";
import { useTranslation } from "@/hooks/useTranslation";

export default function ChiefRefereeDashboard() {
  const { t } = useTranslation();

  const statsData = [
    {
      title: t("chiefReferee.newComplaints"),
      value: "8",
      change: "+3",
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: t("chiefReferee.processing"),
      value: "12",
      change: "+2",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t("chiefReferee.resolved"),
      value: "45",
      change: "+15",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t("chiefReferee.activeReferees"),
      value: "28",
      change: "+4",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];
  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t("chiefReferee.dashboardOverview")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("chiefReferee.dashboardDescription")}
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          {t("chiefReferee.exportReport")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <span className="text-xs text-green-500 font-semibold flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <QuickActions onAction={handleQuickAction} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentComplaints />
        </div>
        <div className="lg:col-span-1">
          <ActivityChart />
        </div>
      </div>
    </div>
  );
}
