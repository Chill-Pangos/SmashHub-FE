import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { matchService, scheduleService } from "@/services";
import { showToast } from "@/utils";
import type { Match, Schedule } from "@/types";

export default function SpectatorSchedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledMatches, setScheduledMatches] = useState<Match[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch schedules
      const schedulesResponse = await scheduleService.getAllSchedules(0, 100);
      if (schedulesResponse.success && schedulesResponse.data) {
        setSchedules(schedulesResponse.data);
      }

      // Fetch matches
      const response = await matchService.getMatchesByStatus(
        "scheduled",
        0,
        100,
      );
      const matches = Array.isArray(response) ? response : response.data || [];
      setScheduledMatches(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      showToast.error("Không thể tải lịch thi đấu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const groupMatchesByDate = (matches: Match[]) => {
    const grouped: Record<string, Match[]> = {};
    matches.forEach((match) => {
      const schedule = schedules.find((s) => s.id === match.scheduleId);
      const date = schedule?.matchTime
        ? new Date(schedule.matchTime).toLocaleDateString("vi-VN")
        : "Chưa xác định";
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(match);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const groupedMatches = groupMatchesByDate(scheduledMatches);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Lịch thi đấu</h1>
        <p className="text-muted-foreground mt-1">
          Xem lịch các trận đấu sắp diễn ra
        </p>
      </div>

      {/* Schedule by Date */}
      {scheduledMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Chưa có trận đấu nào được lên lịch
            </h3>
            <p className="text-muted-foreground">
              Các trận đấu sẽ được cập nhật khi giải đấu diễn ra
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedMatches).map(([date, matches]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {matches.map((match) => {
                  const schedule = schedules.find(
                    (s) => s.id === match.scheduleId,
                  );
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          Entry {match.entryAId} vs Entry {match.entryBId}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {schedule?.matchTime
                                ? new Date(
                                    schedule.matchTime,
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Chưa xác định"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>Bàn {schedule?.tableNumber || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">Chưa bắt đầu</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
