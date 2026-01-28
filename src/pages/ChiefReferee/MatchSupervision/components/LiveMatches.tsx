import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Users } from "lucide-react";
import { useMatchesByStatus, useSchedules } from "@/hooks/queries";
import type { Match, Schedule } from "@/types";

interface LiveMatchWithDetails {
  match: Match;
  schedule?: Schedule;
}

export default function LiveMatches() {
  // Fetch in_progress matches using React Query
  const {
    data: matchesResponse,
    isLoading,
    refetch: refetchMatches,
  } = useMatchesByStatus("in_progress", 0, 50);

  // Fetch all schedules to map to matches
  const { data: schedulesResponse } = useSchedules(0, 100);

  // Process matches with their schedules
  const matches = useMemo<LiveMatchWithDetails[]>(() => {
    const matchList = Array.isArray(matchesResponse)
      ? matchesResponse
      : matchesResponse?.data || [];

    const scheduleList = Array.isArray(schedulesResponse)
      ? schedulesResponse
      : schedulesResponse?.data || [];

    // Create a map of schedules by ID for quick lookup
    const scheduleMap = new Map<number, Schedule>();
    scheduleList.forEach((schedule: Schedule) => {
      scheduleMap.set(schedule.id, schedule);
    });

    return matchList.map((match: Match) => ({
      match,
      schedule: scheduleMap.get(match.scheduleId),
    }));
  }, [matchesResponse, schedulesResponse]);

  // Helper to format score from sets
  const formatScore = (match: Match): string => {
    const setsA = match.setsWonA ?? 0;
    const setsB = match.setsWonB ?? 0;
    return `${setsA} - ${setsB}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trận đấu đang diễn ra</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Trận đấu đang diễn ra
            </CardTitle>
            <CardDescription>
              {matches.length} trận đang được giám sát
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchMatches()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có trận đấu nào đang diễn ra
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(({ match, schedule }) => (
              <div key={match.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Trận #{match.id}</Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Đang thi đấu
                      </Badge>
                      {schedule && schedule.matchTime && (
                        <span className="text-xs text-muted-foreground">
                          📅{" "}
                          {new Date(schedule.matchTime).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      )}
                    </div>
                    {schedule && (
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        {schedule.tableNumber && `Bàn ${schedule.tableNumber}`}
                        {schedule.matchTime &&
                          ` • ${new Date(schedule.matchTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`}
                      </h3>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    Chi tiết
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry A</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Entry #{match.entryAId}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entry B</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Entry #{match.entryBId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Trọng tài</p>
                    <p className="text-sm font-medium">
                      {match.umpire
                        ? `User #${match.umpire}`
                        : "Chưa phân công"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tỷ số (sets)
                    </p>
                    <p className="text-sm font-semibold">
                      {formatScore(match)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
