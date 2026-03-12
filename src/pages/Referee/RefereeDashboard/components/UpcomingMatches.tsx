import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import type { Match, Schedule } from "@/types";

interface UpcomingMatch {
  match: Match;
  schedule?: Schedule;
  entryAName?: string;
  entryBName?: string;
  contentName?: string;
}

interface UpcomingMatchesProps {
  matches: UpcomingMatch[];
  isLoading?: boolean;
}

export default function UpcomingMatches({
  matches,
  isLoading,
}: UpcomingMatchesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Trận đấu sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Trận đấu sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Không có trận đấu nào được phân công
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Trận đấu sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map(
          ({ match, schedule, entryAName, entryBName, contentName }) => (
            <div
              key={match.id}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{contentName || "Nội dung"}</Badge>
                    <Badge
                      variant={
                        match.status === "scheduled" ? "secondary" : "default"
                      }
                    >
                      {match.status === "scheduled"
                        ? "Chờ bắt đầu"
                        : match.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-4 w-4" />
                    <span>{entryAName || `Entry ${match.entryAId}`}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span>{entryBName || `Entry ${match.entryBId}`}</span>
                  </div>
                  {schedule && schedule.matchTime && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(schedule.matchTime).toLocaleString("vi-VN")}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Bàn {schedule.tableNumber}
                      </div>
                    </div>
                  )}
                </div>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Chờ Tổng trọng tài bắt đầu
                </Badge>
              </div>
            </div>
          ),
        )}
      </CardContent>
    </Card>
  );
}
