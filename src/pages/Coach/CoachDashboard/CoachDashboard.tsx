import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Calendar, ChevronRight } from "lucide-react";
import { teamMemberService, tournamentService } from "@/services";
import { useAuth } from "@/store/useAuth";
import { showToast } from "@/utils";
import type { TeamMember, Tournament } from "@/types";
import { StatsCard, QuickActions } from "./components";

interface CoachDashboardProps {
  onNavigateTo?: (tab: string) => void;
}

export default function CoachDashboard({ onNavigateTo }: CoachDashboardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [, setMyTeams] = useState<TeamMember[]>([]);
  const [athletes, setAthletes] = useState<TeamMember[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>(
    [],
  );

  // Stats
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalTeams: 0,
    activeTournaments: 0,
    upcomingMatches: 0,
  });

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Fetch teams where user is coach
      const teamsResponse = await teamMemberService.getTeamsByUserId(
        user.id,
        0,
        50,
      );
      const coachTeams = teamsResponse.filter((tm) => tm.role === "coach");
      setMyTeams(coachTeams);

      // Fetch athletes from each team
      let allAthletes: TeamMember[] = [];
      for (const team of coachTeams) {
        if (team.team?.id) {
          try {
            const members = await teamMemberService.getMembersByTeamId(
              team.team.id,
              0,
              100,
            );
            const teamAthletes = members.filter((m) => m.role === "athlete");
            allAthletes = [...allAthletes, ...teamAthletes];
          } catch {
            // Ignore error
          }
        }
      }
      setAthletes(allAthletes);

      // Fetch upcoming tournaments
      const tournamentsResponse =
        await tournamentService.getTournamentsByStatus("upcoming", 0, 10);
      setUpcomingTournaments(tournamentsResponse);

      setStats({
        totalAthletes: allAthletes.length,
        totalTeams: coachTeams.length,
        activeTournaments: tournamentsResponse.length,
        upcomingMatches: 0,
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
          <h1 className="text-3xl font-bold">
            Xin chào, HLV {user?.username}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý vận động viên và theo dõi thi đấu
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Vận động viên"
          value={stats.totalAthletes}
          icon={Users}
          description="Đang huấn luyện"
        />
        <StatsCard
          title="Đoàn"
          value={stats.totalTeams}
          icon={Users}
          description="Đang phụ trách"
        />
        <StatsCard
          title="Giải đấu"
          value={stats.activeTournaments}
          icon={Trophy}
          description="Sắp diễn ra"
        />
        <StatsCard
          title="Trận đấu"
          value={stats.upcomingMatches}
          icon={Calendar}
          description="Sắp tới"
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
              Vận động viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            {athletes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Chưa có vận động viên nào
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
