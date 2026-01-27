import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/types";

interface TeamMemberListProps {
  members: TeamMember[];
  onSelect?: (member: TeamMember) => void;
}

export function TeamMemberList({ members, onSelect }: TeamMemberListProps) {
  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      team_manager: "default",
      coach: "secondary",
      athlete: "outline",
    };
    const labels: Record<string, string> = {
      team_manager: "Trưởng đoàn",
      coach: "HLV",
      athlete: "VĐV",
    };

    return (
      <Badge variant={variants[role] || "outline"}>
        {labels[role] || role}
      </Badge>
    );
  };

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onSelect?.(member)}
        >
          <div>
            <p className="font-medium">
              {member.user?.firstName} {member.user?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {member.user?.email}
            </p>
          </div>
          {getRoleBadge(member.role)}
        </div>
      ))}
    </div>
  );
}
