import { Card } from "@/components/ui/card";
import { Users, Trophy, Flag, Calendar } from "lucide-react";
import ActivityChart from "./components/ActivityChart";
import RecentActivities from "./components/RecentActivities";

const statsData = [
  {
    title: "Tổng người dùng",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Giải đấu đang diễn ra",
    value: "7",
    change: "+2",
    icon: Trophy,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Đoàn tham gia",
    value: "45",
    change: "+5",
    icon: Flag,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Trận đấu hôm nay",
    value: "82",
    change: "+15",
    icon: Calendar,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export default function SystemDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
