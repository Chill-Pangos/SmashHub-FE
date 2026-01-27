import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Users, Flag, Calendar } from "lucide-react";
import { RecentTournaments, QuickActions, ActivityChart } from "./components";

interface TournamentDashboardProps {
  onNavigateTo?: (tab: string) => void;
}

const statsData = [
  {
    title: "Tổng giải đấu",
    value: "24",
    change: "+3",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Đang diễn ra",
    value: "5",
    change: "+2",
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Tổng đoàn",
    value: "45",
    change: "+8",
    icon: Flag,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Vận động viên",
    value: "342",
    change: "+67",
    icon: Users,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export default function TournamentDashboard({
  onNavigateTo,
}: TournamentDashboardProps) {
  const handleQuickAction = (action: string) => {
    if (onNavigateTo && action === "create-tournament") {
      onNavigateTo("setup-wizard");
    } else {
      console.log("Quick action:", action);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tổng quan giải đấu</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi các giải đấu
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo giải đấu mới
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
                    <span className="text-xs text-green-500 font-semibold">
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
          <RecentTournaments
            onEditTournament={(id) => {
              console.log("Edit tournament from dashboard:", id);
              onNavigateTo?.("tournament-list");
            }}
            onNavigateToList={() => onNavigateTo?.("tournament-list")}
          />
        </div>
        <div className="lg:col-span-1">
          <ActivityChart />
        </div>
      </div>
    </div>
  );
}
