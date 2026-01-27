import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, CheckCircle, XCircle } from "lucide-react";

interface RefereeStatsProps {
  totalMatches: number;
  completedMatches: number;
  pendingMatches: number;
  upcomingMatches: number;
}

export default function RefereeStats({
  totalMatches,
  completedMatches,
  pendingMatches,
  upcomingMatches,
}: RefereeStatsProps) {
  const stats = [
    {
      label: "Tổng trận đấu",
      value: totalMatches,
      icon: Trophy,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Đã hoàn thành",
      value: completedMatches,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Chờ phê duyệt",
      value: pendingMatches,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Sắp diễn ra",
      value: upcomingMatches,
      icon: XCircle,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
