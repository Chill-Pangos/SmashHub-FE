import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Play,
  RefreshCw,
  Users,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { useMatchesByStatus, useStartMatch } from "@/hooks/queries";
import { showToast } from "@/utils/toast.utils";
import type { Match } from "@/types";

/**
 * Information about assigned referees after starting a match
 */
interface AssignedRefereeInfo {
  matchId: number;
  entryAId: number;
  entryBId: number;
  umpire: number | null | undefined;
  assistantUmpire: number | null | undefined;
}

export default function ScheduledMatches() {
  const [startingMatchId, setStartingMatchId] = useState<number | null>(null);
  const [assignedRefereeInfo, setAssignedRefereeInfo] =
    useState<AssignedRefereeInfo | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  // Fetch scheduled matches using React Query
  const {
    data: matchesResponse,
    isLoading,
    refetch: refetchMatches,
  } = useMatchesByStatus("scheduled", 0, 50);

  const matches: Match[] = Array.isArray(matchesResponse)
    ? matchesResponse
    : matchesResponse?.data || [];

  // Start match mutation
  const startMatchMutation = useStartMatch();

  /**
   * Start a match - Chief Referee only
   * This changes the match status from "scheduled" to "in_progress"
   * System auto-assigns available referees (umpire + assistant umpire)
   */
  const handleStartMatch = async (matchId: number) => {
    setStartingMatchId(matchId);
    startMatchMutation.mutate(matchId, {
      onSuccess: (response) => {
        const startedMatch = response.data;

        if (!startedMatch) {
          showToast.error("Lỗi", "Không nhận được thông tin trận đấu");
          return;
        }

        // Store assigned referee info for display
        const refereeInfo: AssignedRefereeInfo = {
          matchId: startedMatch.id,
          entryAId: startedMatch.entryAId,
          entryBId: startedMatch.entryBId,
          umpire: startedMatch.umpire,
          assistantUmpire: startedMatch.assistantUmpire,
        };
        setAssignedRefereeInfo(refereeInfo);
        setShowAssignmentDialog(true);

        // Show toast with referee assignment info
        const umpireInfo = startedMatch.umpire
          ? `Trọng tài chính: #${startedMatch.umpire}`
          : "Chưa phân công trọng tài chính";
        const assistantInfo = startedMatch.assistantUmpire
          ? `Trọng tài phụ: #${startedMatch.assistantUmpire}`
          : "Chưa phân công trọng tài phụ";

        showToast.success(
          "Đã bắt đầu trận đấu",
          `${umpireInfo} | ${assistantInfo}`,
        );
        refetchMatches();
      },
      onError: (error) => {
        console.error("Error starting match:", error);
        showToast.error("Lỗi", "Không thể bắt đầu trận đấu");
      },
      onSettled: () => {
        setStartingMatchId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trận đấu chờ bắt đầu</CardTitle>
          <CardDescription>
            Các trận đã lên lịch, chờ Chief Referee bắt đầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Trận đấu chờ bắt đầu
              </CardTitle>
              <CardDescription>
                {matches.length} trận đang chờ bắt đầu
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchMatches()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có trận đấu nào chờ bắt đầu
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">Trận #{match.id}</Badge>
                        <Badge variant="outline">Chờ bắt đầu</Badge>
                        {match.schedule?.tournamentContent && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {match.schedule.tournamentContent.name}
                          </Badge>
                        )}
                        {match.schedule?.stage === "group" &&
                          match.schedule.groupName && (
                            <Badge variant="outline">
                              {match.schedule.groupName}
                            </Badge>
                          )}
                        {match.schedule?.stage === "knockout" &&
                          match.schedule.knockoutRound && (
                            <Badge variant="outline">
                              {match.schedule.knockoutRound}
                            </Badge>
                          )}
                      </div>
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <Users className="h-4 w-4" />
                        <span>
                          {match.entryA?.team?.name ||
                            `Entry ${match.entryAId}`}
                        </span>
                        <span className="text-muted-foreground">vs</span>
                        <span>
                          {match.entryB?.team?.name ||
                            `Entry ${match.entryBId}`}
                        </span>
                      </div>
                      {match.schedule?.scheduledAt && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(
                              match.schedule.scheduledAt,
                            ).toLocaleString("vi-VN")}
                          </div>
                          {match.schedule.tableNumber && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Bàn {match.schedule.tableNumber}
                            </div>
                          )}
                        </div>
                      )}
                      {match.umpire && (
                        <div className="text-sm text-muted-foreground">
                          Trọng tài: User #{match.umpire}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleStartMatch(match.id)}
                      disabled={startingMatchId === match.id}
                    >
                      {startingMatchId === match.id ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Bắt đầu trận
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog hiển thị thông tin trọng tài được phân công */}
      <Dialog
        open={showAssignmentDialog}
        onOpenChange={setShowAssignmentDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Trận đấu đã bắt đầu
            </DialogTitle>
            <DialogDescription>
              Hệ thống đã tự động phân công trọng tài cho trận đấu
            </DialogDescription>
          </DialogHeader>

          {assignedRefereeInfo && (
            <div className="space-y-4">
              {/* Match Info */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Badge variant="default">
                    Trận #{assignedRefereeInfo.matchId}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-4 w-4" />
                  <span>Entry {assignedRefereeInfo.entryAId}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span>Entry {assignedRefereeInfo.entryBId}</span>
                </div>
              </div>

              {/* Referee Assignment */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Phân công trọng tài
                </h4>

                <div className="grid gap-3">
                  {/* Umpire (Main Referee) */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Trọng tài chính</p>
                      <p className="text-xs text-muted-foreground">
                        Điều khiển trận đấu
                      </p>
                    </div>
                    {assignedRefereeInfo.umpire ? (
                      <Badge variant="secondary" className="text-sm">
                        User #{assignedRefereeInfo.umpire}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-sm">
                        Chưa phân công
                      </Badge>
                    )}
                  </div>

                  {/* Assistant Umpire */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Trọng tài phụ</p>
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ và ghi điểm
                      </p>
                    </div>
                    {assignedRefereeInfo.assistantUmpire ? (
                      <Badge variant="secondary" className="text-sm">
                        User #{assignedRefereeInfo.assistantUmpire}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-sm">
                        Chưa phân công
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setShowAssignmentDialog(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
