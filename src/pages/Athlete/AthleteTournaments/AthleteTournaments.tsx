import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import type { Tournament, TeamMember } from "@/types";
import { useTeamsByUser, queryKeys } from "@/hooks/queries";
import TournamentDetailViewer from "@/components/custom/TournamentDetailViewer";

export default function AthleteTournaments() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  // Fetch teams where user is athlete
  const { data: teamsData, isLoading: teamsLoading } = useTeamsByUser(
    user?.id ?? 0,
    0,
    50,
    { enabled: !!user?.id },
  );

  // Get unique tournament IDs from teams
  const tournamentIds = useMemo(() => {
    const teams = teamsData || [];
    const athleteTeams = teams.filter(
      (tm: TeamMember) => tm.role === "athlete",
    );
    return [
      ...new Set(
        athleteTeams
          .map((tm: TeamMember) => tm.team?.tournamentId)
          .filter(Boolean),
      ),
    ] as number[];
  }, [teamsData]);

  // Fetch tournament details using individual useTournament hooks wrapped in useQueries
  // Since we need dynamic queries, we use the queryKey pattern directly
  const tournamentQueries = useQueries({
    queries: tournamentIds.map((id) => ({
      queryKey: queryKeys.tournaments.detail(id),
      queryFn: async () => {
        const { tournamentService } = await import("@/services");
        return tournamentService.getTournamentById(id);
      },
      enabled: id > 0,
    })),
  });

  const tournaments = useMemo(() => {
    return tournamentQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => query.data as Tournament);
  }, [tournamentQueries]);

  const isLoading =
    teamsLoading || tournamentQueries.some((query) => query.isLoading);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      upcoming: "outline",
      ongoing: "default",
      completed: "secondary",
    };
    const labels: Record<string, string> = {
      upcoming: t("tournament.upcoming"),
      ongoing: t("tournament.ongoing"),
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

  // Show tournament detail view if selected
  if (selectedTournament) {
    return (
      <div className="p-6">
        <TournamentDetailViewer
          tournament={selectedTournament}
          onBack={() => setSelectedTournament(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("athlete.myTournaments")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("athlete.tournamentsParticipating")}
        </p>
      </div>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("athlete.noTournamentsJoined")}
            </h3>
            <p className="text-muted-foreground">
              {t("athlete.contactDelegationToJoin")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTournament(tournament)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  {getStatusBadge(tournament.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(tournament.startDate).toLocaleDateString(
                        "vi-VN",
                      )}
                      {tournament.endDate && (
                        <>
                          {" "}
                          -{" "}
                          {new Date(tournament.endDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{tournament.location}</span>
                  </div>
                  {tournament.contents && tournament.contents.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {tournament.contents.length}{" "}
                        {t("athlete.eventContents")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
