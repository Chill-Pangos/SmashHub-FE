import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Users, Trophy, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import {
  useTeamsByUser,
  useTournamentsByStatus,
  queryKeys,
} from "@/hooks/queries";
import { useQueries } from "@tanstack/react-query";
import type { TeamMember } from "@/types";
import { StatsCard, QuickActions } from "./components";

interface CoachDashboardProps {
  onNavigateTo?: (tab: string) => void;
}

export default function CoachDashboard({ onNavigateTo }: CoachDashboardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Fetch teams where user is coach
  const { data: teamsData = [], isLoading: isLoadingTeams } = useTeamsByUser(
    user?.id ?? 0,
    0,
    50,
    { enabled: !!user?.id },
  );

  const coachTeams = useMemo(
    () => teamsData.filter((tm) => tm.role === "coach"),
    [teamsData],
  );

  // Fetch athletes from each team using useQueries
  const teamIds = useMemo(
    () => coachTeams.map((t) => t.team?.id).filter((id): id is number => !!id),
    [coachTeams],
  );

  const athleteQueries = useQueries({
    queries: teamIds.map((teamId) => ({
      queryKey: queryKeys.teamMembers.byTeam(teamId),
      queryFn: async () => {
        const { teamMemberService } = await import("@/services");
        return teamMemberService.getMembersByTeamId(teamId, 0, 100);
      },
      enabled: teamId > 0,
    })),
  });

  const athletes = useMemo(() => {
    const allAthletes: TeamMember[] = [];
    athleteQueries.forEach((query) => {
      if (query.data) {
        const teamAthletes = query.data.filter((m) => m.role === "athlete");
        allAthletes.push(...teamAthletes);
      }
    });
    return allAthletes;
  }, [athleteQueries]);

  const isLoadingAthletes = athleteQueries.some((q) => q.isLoading);

  // Fetch upcoming tournaments
  const { data: upcomingTournaments = [], isLoading: isLoadingTournaments } =
    useTournamentsByStatus("upcoming", 0, 10);

  const isLoading = isLoadingTeams || isLoadingAthletes || isLoadingTournaments;

  // Stats computed from query data
  const stats = useMemo(
    () => ({
      totalAthletes: athletes.length,
      totalTeams: coachTeams.length,
      activeTournaments: upcomingTournaments.length,
      upcomingMatches: 0,
    }),
    [athletes.length, coachTeams.length, upcomingTournaments.length],
  );

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t("home.welcomeBack", { name: user?.username || "" })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("coach.coachDashboard")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("nav.athletes")}
          value={stats.totalAthletes}
          icon={Users}
          description={t("coach.trainingPlan")}
        />
        <StatsCard
          title={t("team.delegation")}
          value={stats.totalTeams}
          icon={Users}
          description={t("coach.coachDashboard")}
        />
        <StatsCard
          title={t("tournament.tournaments")}
          value={stats.activeTournaments}
          icon={Trophy}
          description={t("tournament.upcoming")}
        />
        <StatsCard
          title={t("match.matches")}
          value={stats.upcomingMatches}
          icon={Calendar}
          description={t("match.upcomingMatches")}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions onNavigateTo={onNavigateTo} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Athletes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("nav.athletes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {athletes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t("message.noResultsFound")}
              </p>
            ) : (
              <div className="space-y-3">
                {athletes.slice(0, 5).map((athlete) => (
                  <div
                    key={athlete.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {athlete.user?.firstName} {athlete.user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {athlete.user?.email}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t("match.upcomingMatches")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTournaments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t("message.noResultsFound")}
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingTournaments.slice(0, 5).map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{tournament.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tournament.startDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                    <Badge variant="outline">{tournament.location}</Badge>
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
