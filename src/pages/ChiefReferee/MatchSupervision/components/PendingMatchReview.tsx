import React, { useState } from "react";
import { useMemo } from "react";
import type { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Check,
  X,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Clock,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { showToast } from "@/utils/toast.utils";
import {
  usePendingMatches,
  usePendingMatchWithElo,
  useApproveMatch,
  useRejectMatch,
} from "@/hooks/queries";
import type { Match, EloPreview, EloChange } from "@/types";

interface PendingMatchWithElo {
  match: Match;
  eloPreview?: EloPreview;
}

export default function PendingMatchReview() {
  // Selected match for ELO preview
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [eloDialogOpen, setEloDialogOpen] = useState(false);

  // Approve/Reject dialogs
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [matchToAction, setMatchToAction] = useState<Match | null>(null);

  // Fetch pending matches using React Query
  const {
    data: pendingMatchesResponse,
    isLoading,
    refetch: refetchPendingMatches,
  } = usePendingMatches(0, 50);

  const pendingMatches = useMemo(
    () => pendingMatchesResponse?.matches || [],
    [pendingMatchesResponse?.matches],
  );

  // Debug: Log API response to check data structure
  React.useEffect(() => {
    if (pendingMatchesResponse) {
      console.log("[PendingMatchReview] API Response:", pendingMatchesResponse);
      console.log("[PendingMatchReview] Pending matches:", pendingMatches);
      console.log("[PendingMatchReview] Count:", pendingMatchesResponse.count);

      // Check resultStatus for each match
      pendingMatches.forEach((match: Match) => {
        console.log(
          `[Match ${match.id}] status: ${match.status}, resultStatus: ${match.resultStatus}`,
        );
      });
    }
  }, [pendingMatchesResponse, pendingMatches]);

  // Fetch ELO preview for selected match
  const {
    data: eloPreviewData,
    isLoading: isLoadingElo,
    error: eloError,
  } = usePendingMatchWithElo(selectedMatchId ?? 0, {
    enabled: selectedMatchId !== null && eloDialogOpen,
  });

  // Debug ELO fetch
  React.useEffect(() => {
    if (selectedMatchId && eloDialogOpen) {
      console.log(
        "[PendingMatchReview] Fetching ELO for match ID:",
        selectedMatchId,
      );
      console.log("[PendingMatchReview] isLoadingElo:", isLoadingElo);
      if (eloError) {
        console.error("[PendingMatchReview] ELO fetch error:", eloError);
      }
      if (eloPreviewData) {
        console.log("[PendingMatchReview] ELO data received:", eloPreviewData);
      }
    }
  }, [selectedMatchId, eloDialogOpen, isLoadingElo, eloError, eloPreviewData]);

  // Build selected match with ELO data
  const selectedMatch: PendingMatchWithElo | null =
    selectedMatchId && eloPreviewData
      ? {
          match:
            eloPreviewData.match ||
            pendingMatches.find((m: Match) => m.id === selectedMatchId)!,
          eloPreview: eloPreviewData.eloPreview,
        }
      : selectedMatchId
        ? {
            match: pendingMatches.find((m: Match) => m.id === selectedMatchId)!,
            eloPreview: undefined,
          }
        : null;

  // Mutations
  const approveMatchMutation = useApproveMatch();
  const rejectMatchMutation = useRejectMatch();

  const isActionLoading =
    approveMatchMutation.isPending || rejectMatchMutation.isPending;

  const handleViewEloPreview = (match: Match) => {
    setSelectedMatchId(match.id);
    setEloDialogOpen(true);
  };

  const handleApproveClick = (match: Match) => {
    setMatchToAction(match);
    setReviewNotes("");
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (match: Match) => {
    setMatchToAction(match);
    setReviewNotes("");
    setRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!matchToAction) return;

    approveMatchMutation.mutate(
      {
        id: matchToAction.id,
        data: reviewNotes ? { reviewNotes } : undefined,
      },
      {
        onSuccess: () => {
          showToast.success("Thành công", "Đã phê duyệt kết quả trận đấu");
          setApproveDialogOpen(false);
          setEloDialogOpen(false);
          setSelectedMatchId(null);
        },
        onError: (error) => {
          console.error("Error approving match:", error);
          showToast.error("Lỗi", "Không thể phê duyệt trận đấu");
        },
      },
    );
  };

  const handleConfirmReject = async () => {
    if (!matchToAction) return;

    if (!reviewNotes.trim()) {
      showToast.error("Lỗi", "Vui lòng nhập lý do từ chối");
      return;
    }

    rejectMatchMutation.mutate(
      {
        id: matchToAction.id,
        data: { reviewNotes },
      },
      {
        onSuccess: () => {
          showToast.success("Thành công", "Đã từ chối kết quả trận đấu");
          setRejectDialogOpen(false);
          setEloDialogOpen(false);
          setSelectedMatchId(null);
        },
        onError: (error) => {
          console.error("Error rejecting match:", error);
          showToast.error("Lỗi", "Không thể từ chối trận đấu");
        },
      },
    );
  };

  const renderEloChange = (change: EloChange) => {
    const isPositive = change.change > 0;
    const isNegative = change.change < 0;

    return (
      <div
        key={change.userId}
        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
      >
        <div>
          <p className="font-medium">
            {change.username || `User ${change.userId}`}
          </p>
          <p className="text-sm text-muted-foreground">
            ELO hiện tại: {change.currentElo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
          {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
          {!isPositive && !isNegative && (
            <Minus className="h-4 w-4 text-gray-400" />
          )}
          <span
            className={`font-bold ${
              isPositive
                ? "text-green-600"
                : isNegative
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.change}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">{change.expectedElo}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Duyệt kết quả trận đấu</h2>
          <p className="text-sm text-muted-foreground">
            Xem xét và phê duyệt kết quả các trận đấu đã hoàn thành
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetchPendingMatches()}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              <p className="text-2xl font-bold">{pendingMatches.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã duyệt hôm nay</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Từ chối hôm nay</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending matches list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Trận đấu chờ duyệt
          </CardTitle>
          <CardDescription>
            Click vào "Xem ELO" để xem dự đoán thay đổi điểm ELO trước khi phê
            duyệt
           
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : pendingMatches.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không có trận đấu nào đang chờ duyệt</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {pendingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 space-y-3"
                  >
                    {/* Header - Match ID and Tournament Content */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{match.id}</Badge>
                        {match.schedule?.tournamentContent && (
                          <Badge variant="secondary">
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
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Chờ duyệt
                      </Badge>
                    </div>

                    {/* Match Details */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Entry A */}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Entry A</p>
                        <p className="font-semibold">
                          {match.entryA?.team?.name ||
                            `Entry ${match.entryAId}`}
                        </p>
                        {match.winnerEntryId === match.entryAId && (
                          <Badge className="bg-green-100 text-green-700">
                            Thắng
                          </Badge>
                        )}
                      </div>

                      {/* Entry B */}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Entry B</p>
                        <p className="font-semibold">
                          {match.entryB?.team?.name ||
                            `Entry ${match.entryBId}`}
                        </p>
                        {match.winnerEntryId === match.entryBId && (
                          <Badge className="bg-green-100 text-green-700">
                            Thắng
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Match Sets Detail */}
                    {match.matchSets && match.matchSets.length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Chi tiết từng set
                        </p>
                        <div className="flex gap-2">
                          {match.matchSets.map((set) => (
                            <div
                              key={set.id}
                              className="flex-1 bg-background rounded px-2 py-1 text-center"
                            >
                              <p className="text-xs text-muted-foreground">
                                Set {set.setNumber}
                              </p>
                              <p className="font-semibold">
                                {set.entryAScore} - {set.entryBScore}
                              </p>
                            </div>
                          ))}
                          <div className="flex-1 bg-primary/10 rounded px-2 py-1 text-center">
                            <p className="text-xs text-muted-foreground">
                              Tổng
                            </p>
                            <p className="font-bold text-primary">
                              {match.setsWonA || 0} - {match.setsWonB || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {/* Schedule Info */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Thông tin lịch
                        </p>
                        {match.schedule?.scheduledAt && (
                          <p className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(
                              match.schedule.scheduledAt,
                            ).toLocaleString("vi-VN")}
                          </p>
                        )}
                        {match.schedule?.tableNumber && (
                          <p>Bàn {match.schedule.tableNumber}</p>
                        )}
                      </div>

                      {/* Referee Info */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Trọng tài
                        </p>
                        {match.umpire && <p>Chính: User #{match.umpire}</p>}
                        {match.assistantUmpire && (
                          <p>Phụ: User #{match.assistantUmpire}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewEloPreview(match)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Xem ELO
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveClick(match)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectClick(match)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* ELO Preview Dialog */}
      <Dialog open={eloDialogOpen} onOpenChange={setEloDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Xem trước thay đổi ELO</DialogTitle>
            <DialogDescription>
              Dự đoán điểm ELO sẽ thay đổi nếu phê duyệt kết quả này
            </DialogDescription>
          </DialogHeader>

          {isLoadingElo ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedMatch ? (
            <div className="space-y-4">
              {/* Match Info */}
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">#{selectedMatch.match.id}</Badge>
                    {selectedMatch.match.schedule?.tournamentContent && (
                      <Badge variant="secondary">
                        {selectedMatch.match.schedule.tournamentContent.name}
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium text-center text-lg">
                    {selectedMatch.match.entryA?.team?.name ||
                      `Entry ${selectedMatch.match.entryAId}`}{" "}
                    <span className="text-xl font-bold text-primary mx-2">
                      {selectedMatch.match.setsWonA} -{" "}
                      {selectedMatch.match.setsWonB}
                    </span>{" "}
                    {selectedMatch.match.entryB?.team?.name ||
                      `Entry ${selectedMatch.match.entryBId}`}
                  </p>
                </div>

                {/* Match Sets Detail */}
                {selectedMatch.match.matchSets &&
                  selectedMatch.match.matchSets.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Chi tiết điểm từng set
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedMatch.match.matchSets.map((set) => (
                          <div
                            key={set.id}
                            className="bg-background rounded p-2 text-center"
                          >
                            <p className="text-xs text-muted-foreground">
                              Set {set.setNumber}
                            </p>
                            <p className="font-semibold">
                              {set.entryAScore} - {set.entryBScore}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Schedule and Referee Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedMatch.match.schedule?.scheduledAt && (
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground">Thời gian</p>
                      <p className="font-medium">
                        {new Date(
                          selectedMatch.match.schedule.scheduledAt,
                        ).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  )}
                  {selectedMatch.match.umpire && (
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground">Trọng tài</p>
                      <p className="font-medium">
                        Chính: #{selectedMatch.match.umpire}
                        {selectedMatch.match.assistantUmpire && (
                          <> | Phụ: #{selectedMatch.match.assistantUmpire}</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {selectedMatch.eloPreview ? (
                <>
                  {/* Entry Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Entry A</p>
                      <p className="font-medium">
                        Avg ELO: {selectedMatch.eloPreview.entryA.averageElo}
                      </p>
                      <p className="text-sm">
                        Expected:{" "}
                        {(
                          selectedMatch.eloPreview.entryA.expectedScore * 100
                        ).toFixed(1)}
                        %
                      </p>
                      <p className="text-sm">
                        Actual:{" "}
                        {(
                          selectedMatch.eloPreview.entryA.actualScore * 100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Entry B</p>
                      <p className="font-medium">
                        Avg ELO: {selectedMatch.eloPreview.entryB.averageElo}
                      </p>
                      <p className="text-sm">
                        Expected:{" "}
                        {(
                          selectedMatch.eloPreview.entryB.expectedScore * 100
                        ).toFixed(1)}
                        %
                      </p>
                      <p className="text-sm">
                        Actual:{" "}
                        {(
                          selectedMatch.eloPreview.entryB.actualScore * 100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* ELO Changes */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Thay đổi ELO của người chơi</h4>
                    {selectedMatch.eloPreview.changes.map(renderEloChange)}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Margin Multiplier:{" "}
                    {selectedMatch.eloPreview.marginMultiplier.toFixed(2)}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500 opacity-50" />
                  <p className="font-medium text-red-600 mb-2">
                    Không thể tải dự đoán ELO
                  </p>
                  {eloError && (
                    <div className="text-xs bg-red-50 border border-red-200 rounded p-3 mt-2">
                      <p className="font-medium mb-1">Chi tiết lỗi:</p>
                      <p className="text-left">
                        {(eloError as AxiosError<{ message?: string }>)
                          ?.response?.data?.message ||
                          eloError.message ||
                          "Vui lòng kiểm tra xem trận đấu có đang ở trạng thái chờ duyệt không"}
                      </p>
                      {(eloError as AxiosError)?.response?.status && (
                        <p className="text-left mt-1">
                          Mã lỗi: {(eloError as AxiosError)?.response?.status}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEloDialogOpen(false)}>
              Đóng
            </Button>
            {selectedMatch && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setMatchToAction(selectedMatch.match);
                    setReviewNotes("");
                    setRejectDialogOpen(true);
                  }}
                >
                  <X className="mr-1 h-4 w-4" />
                  Từ chối
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setMatchToAction(selectedMatch.match);
                    setReviewNotes("");
                    setApproveDialogOpen(true);
                  }}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Phê duyệt
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phê duyệt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn phê duyệt kết quả trận đấu này? Điểm ELO sẽ được
              cập nhật cho tất cả người chơi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Ghi chú (tùy chọn)..."
              value={reviewNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReviewNotes(e.target.value)
              }
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              disabled={isActionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isActionLoading ? "Đang xử lý..." : "Phê duyệt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn từ chối kết quả trận đấu này? Trận đấu sẽ được
              đặt lại trạng thái để trọng tài sửa lại điểm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Lý do từ chối (bắt buộc)..."
              value={reviewNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReviewNotes(e.target.value)
              }
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              disabled={isActionLoading || !reviewNotes.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isActionLoading ? "Đang xử lý..." : "Từ chối"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
