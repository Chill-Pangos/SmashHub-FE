import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useSchedules, useMatchesByStatus } from "@/hooks/queries";
import { useTranslation } from "@/hooks/useTranslation";
import type { Match } from "@/types";

export default function SpectatorSchedule() {
  const { t } = useTranslation();

  // React Query hooks
  const { data: schedulesResponse, isLoading: isLoadingSchedules } =
    useSchedules(0, 100);
  const { data: matchesResponse, isLoading: isLoadingMatches } =
    useMatchesByStatus("scheduled", 0, 100);

  const schedules = schedulesResponse?.data || [];
  const scheduledMatches = Array.isArray(matchesResponse)
    ? matchesResponse
    : matchesResponse?.data || [];
  const isLoading = isLoadingSchedules || isLoadingMatches;

  const groupMatchesByDate = (matches: Match[]) => {
    const grouped: Record<string, Match[]> = {};
    matches.forEach((match) => {
      const schedule = schedules.find((s) => s.id === match.scheduleId);
      const date = schedule?.matchTime
        ? new Date(schedule.matchTime).toLocaleDateString("vi-VN")
        : t("schedule.notDetermined");
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
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const groupedMatches = groupMatchesByDate(scheduledMatches);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("schedule.schedule")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("spectator.viewUpcomingMatches")}
        </p>
      </div>

      {/* Schedule by Date */}
      {scheduledMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("spectator.noMatchesScheduled")}
            </h3>
            <p className="text-muted-foreground">
              {t("spectator.matchesWillUpdate")}
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
                                : t("schedule.notDetermined")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {t("schedule.table")}{" "}
                              {schedule?.tableNumber || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{t("athlete.notStarted")}</Badge>
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
