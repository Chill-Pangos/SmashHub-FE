import React, { useState } from "react";
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

  const pendingMatches = Array.isArray(pendingMatchesResponse)
    ? pendingMatchesResponse
    : pendingMatchesResponse?.data || [];

  // Fetch ELO preview for selected match
  const { data: eloPreviewData, isLoading: isLoadingElo } =
    usePendingMatchWithElo(selectedMatchId ?? 0, {
      enabled: selectedMatchId !== null && eloDialogOpen,
    });

  // Build selected match with ELO data
  const selectedMatch: PendingMatchWithElo | null =
    selectedMatchId && eloPreviewData
      ? {
          match:
            eloPreviewData.match ||
            pendingMatches.find((m: Match) => m.id === selectedMatchId),
          eloPreview: eloPreviewData.eloPreview,
        }
      : selectedMatchId
        ? {
            match: pendingMatches.find((m: Match) => m.id === selectedMatchId),
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
              <div className="space-y-3">
                {pendingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">#{match.id}</Badge>
                        <span className="font-medium">
                          {match.entryA?.team?.name ||
                            `Entry ${match.entryAId}`}{" "}
                          vs{" "}
                          {match.entryB?.team?.name ||
                            `Entry ${match.entryBId}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Set: {match.setsWonA || 0} - {match.setsWonB || 0}
                        </span>
                        {match.winnerEntryId && (
                          <Badge className="bg-green-100 text-green-700">
                            Thắng:{" "}
                            {match.winnerEntryId === match.entryAId ? "A" : "B"}
                          </Badge>
                        )}
                        <Badge variant="secondary">{match.resultStatus}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
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
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-center">
                  {selectedMatch.match.entryA?.team?.name ||
                    `Entry ${selectedMatch.match.entryAId}`}{" "}
                  <span className="text-lg font-bold">
                    {selectedMatch.match.setsWonA} -{" "}
                    {selectedMatch.match.setsWonB}
                  </span>{" "}
                  {selectedMatch.match.entryB?.team?.name ||
                    `Entry ${selectedMatch.match.entryBId}`}
                </p>
              </div>

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
                  Không thể tải dự đoán ELO cho trận đấu này
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
