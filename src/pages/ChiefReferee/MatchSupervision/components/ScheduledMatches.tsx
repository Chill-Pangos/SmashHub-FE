import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Play, RefreshCw, Users } from "lucide-react";
import {
  useMatchesByStatus,
  useStartMatch,
  useSchedules,
} from "@/hooks/queries";
import { showToast } from "@/utils/toast.utils";
import type { Match, Schedule } from "@/types";

interface ScheduledMatchWithSchedule {
  match: Match;
  schedule?: Schedule;
}

export default function ScheduledMatches() {
  const [startingMatchId, setStartingMatchId] = useState<number | null>(null);

  // Fetch scheduled matches using React Query
  const {
    data: matchesResponse,
    isLoading,
    refetch: refetchMatches,
  } = useMatchesByStatus("scheduled", 0, 50);

  // Fetch all schedules to map to matches
  const { data: schedulesResponse } = useSchedules(0, 100);

  // Process matches with their schedules
  const matches = useMemo<ScheduledMatchWithSchedule[]>(() => {
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

  // Start match mutation
  const startMatchMutation = useStartMatch();

  /**
   * Start a match - Chief Referee only
   * This changes the match status from "scheduled" to "in_progress"
   */
  const handleStartMatch = async (matchId: number) => {
    setStartingMatchId(matchId);
    startMatchMutation.mutate(matchId, {
      onSuccess: () => {
        showToast.success("Thành công", "Đã bắt đầu trận đấu");
        refetchMatches();
      },
      onError: (error) => {
        console.error("Error starting match:", error);
        showToast.error("Lỗi", "Không thể bắt đầu trận đấu");
      },
      onSettled: () => {
        setStartingMatchId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trận đấu chờ bắt đầu</CardTitle>
          <CardDescription>
            Các trận đã lên lịch, chờ Chief Referee bắt đầu
          </CardDescription>
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
              <Clock className="h-5 w-5" />
              Trận đấu chờ bắt đầu
            </CardTitle>
            <CardDescription>
              {matches.length} trận đang chờ bắt đầu
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
            Không có trận đấu nào chờ bắt đầu
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(({ match, schedule }) => (
              <div
                key={match.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Trận #{match.id}</Badge>
                      <Badge variant="outline">Chờ bắt đầu</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Users className="h-4 w-4" />
                      <span>Entry {match.entryAId}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span>Entry {match.entryBId}</span>
                    </div>
                    {schedule && (
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
                    {match.umpire && (
                      <div className="text-sm text-muted-foreground">
                        Trọng tài: User #{match.umpire}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleStartMatch(match.id)}
                    disabled={startingMatchId === match.id}
                  >
                    {startingMatchId === match.id ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Bắt đầu trận
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
