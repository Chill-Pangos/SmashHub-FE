import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Calendar, MapPin, Search } from "lucide-react";
import { useTournaments } from "@/hooks/queries";
import { useTranslation } from "@/hooks/useTranslation";
import TournamentDetailViewer from "@/components/custom/TournamentDetailViewer";
import type { Tournament } from "@/types";

export default function SpectatorTournaments() {
  const { t } = useTranslation();
  const { data: tournaments = [], isLoading } = useTournaments(0, 100);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  const filteredTournaments = useMemo(() => {
    let filtered = tournaments;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [tournaments, statusFilter, searchQuery]);

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
        <h1 className="text-3xl font-bold">{t("spectator.tournamentList")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("spectator.viewTournaments")}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("message.searchTournament")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("common.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="upcoming">
                  {t("tournament.upcoming")}
                </SelectItem>
                <SelectItem value="ongoing">
                  {t("tournament.ongoing")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("tournament.completed")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Grid */}
      {filteredTournaments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("spectator.noTournamentFound")}
            </h3>
            <p className="text-muted-foreground">
              {t("spectator.tryChangingFilter")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTournaments.map((tournament) => (
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
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tournament.contents.slice(0, 3).map((content) => (
                        <Badge
                          key={content.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {content.type}
                        </Badge>
                      ))}
                      {tournament.contents.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tournament.contents.length - 3}
                        </Badge>
                      )}
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
