import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  Users,
  Trophy,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import TeamImportDialog from "@/components/custom/TeamImportDialog";
import EntryImportDialog from "@/components/custom/EntryImportDialog";
import { tournamentService } from "@/services";
import type { Tournament } from "@/types";
import { showToast } from "@/utils";

export default function DelegationManagement() {
  const [activeStep, setActiveStep] = useState<"teams" | "entries">("teams");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [teamImportOpen, setTeamImportOpen] = useState(false);
  const [entryImportOpen, setEntryImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load tournaments on mount
  useEffect(() => {
    loadTournaments();
  }, []);

  // Load tournament details when selected
  useEffect(() => {
    if (selectedTournamentId) {
      loadTournamentDetails(selectedTournamentId);
    } else {
      setSelectedTournament(null);
    }
  }, [selectedTournamentId]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getAllTournaments(0, 100);
      setTournaments(data);
    } catch (error) {
      showToast.error("Không thể tải danh sách giải đấu");
      console.error("Error loading tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTournamentDetails = async (tournamentId: number) => {
    try {
      setLoading(true);
      const data = await tournamentService.getTournamentById(tournamentId);
      setSelectedTournament(data);
    } catch (error) {
      showToast.error("Không thể tải thông tin giải đấu");
      console.error("Error loading tournament details:", error);
    } finally {
      setLoading(false);
    }
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
    const variants = {
      single: { variant: "default" as const, label: "Đơn" },
      double: { variant: "secondary" as const, label: "Đôi" },
      team: { variant: "outline" as const, label: "Đội" },
    };
    const config = variants[type as keyof typeof variants] || variants.single;
    return (
      <Badge variant={config.variant} className="ml-2">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Đăng ký tham gia giải đấu</h1>
        <p className="text-muted-foreground mt-1">
          Đăng ký danh sách đội và nội dung thi đấu cho đoàn thể thao
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
              disabled={loading}
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
                <div>📍 Địa điểm: {selectedTournament.location}</div>
                <div>
                  📅 Thời gian:{" "}
                  {new Date(selectedTournament.startDate).toLocaleDateString(
                    "vi-VN",
                  )}
                  {selectedTournament.endDate &&
                    ` - ${new Date(selectedTournament.endDate).toLocaleDateString("vi-VN")}`}
                </div>
                <div>
                  🏆 Số nội dung thi đấu:{" "}
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
              variant={activeStep === "teams" ? "default" : "outline"}
              onClick={() => setActiveStep("teams")}
              className="flex-1"
            >
              <Users className="mr-2 h-4 w-4" />
              Bước 1: Đăng ký danh sách đội
            </Button>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <Button
              variant={activeStep === "entries" ? "default" : "outline"}
              onClick={() => setActiveStep("entries")}
              className="flex-1"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Bước 2: Đăng ký nội dung thi đấu
            </Button>
          </div>

          {/* Step 1: Team Registration */}
          {activeStep === "teams" && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Đăng ký danh sách đội
                </h3>
                <p className="text-sm text-muted-foreground">
                  Import file Excel chứa danh sách các đội và thành viên tham
                  gia giải đấu
                </p>
              </div>

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
                  Import danh sách đội
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
                        Điền thông tin các đội và thành viên theo định dạng
                      </li>
                      <li>
                        Mỗi đội cần có ít nhất 1 trưởng đoàn (team_manager)
                      </li>
                      <li>Các vai trò: team_manager, coach, athlete</li>
                      <li>
                        Upload file và kiểm tra preview trước khi xác nhận
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
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
                  Chọn nội dung thi đấu và import danh sách vận động viên đăng
                  ký
                </p>
              </div>

              {selectedTournament?.contents &&
              selectedTournament.contents.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Chọn nội dung thi đấu
                    </label>
                    <Select
                      value={selectedContentId?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedContentId(value ? Number(value) : null)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Chọn nội dung thi đấu --" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTournament.contents.map((content) => (
                          <SelectItem
                            key={content.id}
                            value={content.id!.toString()}
                          >
                            <div className="flex items-center">
                              {content.name}
                              {getContentTypeBadge(content.type)}
                              <span className="ml-2 text-xs text-muted-foreground">
                                (Max: {content.maxEntries} entries)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedContentId && (
                    <>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const content = selectedTournament.contents?.find(
                              (c) => c.id === selectedContentId,
                            );
                            if (content) {
                              handleDownloadEntryTemplate(content.type);
                            }
                          }}
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Tải file mẫu đăng ký
                        </Button>
                        <Button
                          onClick={() => setEntryImportOpen(true)}
                          className="flex-1"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Import danh sách đăng ký
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
                              <li>
                                Tải file mẫu tương ứng với loại nội dung (Đơn,
                                Đôi, Đội)
                              </li>
                              <li>
                                Điền thông tin vận động viên theo định dạng
                              </li>
                              <li>
                                Đảm bảo email khớp với thành viên đã đăng ký ở
                                bước 1
                              </li>
                              <li>
                                Upload file và kiểm tra preview trước khi xác
                                nhận
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Giải đấu này chưa có nội dung thi đấu</p>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Import Dialogs */}
      {selectedTournamentId && (
        <>
          <TeamImportDialog
            open={teamImportOpen}
            onOpenChange={setTeamImportOpen}
            tournamentId={selectedTournamentId}
            onImportSuccess={() => {
              showToast.success("Import danh sách đội thành công!");
              setActiveStep("entries");
            }}
          />

          {selectedContentId && (
            <EntryImportDialog
              open={entryImportOpen}
              onOpenChange={setEntryImportOpen}
              contentId={selectedContentId}
              contentType={
                selectedTournament?.contents?.find(
                  (c) => c.id === selectedContentId,
                )?.type || "single"
              }
              onImportSuccess={() => {
                showToast.success("Import danh sách đăng ký thành công!");
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
