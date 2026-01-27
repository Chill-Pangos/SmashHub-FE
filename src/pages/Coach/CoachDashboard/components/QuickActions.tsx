import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clipboard } from "lucide-react";

interface QuickActionsProps {
  onNavigateTo?: (tab: string) => void;
}

export function QuickActions({ onNavigateTo }: QuickActionsProps) {
  const actions = [
    {
      id: "athletes",
      label: "Quản lý VĐV",
      description: "Xem danh sách vận động viên",
      icon: Users,
      variant: "default" as const,
    },
    {
      id: "schedule",
      label: "Lịch thi đấu",
      description: "Xem lịch trận đấu",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      id: "training",
      label: "Kế hoạch huấn luyện",
      description: "Quản lý kế hoạch tập luyện",
      icon: Clipboard,
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
