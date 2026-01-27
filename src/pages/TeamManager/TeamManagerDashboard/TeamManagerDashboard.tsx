import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Calendar, ChevronRight, UserCheck } from "lucide-react";
import { teamMemberService, tournamentService } from "@/services";
import { useAuth } from "@/store/useAuth";
import { showToast } from "@/utils";
import type { TeamMember, Tournament } from "@/types";
import { StatsCard } from "./components/StatsCard";
import { QuickActions } from "./components/QuickActions";

interface TeamManagerDashboardProps {
  onNavigateTo?: (tab: string) => void;
}

export default function TeamManagerDashboard({
  onNavigateTo,
}: TeamManagerDashboardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<TeamMember[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>(
    [],
  );

  // Stats
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMembers: 0,
    activeTournaments: 0,
    pendingRegistrations: 0,
  });

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Fetch teams where user is team manager
      const teamsResponse = await teamMemberService.getTeamsByUserId(
        user.id,
        0,
        50,
      );
      const teams = teamsResponse.filter((tm) => tm.role === "team_manager");
      setMyTeams(teams);

      // Fetch upcoming tournaments
      const tournamentsResponse =
        await tournamentService.getTournamentsByStatus("upcoming", 0, 10);
      setUpcomingTournaments(tournamentsResponse);

      // Calculate stats
      let totalMembers = 0;
      for (const team of teams) {
        if (team.team?.id) {
          try {
            const members = await teamMemberService.getMembersByTeamId(
              team.team.id,
              0,
              100,
            );
            totalMembers += members.length;
          } catch {
            // Ignore error
          }
        }
      }

      setStats({
        totalTeams: teams.length,
        totalMembers,
        activeTournaments: tournamentsResponse.length,
        pendingRegistrations: 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

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
            Quản lý đoàn thể thao của bạn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Đoàn của tôi"
          value={stats.totalTeams}
          icon={Users}
          description="Số đoàn đang quản lý"
        />
        <StatsCard
          title="Thành viên"
          value={stats.totalMembers}
          icon={UserCheck}
          description="Tổng số thành viên"
        />
        <StatsCard
          title="Giải đấu"
          value={stats.activeTournaments}
          icon={Trophy}
          description="Giải đấu sắp tới"
        />
        <StatsCard
          title="Chờ đăng ký"
          value={stats.pendingRegistrations}
          icon={Calendar}
          description="Nội dung chờ đăng ký"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions onNavigateTo={onNavigateTo} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* My Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Đoàn của tôi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myTeams.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Bạn chưa quản lý đoàn nào
              </p>
            ) : (
              <div className="space-y-3">
                {myTeams.slice(0, 5).map((teamMember) => (
                  <div
                    key={teamMember.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {teamMember.team?.name || "Đoàn chưa xác định"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Trưởng đoàn
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
                {myTeams.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => onNavigateTo?.("my-team")}
                  >
                    Xem tất cả ({myTeams.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Giải đấu sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTournaments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Không có giải đấu sắp tới
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
                {upcomingTournaments.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => onNavigateTo?.("tournaments")}
                  >
                    Xem tất cả ({upcomingTournaments.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
