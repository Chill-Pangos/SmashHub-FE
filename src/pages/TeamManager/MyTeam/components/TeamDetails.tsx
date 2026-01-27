import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import type { Team } from "@/types";

interface TeamDetailsProps {
  team: Team;
}

export function TeamDetails({ team }: TeamDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {team.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {team.description && (
          <p className="text-muted-foreground">{team.description}</p>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Ngày tạo: {new Date(team.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Thành viên: {team.members?.length || 0} người
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
