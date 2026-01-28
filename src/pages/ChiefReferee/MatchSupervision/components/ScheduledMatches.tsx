import { useState, useEffect, useCallback } from "react";
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
import { matchService, scheduleService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type { Match, Schedule } from "@/types";

interface ScheduledMatchWithSchedule {
  match: Match;
  schedule?: Schedule;
}

export default function ScheduledMatches() {
  const [matches, setMatches] = useState<ScheduledMatchWithSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startingMatchId, setStartingMatchId] = useState<number | null>(null);

  const fetchScheduledMatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await matchService.getMatchesByStatus(
        "scheduled",
        0,
        50,
      );
      const matchList = Array.isArray(response)
        ? response
        : response.data || [];

      // Fetch schedules for each match
      const matchesWithSchedules: ScheduledMatchWithSchedule[] =
        await Promise.all(
          matchList.map(async (match: Match) => {
            try {
              const scheduleResponse = await scheduleService.getScheduleById(
                match.scheduleId,
              );
              // Handle both ApiResponse wrapper and direct Schedule response
              let schedule: Schedule | undefined;
              if (scheduleResponse && typeof scheduleResponse === "object") {
                if ("data" in scheduleResponse && scheduleResponse.data) {
                  schedule = scheduleResponse.data as Schedule;
                } else if ("contentId" in scheduleResponse) {
                  // Direct Schedule object (has contentId which is required field)
                  schedule = scheduleResponse as unknown as Schedule;
                }
              }
              return { match, schedule };
            } catch {
              return { match, schedule: undefined };
            }
          }),
        );

      setMatches(matchesWithSchedules);
    } catch (error) {
      console.error("Error fetching scheduled matches:", error);
      showToast.error("Lỗi", "Không thể tải danh sách trận đấu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScheduledMatches();
  }, [fetchScheduledMatches]);

  /**
   * Start a match - Chief Referee only
   * This changes the match status from "scheduled" to "in_progress"
   */
  const handleStartMatch = async (matchId: number) => {
    try {
      setStartingMatchId(matchId);
      await matchService.startMatch(matchId);
      showToast.success("Thành công", "Đã bắt đầu trận đấu");
      fetchScheduledMatches();
    } catch (error) {
      console.error("Error starting match:", error);
      showToast.error("Lỗi", "Không thể bắt đầu trận đấu");
    } finally {
      setStartingMatchId(null);
    }
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
          <Button variant="outline" size="sm" onClick={fetchScheduledMatches}>
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
