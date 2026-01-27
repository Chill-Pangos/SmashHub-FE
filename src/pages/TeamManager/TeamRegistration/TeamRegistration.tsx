import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Users, Trophy } from "lucide-react";
import { teamMemberService, tournamentService } from "@/services";
import { useAuth } from "@/store/useAuth";
import { showToast } from "@/utils";
import type { TeamMember, Tournament, TournamentContent } from "@/types";
import EntryImportDialog from "@/components/custom/EntryImportDialog";

export default function TeamRegistration() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<TeamMember[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [selectedContent, setSelectedContent] =
    useState<TournamentContent | null>(null);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);

  // Fetch teams where user is team_manager
  const fetchMyTeams = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await teamMemberService.getTeamsByUserId(user.id, 0, 50);
      const managerTeams = response.filter((tm) => tm.role === "team_manager");
      setMyTeams(managerTeams);

      if (managerTeams.length > 0) {
        setSelectedTeamId(managerTeams[0].team?.id || null);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      showToast.error("Không thể tải danh sách đoàn");
    }
  }, [user?.id]);

  // Fetch tournaments
  const fetchTournaments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await tournamentService.getTournamentsByStatus(
        "upcoming",
        0,
        50,
      );
      setTournaments(response);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      showToast.error("Không thể tải danh sách giải đấu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tournament details
  const fetchTournamentDetails = useCallback(async (id: number) => {
    try {
      const tournament = await tournamentService.getTournamentById(id);
      setSelectedTournament(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyTeams();
    fetchTournaments();
  }, [fetchMyTeams, fetchTournaments]);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchTournamentDetails(selectedTournamentId);
    } else {
      setSelectedTournament(null);
    }
  }, [selectedTournamentId, fetchTournamentDetails]);

  const handleOpenEntryDialog = (content: TournamentContent) => {
    setSelectedContent(content);
    setEntryDialogOpen(true);
  };

  const handleEntryImportSuccess = () => {
    setEntryDialogOpen(false);
    showToast.success("Đăng ký thành công", "Đã đăng ký nội dung thi đấu");
    // Refresh data
    if (selectedTournamentId) {
      fetchTournamentDetails(selectedTournamentId);
    }
  };

  const getContentTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      single: "default",
      double: "secondary",
      team: "outline",
    };
    const labels: Record<string, string> = {
      single: "Đơn",
      double: "Đôi",
      team: "Đội",
    };

    return (
      <Badge variant={variants[type] || "outline"}>
        {labels[type] || type}
      </Badge>
    );
  };

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
      <div>
        <h1 className="text-3xl font-bold">Đăng ký thi đấu</h1>
        <p className="text-muted-foreground mt-1">
          Đăng ký vận động viên tham gia các nội dung thi đấu
        </p>
      </div>

      {/* Selection Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Select Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Chọn đoàn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedTeamId?.toString() || ""}
              onValueChange={(value) =>
                setSelectedTeamId(value ? Number(value) : null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn đoàn của bạn --" />
              </SelectTrigger>
              <SelectContent>
                {myTeams.map((tm) => (
                  <SelectItem
                    key={tm.team?.id}
                    value={tm.team?.id?.toString() || ""}
                  >
                    {tm.team?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {myTeams.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Bạn chưa được phân công làm trưởng đoàn nào
              </p>
            )}
          </CardContent>
        </Card>

        {/* Select Tournament */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Chọn giải đấu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedTournamentId?.toString() || ""}
              onValueChange={(value) =>
                setSelectedTournamentId(value ? Number(value) : null)
              }
              disabled={!selectedTeamId}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn giải đấu --" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem
                    key={tournament.id}
                    value={tournament.id.toString()}
                  >
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tournaments.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Không có giải đấu nào đang mở đăng ký
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tournament Contents */}
      {selectedTournament && (
        <Card>
          <CardHeader>
            <CardTitle>Nội dung thi đấu - {selectedTournament.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedTournament.contents ||
            selectedTournament.contents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Giải đấu này chưa có nội dung thi đấu nào
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedTournament.contents.map((content) => (
                  <Card key={content.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{content.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Tối đa {content.maxEntries} entries
                          </p>
                        </div>
                        {getContentTypeBadge(content.type)}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        {content.gender && (
                          <p>
                            Giới tính:{" "}
                            {content.gender === "male"
                              ? "Nam"
                              : content.gender === "female"
                                ? "Nữ"
                                : "Hỗn hợp"}
                          </p>
                        )}
                        {content.minAge && content.maxAge && (
                          <p>
                            Độ tuổi: {content.minAge} - {content.maxAge}
                          </p>
                        )}
                        {content.minElo && content.maxElo && (
                          <p>
                            ELO: {content.minElo} - {content.maxElo}
                          </p>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleOpenEntryDialog(content)}
                        disabled={!selectedTeamId}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Đăng ký
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Entry Import Dialog */}
      {selectedContent && selectedTournamentId && (
        <EntryImportDialog
          open={entryDialogOpen}
          onOpenChange={(open) => setEntryDialogOpen(open)}
          contentId={selectedContent.id || 0}
          contentType={selectedContent.type}
          onImportSuccess={handleEntryImportSuccess}
        />
      )}
    </div>
  );
}
