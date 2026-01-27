import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trophy, History, TrendingUp } from "lucide-react";

interface QuickActionsProps {
  onNavigateTo?: (tab: string) => void;
}

export function QuickActions({ onNavigateTo }: QuickActionsProps) {
  const actions = [
    {
      id: "profile",
      label: "Hồ sơ cá nhân",
      description: "Xem và cập nhật thông tin",
      icon: User,
      variant: "default" as const,
    },
    {
      id: "tournaments",
      label: "Giải đấu",
      description: "Các giải đang tham gia",
      icon: Trophy,
      variant: "outline" as const,
    },
    {
      id: "match-history",
      label: "Lịch sử thi đấu",
      description: "Xem các trận đã đấu",
      icon: History,
      variant: "outline" as const,
    },
    {
      id: "elo-stats",
      label: "Thống kê ELO",
      description: "Biểu đồ điểm số",
      icon: TrendingUp,
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
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
