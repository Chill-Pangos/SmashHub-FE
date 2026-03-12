import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  ChevronRight,
  Award,
} from "lucide-react";
import { useAuth } from "@/store/useAuth";
import type { TeamMember, Match } from "@/types";
import { StatsCard, QuickActions, UpcomingMatches } from "./components";
import { useTeamsByUser, useMatchesByStatus } from "@/hooks/queries";

interface AthleteDashboardProps {
  onNavigateTo?: (tab: string) => void;
}

export default function AthleteDashboard({
  onNavigateTo,
}: AthleteDashboardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Fetch teams where user is athlete
  const { data: teamsData, isLoading: teamsLoading } = useTeamsByUser(
    user?.id ?? 0,
    0,
    50,
    { enabled: !!user?.id },
  );

  // Fetch scheduled matches
  const { data: scheduledData, isLoading: scheduledLoading } =
    useMatchesByStatus("scheduled", 0, 10);

  // Fetch completed matches
  const { data: completedData, isLoading: completedLoading } =
    useMatchesByStatus("completed", 0, 10);

  // Derived state
  const myTeams = useMemo(() => {
    const teams = teamsData || [];
    return teams.filter((tm: TeamMember) => tm.role === "athlete");
  }, [teamsData]);

  const upcomingMatches = useMemo(() => {
    return Array.isArray(scheduledData)
      ? scheduledData
      : scheduledData?.data || [];
  }, [scheduledData]);

  const stats = useMemo(() => {
    const completed: Match[] = Array.isArray(completedData)
      ? completedData
      : completedData?.data || [];

    const totalMatches = completed.length;
    const wins = completed.filter((m) => m.winnerEntryId !== null).length;
    const losses = totalMatches - wins;
    const winRate =
      totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    return {
      currentElo: 1500, // Default ELO, should be fetched from user profile API
      totalMatches,
      wins,
      losses,
      winRate,
    };
  }, [completedData]);

  const isLoading = teamsLoading || scheduledLoading || completedLoading;

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
            {t("home.welcomeBack", { name: user?.username })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("athlete.trackPerformanceAndSchedule")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("athlete.currentElo")}
          value={stats.currentElo}
          icon={TrendingUp}
          description={t("athlete.rankingPoints")}
        />
        <StatsCard
          title={t("athlete.totalMatches")}
          value={stats.totalMatches}
          icon={Target}
          description={t("athlete.played")}
        />
        <StatsCard
          title={t("athlete.winLoss")}
          value={`${stats.wins}/${stats.losses}`}
          icon={Award}
          description={`${t("athlete.winRate")}: ${stats.winRate}%`}
        />
        <StatsCard
          title={t("match.upcomingMatches")}
          value={upcomingMatches.length}
          icon={Calendar}
          description={t("athlete.awaitingMatch")}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions onNavigateTo={onNavigateTo} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Matches */}
        <UpcomingMatches matches={upcomingMatches} />

        {/* My Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t("athlete.myDelegation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myTeams.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t("athlete.noDelegation")}
              </p>
            ) : (
              <div className="space-y-3">
                {myTeams.map((teamMember) => (
                  <div
                    key={teamMember.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {teamMember.team?.name ||
                          t("athlete.undefinedDelegation")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("athlete.athlete")}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
