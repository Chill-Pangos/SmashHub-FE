import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export interface Referee {
  id: string;
  name: string;
  email: string;
  status: "CONFIRMED" | "PENDING";
  role: "CHIEF" | "ASSISTANT";
  avatarUrl?: string;
}

interface RefereeCardProps {
  referee: Referee;
  isChief?: boolean;
}

export function RefereeCard({ referee, isChief }: RefereeCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={referee.avatarUrl} alt={referee.name} />
          <AvatarFallback className="bg-muted text-muted-foreground font-medium">
            {referee.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-card-foreground">
            {referee.name}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {isChief && <span className="text-primary mr-1">CHIEF</span>}
            {referee.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            referee.status === "CONFIRMED"
              ? "text-primary border-primary bg-primary/10"
              : "text-chart-4 border-chart-4 bg-chart-4/10"
          }`}
        >
          {referee.status}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
