import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Users,
  Trophy,
  ChevronRight,
  Download,
  FileSpreadsheet,
  CheckCircle,
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { showToast } from "@/utils";
import type { TeamMember, TournamentContent } from "@/types";
import EntryImportDialog from "@/components/custom/EntryImportDialog";
import TeamImportDialog from "@/components/custom/TeamImportDialog";
import ManualTeamRegistration from "./components/ManualTeamRegistration";
import ManualEntryRegistration from "./components/ManualEntryRegistration";
import {
  useTeamsByUser,
  useTournamentsByStatus,
  useTournament,
} from "@/hooks/queries";

export default function TeamRegistration() {
  const { user } = useAuth();

  // Local UI state
  const [activeStep, setActiveStep] = useState<"team" | "entries">("team");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedContent, setSelectedContent] =
    useState<TournamentContent | null>(null);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [teamImportOpen, setTeamImportOpen] = useState(false);
  const [teamImported, setTeamImported] = useState(false);

  // React Query hooks for data fetching
  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    refetch: refetchTeams,
  } = useTeamsByUser(user?.id || 0, 0, 50, {
    enabled: !!user?.id,
  });

  const { data: tournaments = [], isLoading: isTournamentsLoading } =
    useTournamentsByStatus("upcoming", 0, 50);

  const { data: selectedTournament, refetch: refetchTournament } =
    useTournament(selectedTournamentId || 0, {
      enabled: !!selectedTournamentId,
    });

  // Filter teams where user is team_manager
  const myTeams: TeamMember[] =
    teamsData?.filter((tm) => tm.role === "team_manager") || [];

  // Derive loading state from React Query
  const isLoading = isTeamsLoading || isTournamentsLoading;

  const handleOpenEntryDialog = (content: TournamentContent) => {
    setSelectedContent(content);
    setEntryDialogOpen(true);
  };

  const handleTeamImportSuccess = () => {
    setTeamImportOpen(false);
    setTeamImported(true);
    showToast.success("Import thành công", "Đã import danh sách đoàn thể thao");
    // Refresh teams using React Query
    refetchTeams();
    // Move to next step
    setActiveStep("entries");
  };

  const handleEntryImportSuccess = () => {
    setEntryDialogOpen(false);
    showToast.success("Đăng ký thành công", "Đã đăng ký nội dung thi đấu");
    // Refresh tournament data using React Query
    refetchTournament();
  };

  const handleDownloadTeamTemplate = () => {
    const link = document.createElement("a");
    link.href = "/src/assets/DangKyDanhSach.xlsx";
    link.download = "DangKyDanhSach.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Đã tải file mẫu đăng ký danh sách");
  };

  const handleDownloadEntryTemplate = (
    contentType: "single" | "double" | "team",
  ) => {
    const templates = {
      single: "/src/assets/DangKyNoiDungThiDau_Single.xlsx",
      double: "/src/assets/DangKyNoiDungThiDau_Double.xlsx",
      team: "/src/assets/DangKyNoiDungThiDau_Team.xlsx",
    };

    const link = document.createElement("a");
    link.href = templates[contentType];
    link.download = `DangKyNoiDungThiDau_${contentType}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Đã tải file mẫu đăng ký nội dung thi đấu");
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
        <h1 className="text-3xl font-bold">Đăng ký tham gia giải đấu</h1>
        <p className="text-muted-foreground mt-1">
          Đăng ký danh sách đoàn thể thao và nội dung thi đấu
        </p>
      </div>

      {/* Tournament Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Chọn giải đấu
            </label>
            <Select
              value={selectedTournamentId?.toString() || ""}
              onValueChange={(value) =>
                setSelectedTournamentId(value ? Number(value) : null)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Chọn giải đấu --" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem
                    key={tournament.id}
                    value={tournament.id.toString()}
                  >
                    {tournament.name} - {tournament.location} (
                    {new Date(tournament.startDate).toLocaleDateString("vi-VN")}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTournament && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Thông tin giải đấu:</span>
                <Badge
                  variant={
                    selectedTournament.status === "upcoming"
                      ? "default"
                      : selectedTournament.status === "ongoing"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedTournament.status === "upcoming"
                    ? "Sắp diễn ra"
                    : selectedTournament.status === "ongoing"
                      ? "Đang diễn ra"
                      : "Đã kết thúc"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Địa điểm: {selectedTournament.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Thời gian:{" "}
                  {new Date(selectedTournament.startDate).toLocaleDateString(
                    "vi-VN",
                  )}
                  {selectedTournament.endDate &&
                    ` - ${new Date(selectedTournament.endDate).toLocaleDateString("vi-VN")}`}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Số nội dung thi đấu:{" "}
                  {selectedTournament.contents?.length || 0}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {selectedTournamentId && (
        <>
          {/* Step Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant={activeStep === "team" ? "default" : "outline"}
              onClick={() => setActiveStep("team")}
              className="flex-1"
            >
              <Users className="mr-2 h-4 w-4" />
              Bước 1: Đăng ký danh sách đoàn
              {teamImported && (
                <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
              )}
            </Button>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <Button
              variant={activeStep === "entries" ? "default" : "outline"}
              onClick={() => setActiveStep("entries")}
              className="flex-1"
              disabled={!teamImported && myTeams.length === 0}
            >
              <Trophy className="mr-2 h-4 w-4" />
              Bước 2: Đăng ký nội dung thi đấu
            </Button>
          </div>

          {/* Step 1: Team Registration */}
          {activeStep === "team" && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Đăng ký danh sách đoàn thể thao
                </h3>
                <p className="text-sm text-muted-foreground">
                  Chọn cách để đăng ký đoàn: Import file Excel hoặc tạo thủ công
                </p>
              </div>

              {/* Current Teams */}
              {myTeams.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Bạn đang quản lý {myTeams.length} đoàn
                    </span>
                  </div>
                  <div className="space-y-1">
                    {myTeams.map((tm) => (
                      <div
                        key={tm.id}
                        className="text-sm text-green-700 dark:text-green-300"
                      >
                        • {tm.team?.name || `Đoàn #${tm.teamId}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs for Import vs Manual */}
              <Tabs defaultValue="import" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="import"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import Excel
                  </TabsTrigger>
                  <TabsTrigger
                    value="manual"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Tạo thủ công
                  </TabsTrigger>
                </TabsList>

                {/* Import Tab */}
                <TabsContent value="import" className="space-y-4 mt-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleDownloadTeamTemplate}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Tải file mẫu đăng ký danh sách
                    </Button>
                    <Button
                      onClick={() => setTeamImportOpen(true)}
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Import danh sách đoàn
                    </Button>
                  </div>

                  <div className="p-4 border border-dashed rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-medium text-foreground">
                          Hướng dẫn sử dụng:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Tải file mẫu Excel "DangKyDanhSach.xlsx"</li>
                          <li>
                            Điền thông tin các thành viên trong đoàn theo định
                            dạng
                          </li>
                          <li>
                            Mỗi đoàn cần có ít nhất 1 trưởng đoàn (team_manager)
                          </li>
                          <li>Các vai trò: team_manager, coach, athlete</li>
                          <li>
                            Upload file và kiểm tra preview trước khi xác nhận
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Manual Tab */}
                <TabsContent value="manual" className="mt-4">
                  <ManualTeamRegistration
                    tournamentId={selectedTournamentId}
                    onSuccess={() => {
                      setTeamImported(true);
                      refetchTeams();
                      setActiveStep("entries");
                    }}
                  />
                </TabsContent>
              </Tabs>

              {(teamImported || myTeams.length > 0) && (
                <Button
                  onClick={() => setActiveStep("entries")}
                  className="w-full"
                >
                  Tiếp tục: Đăng ký nội dung thi đấu
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </Card>
          )}

          {/* Step 2: Entry Registration */}
          {activeStep === "entries" && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Đăng ký nội dung thi đấu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Chọn cách để đăng ký: Import file Excel hoặc chọn thủ công
                </p>
              </div>

              {/* Select Team */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Chọn đoàn của bạn
                </label>
                <Select
                  value={selectedTeamId?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedTeamId(value ? Number(value) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Chọn đoàn --" />
                  </SelectTrigger>
                  <SelectContent>
                    {myTeams.map((tm) => (
                      <SelectItem key={tm.id} value={tm.teamId.toString()}>
                        {tm.team?.name || `Đoàn #${tm.teamId}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTeamId && (
                <Tabs defaultValue="import" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="import"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Import Excel
                    </TabsTrigger>
                    <TabsTrigger
                      value="manual"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Chọn thủ công
                    </TabsTrigger>
                  </TabsList>

                  {/* Import Tab */}
                  <TabsContent value="import" className="space-y-4 mt-4">
                    {/* Tournament Contents Grid */}
                    {selectedTournament?.contents &&
                    selectedTournament.contents.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {selectedTournament.contents.map((content) => (
                          <Card key={content.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium">
                                    {content.name}
                                  </h4>
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
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() =>
                                    handleDownloadEntryTemplate(content.type)
                                  }
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Tải file mẫu
                                </Button>
                                <Button
                                  className="w-full"
                                  onClick={() => handleOpenEntryDialog(content)}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Import đăng ký
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Giải đấu này chưa có nội dung thi đấu</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Manual Tab */}
                  <TabsContent value="manual" className="mt-4">
                    <ManualEntryRegistration
                      selectedTeamId={selectedTeamId}
                      selectedTournament={selectedTournament}
                      onSuccess={() => {
                        refetchTournament();
                        showToast.success(
                          "Thành công",
                          "Đã đăng ký nội dung thi đấu",
                        );
                      }}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </Card>
          )}
        </>
      )}

      {/* Import Dialogs */}
      {selectedTournamentId && (
        <TeamImportDialog
          open={teamImportOpen}
          onOpenChange={setTeamImportOpen}
          tournamentId={selectedTournamentId}
          onImportSuccess={handleTeamImportSuccess}
        />
      )}

      {selectedContent && selectedTournamentId && (
        <EntryImportDialog
          open={entryDialogOpen}
          onOpenChange={setEntryDialogOpen}
          contentId={selectedContent.id || 0}
          contentType={selectedContent.type}
          onImportSuccess={handleEntryImportSuccess}
        />
      )}
    </div>
  );
}
