import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  UserPlus,
  FileSpreadsheet,
  Calendar,
  Users,
  ClipboardList,
} from "lucide-react";

const quickActions = [
  {
    icon: Plus,
    title: "Tạo giải đấu mới",
    description: "Bắt đầu tạo giải đấu mới",
    color: "text-blue-500 bg-blue-500/10",
    action: "create-tournament",
  },
  {
    icon: UserPlus,
    title: "Thêm đoàn thi đấu",
    description: "Đăng ký đoàn mới",
    color: "text-green-500 bg-green-500/10",
    action: "add-delegation",
  },
  {
    icon: Calendar,
    title: "Lên lịch thi đấu",
    description: "Sắp xếp lịch trận đấu",
    color: "text-purple-500 bg-purple-500/10",
    action: "schedule-matches",
  },
  {
    icon: Users,
    title: "Phân công trọng tài",
    description: "Gán trọng tài cho trận",
    color: "text-orange-500 bg-orange-500/10",
    action: "assign-referees",
  },
  {
    icon: ClipboardList,
    title: "Nhập kết quả",
    description: "Cập nhật kết quả thi đấu",
    color: "text-pink-500 bg-pink-500/10",
    action: "enter-results",
  },
  {
    icon: FileSpreadsheet,
    title: "Xuất báo cáo",
    description: "Tạo báo cáo thống kê",
    color: "text-cyan-500 bg-cyan-500/10",
    action: "export-report",
  },
];

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-start p-4 hover:bg-accent"
              onClick={() => onAction?.(item.action)}
            >
              <div className={`p-2 rounded-lg ${item.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
