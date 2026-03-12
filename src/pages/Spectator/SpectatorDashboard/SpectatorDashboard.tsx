import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Radio, Users } from "lucide-react";
import { useTournamentsByStatus, useMatchesByStatus } from "@/hooks/queries";
import { useTranslation } from "@/hooks/useTranslation";
import type { Match } from "@/types";

export default function SpectatorDashboard() {
  const { t } = useTranslation();

  // Fetch ongoing tournaments using React Query
  const { data: tournamentsData, isLoading: isTournamentsLoading } =
    useTournamentsByStatus("ongoing", 0, 10);

  // Fetch live matches using React Query
  const { data: liveMatchesData, isLoading: isMatchesLoading } =
    useMatchesByStatus("in_progress", 0, 10);

  // Derive tournaments from query data
  const tournaments = useMemo(() => {
    if (!tournamentsData) return [];
    const data = Array.isArray(tournamentsData) ? tournamentsData : [];
    return data.slice(0, 5);
  }, [tournamentsData]);

  // Derive live matches from query data
  const liveMatches = useMemo(() => {
    if (!liveMatchesData) return [];
    return Array.isArray(liveMatchesData)
      ? liveMatchesData
      : (liveMatchesData as { data?: Match[] }).data || [];
  }, [liveMatchesData]);

  const isLoading = isTournamentsLoading || isMatchesLoading;

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
        <h1 className="text-3xl font-bold">{t("spectator.homepage")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("spectator.trackTournamentsAndMatches")}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("spectator.ongoingTournaments")}
                </p>
                <p className="text-2xl font-bold">{tournaments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Radio className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("spectator.liveMatches")}
                </p>
                <p className="text-2xl font-bold">{liveMatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("spectator.eventsToday")}
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("spectator.participatingAthletes")}
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Live Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Radio className="h-5 w-5" />
              {t("spectator.liveMatches")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveMatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("spectator.noLiveMatches")}
              </p>
            ) : (
              <div className="space-y-3">
                {liveMatches.slice(0, 5).map((match) => (
                  <div
                    key={match.id}
                    className="p-3 border border-orange-200 bg-orange-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        Entry {match.entryAId} vs Entry {match.entryBId}
                      </span>
                      <Badge variant="default" className="bg-orange-600">
                        LIVE
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Schedule ID: {match.scheduleId || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ongoing Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t("spectator.ongoingTournamentsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tournaments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("spectator.noOngoingTournaments")}
              </p>
            ) : (
              <div className="space-y-3">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{tournament.name}</span>
                      <Badge variant="default">{t("tournament.ongoing")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tournament.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
