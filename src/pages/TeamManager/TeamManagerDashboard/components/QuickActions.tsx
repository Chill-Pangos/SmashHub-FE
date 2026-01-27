import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileSpreadsheet, Trophy } from "lucide-react";

interface QuickActionsProps {
  onNavigateTo?: (tab: string) => void;
}

export function QuickActions({ onNavigateTo }: QuickActionsProps) {
  const actions = [
    {
      id: "my-team",
      label: "Xem đoàn của tôi",
      description: "Quản lý thành viên trong đoàn",
      icon: Users,
      variant: "default" as const,
    },
    {
      id: "registration",
      label: "Đăng ký thi đấu",
      description: "Đăng ký nội dung thi đấu",
      icon: FileSpreadsheet,
      variant: "outline" as const,
    },
    {
      id: "tournaments",
      label: "Xem giải đấu",
      description: "Danh sách giải đấu có sẵn",
      icon: Trophy,
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onNavigateTo?.(action.id)}
            >
              <action.icon className="h-6 w-6" />
              <span className="font-medium">{action.label}</span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
