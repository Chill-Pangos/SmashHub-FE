import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  AlertTriangle, 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  Settings 
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: typeof FileText;
  action: string;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  {
    title: "Xử lý khiếu nại",
    description: "8 khiếu nại đang chờ",
    icon: AlertTriangle,
    action: "handle-complaints",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Giám sát trận đấu",
    description: "12 trận đang diễn ra",
    icon: ClipboardCheck,
    action: "supervise-matches",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Quản lý trọng tài",
    description: "28 trọng tài hoạt động",
    icon: Users,
    action: "manage-referees",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Nhật ký quyết định",
    description: "45 quyết định hôm nay",
    icon: FileText,
    action: "view-decisions",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Báo cáo hiệu suất",
    description: "Xem thống kê",
    icon: TrendingUp,
    action: "view-reports",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Cài đặt hệ thống",
    description: "Cấu hình quy trình",
    icon: Settings,
    action: "settings",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.action}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:shadow-md transition-shadow"
              onClick={() => onAction(item.action)}
            >
              <div className={`p-2 rounded-lg ${item.bgColor} mb-2`}>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
