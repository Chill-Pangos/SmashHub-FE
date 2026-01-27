import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  ChevronRight,
  Award,
} from "lucide-react";
import { teamMemberService, matchService } from "@/services";
import { useAuth } from "@/store/useAuth";
import { showToast } from "@/utils";
import type { TeamMember, Match } from "@/types";
import { StatsCard, QuickActions, UpcomingMatches } from "./components";

interface AthleteDashboardProps {
  onNavigateTo?: (tab: string) => void;
}

export default function AthleteDashboard({
  onNavigateTo,
}: AthleteDashboardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<TeamMember[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  // Stats
  const [stats, setStats] = useState({
    currentElo: 1500,
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
  });

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Fetch teams where user is athlete
      const teamsResponse = await teamMemberService.getTeamsByUserId(
        user.id,
        0,
        50,
      );
      const athleteTeams = teamsResponse.filter((tm) => tm.role === "athlete");
      setMyTeams(athleteTeams);

      // Fetch scheduled matches
      const scheduledResponse = await matchService.getMatchesByStatus(
        "scheduled",
        0,
        10,
      );
      const scheduled = Array.isArray(scheduledResponse)
        ? scheduledResponse
        : scheduledResponse.data || [];
      setUpcomingMatches(scheduled);

      // Fetch completed matches
      const completedResponse = await matchService.getMatchesByStatus(
        "completed",
        0,
        10,
      );
      const completed = Array.isArray(completedResponse)
        ? completedResponse
        : completedResponse.data || [];

      // Calculate stats
      const totalMatches = completed.length;
      const wins = completed.filter(
        (m: Match) => m.winnerEntryId !== null,
      ).length;
      const losses = totalMatches - wins;
      const winRate =
        totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

      setStats({
        currentElo: 1500, // Default ELO, should be fetched from user profile API
        totalMatches,
        wins,
        losses,
        winRate,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Xin chào, {user?.username}!</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi thành tích và lịch thi đấu của bạn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="ELO hiện tại"
          value={stats.currentElo}
          icon={TrendingUp}
          description="Điểm xếp hạng"
        />
        <StatsCard
          title="Tổng trận đấu"
          value={stats.totalMatches}
          icon={Target}
          description="Đã thi đấu"
        />
        <StatsCard
          title="Thắng/Thua"
          value={`${stats.wins}/${stats.losses}`}
          icon={Award}
          description={`Tỷ lệ thắng: ${stats.winRate}%`}
        />
        <StatsCard
          title="Trận sắp tới"
          value={upcomingMatches.length}
          icon={Calendar}
          description="Chờ thi đấu"
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
              Đoàn của tôi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myTeams.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Bạn chưa thuộc đoàn nào
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
                        {teamMember.team?.name || "Đoàn chưa xác định"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vận động viên
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
