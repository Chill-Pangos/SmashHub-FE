import { Card } from "@/components/ui/card";
import { UserPlus, Trophy, Users, AlertCircle } from "lucide-react";

interface Activity {
  id: number;
  type: "user" | "tournament" | "delegation" | "alert";
  message: string;
  timestamp: string;
  status?: "success" | "warning" | "error";
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: "tournament",
    message: "Giải đấu 'Cúp Vô Địch Quốc Gia 2024' đã bắt đầu",
    timestamp: "5 phút trước",
    status: "success",
  },
  {
    id: 2,
    type: "user",
    message: "15 người dùng mới đã đăng ký",
    timestamp: "1 giờ trước",
    status: "success",
  },
  {
    id: 3,
    type: "delegation",
    message: "Đoàn Hà Nội đã thêm 8 vận động viên mới",
    timestamp: "2 giờ trước",
    status: "success",
  },
  {
    id: 4,
    type: "alert",
    message: "Phát hiện khiếu nại mới từ trận đấu #M1234",
    timestamp: "3 giờ trước",
    status: "warning",
  },
  {
    id: 5,
    type: "tournament",
    message: "Giải đấu 'Giải Trẻ Toàn Quốc' đã hoàn thành",
    timestamp: "5 giờ trước",
    status: "success",
  },
  {
    id: 6,
    type: "user",
    message: "QLGĐ Nguyễn Văn A đã cập nhật hồ sơ",
    timestamp: "6 giờ trước",
    status: "success",
  },
];

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "user":
      return <UserPlus className="h-4 w-4" />;
    case "tournament":
      return <Trophy className="h-4 w-4" />;
    case "delegation":
      return <Users className="h-4 w-4" />;
    case "alert":
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "success":
      return "text-green-500 bg-green-500/10";
    case "warning":
      return "text-yellow-500 bg-yellow-500/10";
    case "error":
      return "text-red-500 bg-red-500/10";
    default:
      return "text-blue-500 bg-blue-500/10";
  }
};

export default function RecentActivities() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div
              className={`p-2 rounded-full ${getStatusColor(activity.status)}`}
            >
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
