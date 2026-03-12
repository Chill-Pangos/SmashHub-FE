import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";
import { useTournaments, useTournamentsByStatus } from "@/hooks/queries";
import type { Tournament, TournamentStatus } from "@/types";
import TournamentDetailViewer from "@/components/custom/TournamentDetailViewer";

export default function TeamTournaments() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "ongoing" | "completed"
  >("all");
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  // React Query hooks - conditionally fetch based on filter
  const allTournamentsQuery = useTournaments(0, 50);
  const statusTournamentsQuery = useTournamentsByStatus(
    filter as TournamentStatus,
    0,
    50,
    { enabled: filter !== "all" },
  );

  const isLoading =
    filter === "all"
      ? allTournamentsQuery.isLoading
      : statusTournamentsQuery.isLoading;
  const tournaments =
    filter === "all"
      ? allTournamentsQuery.data || []
      : statusTournamentsQuery.data || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
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
        <h1 className="text-3xl font-bold">{t("tournament.tournaments")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("teamManager.tournamentsDescription")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: "all", label: t("common.all") },
          { value: "upcoming", label: t("tournament.upcoming") },
          { value: "ongoing", label: t("tournament.ongoing") },
          { value: "completed", label: t("tournament.completed") },
        ].map((tab) => (
          <Badge
            key={tab.value}
            variant={filter === tab.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter(tab.value as typeof filter)}
          >
            {tab.label}
          </Badge>
        ))}
      </div>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("tournament.noTournamentFound")}
            </h3>
            <p className="text-muted-foreground">
              {t("tournament.tryChangingFilter")}
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
                        {tournament.contents.length} {t("tournament.contents")}
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
