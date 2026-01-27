import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin } from "lucide-react";
import { scheduleService, tournamentService, matchService } from "@/services";
import { showToast } from "@/utils";
import type { Tournament, Schedule, Match } from "@/types";

export default function TeamSchedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const fetchTournaments = useCallback(async () => {
    try {
      const response = await tournamentService.getAllTournaments(0, 50);
      setTournaments(response);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!selectedTournamentId) return;

    try {
      setIsLoading(true);
      const response = await scheduleService.getAllSchedules(0, 100);
      if (response.success && response.data) {
        setSchedules(response.data);
      }

      // Fetch matches
      const matchesResponse = await matchService.getAllMatches(0, 100);
      const matchesArray = Array.isArray(matchesResponse)
        ? matchesResponse
        : matchesResponse.data || [];
      setMatches(matchesArray);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      showToast.error("Không thể tải lịch thi đấu");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTournamentId]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchSchedules();
    }
  }, [selectedTournamentId, fetchSchedules]);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      scheduled: "outline",
      in_progress: "default",
      completed: "secondary",
    };
    const labels: Record<string, string> = {
      scheduled: "Chưa bắt đầu",
      in_progress: "Đang diễn ra",
      completed: "Đã kết thúc",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading && !selectedTournamentId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Lịch thi đấu</h1>
        <p className="text-muted-foreground mt-1">
          Xem lịch thi đấu của các giải đấu
        </p>
      </div>

      {/* Tournament Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Chọn giải đấu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTournamentId?.toString() || ""}
            onValueChange={(value) =>
              setSelectedTournamentId(value ? Number(value) : null)
            }
          >
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="-- Chọn giải đấu --" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map((tournament) => (
                <SelectItem
                  key={tournament.id}
                  value={tournament.id.toString()}
                >
                  {tournament.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Schedule List */}
      {selectedTournamentId && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch trận đấu</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : matches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có lịch thi đấu nào
              </p>
            ) : (
              <div className="space-y-4">
                {matches.slice(0, 20).map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-medium">
                          Entry {match.entryAId} vs Entry {match.entryBId}
                        </span>
                        {getStatusBadge(match.status)}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {schedules.find((s) => s.id === match.scheduleId)
                              ?.matchTime
                              ? new Date(
                                  schedules.find(
                                    (s) => s.id === match.scheduleId,
                                  )!.matchTime,
                                ).toLocaleString("vi-VN")
                              : "Chưa xác định"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            Bàn{" "}
                            {schedules.find((s) => s.id === match.scheduleId)
                              ?.tableNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {match.winnerEntryId && (
                      <Badge variant="default">
                        Thắng: Entry {match.winnerEntryId}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
