import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import type { Match } from "@/types";
import { useMatchesByStatus } from "@/hooks/queries";

export default function AthleteSchedule() {
  const { t } = useTranslation();

  // Fetch scheduled matches
  const { data: scheduledData, isLoading: scheduledLoading } =
    useMatchesByStatus("scheduled", 0, 50);

  // Fetch in_progress matches
  const { data: inProgressData, isLoading: inProgressLoading } =
    useMatchesByStatus("in_progress", 0, 50);

  const scheduledMatches: Match[] = useMemo(() => {
    return Array.isArray(scheduledData)
      ? scheduledData
      : scheduledData?.data || [];
  }, [scheduledData]);

  const inProgressMatches: Match[] = useMemo(() => {
    return Array.isArray(inProgressData)
      ? inProgressData
      : inProgressData?.data || [];
  }, [inProgressData]);

  const isLoading = scheduledLoading || inProgressLoading;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      scheduled: "outline",
      in_progress: "default",
      completed: "secondary",
    };
    const labels: Record<string, string> = {
      scheduled: t("athlete.notStarted"),
      in_progress: t("tournament.ongoing"),
      completed: t("tournament.completed"),
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("schedule.schedule")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("athlete.viewYourMatchSchedule")}
        </p>
      </div>

      {/* In Progress Matches */}
      {inProgressMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              {t("athlete.matchInProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 border-2 border-orange-200 bg-orange-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Entry {match.entryAId} vs Entry {match.entryBId}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>Schedule ID: {match.scheduleId || "N/A"}</span>
                    </div>
                  </div>
                  {getStatusBadge(match.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("match.upcomingMatches")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledMatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("athlete.noMatchesScheduled")}
            </p>
          ) : (
            <div className="space-y-4">
              {scheduledMatches.map((match) => (
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
                    <p className="text-sm text-muted-foreground">
                      Schedule ID: {match.scheduleId || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
