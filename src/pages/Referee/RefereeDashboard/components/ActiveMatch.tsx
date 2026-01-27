import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Plus, CheckCircle, Trophy, AlertTriangle } from "lucide-react";
import type { Match, MatchSet } from "@/types";

interface ActiveMatchProps {
  match: Match | null;
  matchSets: MatchSet[];
  entryAName?: string;
  entryBName?: string;
  maxSets?: number;
  onAddScore: (entryAScore: number, entryBScore: number) => Promise<void>;
  onFinalize: () => Promise<void>;
  isAddingScore?: boolean;
  isFinalizing?: boolean;
}

export default function ActiveMatch({
  match,
  matchSets,
  entryAName = "Entry A",
  entryBName = "Entry B",
  maxSets = 3,
  onAddScore,
  onFinalize,
  isAddingScore,
  isFinalizing,
}: ActiveMatchProps) {
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [entryAScore, setEntryAScore] = useState("");
  const [entryBScore, setEntryBScore] = useState("");

  // Calculate sets won
  const setsWonA = matchSets.filter(
    (set) => set.entryAScore > set.entryBScore,
  ).length;
  const setsWonB = matchSets.filter(
    (set) => set.entryBScore > set.entryAScore,
  ).length;

  // Check if match can be finalized (best of 3 or best of 5)
  const setsToWin = Math.ceil(maxSets / 2);
  const canFinalize = setsWonA >= setsToWin || setsWonB >= setsToWin;
  const hasWinner = canFinalize;

  const handleAddScore = async () => {
    const scoreA = parseInt(entryAScore);
    const scoreB = parseInt(entryBScore);

    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      return;
    }

    await onAddScore(scoreA, scoreB);
    setEntryAScore("");
    setEntryBScore("");
    setScoreDialogOpen(false);
  };

  const handleFinalize = async () => {
    await onFinalize();
    setFinalizeDialogOpen(false);
  };

  if (!match) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Trận đấu đang diễn ra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không có trận đấu nào đang diễn ra</p>
            <p className="text-sm">
              Hãy bắt đầu một trận đấu từ danh sách bên dưới
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Trận đấu đang diễn ra
            </div>
            <Badge variant="default" className="animate-pulse">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Score Board */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">{entryAName}</p>
              <p className="text-5xl font-bold text-primary">{setsWonA}</p>
            </div>
            <div className="text-2xl text-muted-foreground">-</div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">{entryBName}</p>
              <p className="text-5xl font-bold text-primary">{setsWonB}</p>
            </div>
          </div>

          {/* Set History */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Chi tiết các set ({matchSets.length}/{maxSets})
            </h4>
            <div className="grid gap-2">
              {matchSets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium">Set {set.setNumber}</span>
                  <div className="flex items-center gap-4">
                    <span
                      className={
                        set.entryAScore > set.entryBScore
                          ? "font-bold text-green-600"
                          : ""
                      }
                    >
                      {set.entryAScore}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span
                      className={
                        set.entryBScore > set.entryAScore
                          ? "font-bold text-green-600"
                          : ""
                      }
                    >
                      {set.entryBScore}
                    </span>
                  </div>
                </div>
              ))}
              {matchSets.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Chưa có set nào được ghi nhận
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => setScoreDialogOpen(true)}
              disabled={hasWinner || isAddingScore}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm điểm set {matchSets.length + 1}
            </Button>
            <Button
              variant={canFinalize ? "default" : "outline"}
              className="flex-1"
              onClick={() => setFinalizeDialogOpen(true)}
              disabled={!canFinalize || isFinalizing}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Kết thúc trận đấu
            </Button>
          </div>

          {hasWinner && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <Trophy className="h-5 w-5" />
              <span>
                <strong>{setsWonA > setsWonB ? entryAName : entryBName}</strong>{" "}
                đã thắng trận đấu!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Score Dialog */}
      <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập điểm Set {matchSets.length + 1}</DialogTitle>
            <DialogDescription>
              Nhập điểm cuối cùng của set này cho mỗi bên
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scoreA">{entryAName}</Label>
              <Input
                id="scoreA"
                type="number"
                min="0"
                value={entryAScore}
                onChange={(e) => setEntryAScore(e.target.value)}
                placeholder="Điểm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scoreB">{entryBName}</Label>
              <Input
                id="scoreB"
                type="number"
                min="0"
                value={entryBScore}
                onChange={(e) => setEntryBScore(e.target.value)}
                placeholder="Điểm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScoreDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddScore} disabled={isAddingScore}>
              {isAddingScore ? "Đang lưu..." : "Lưu điểm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Dialog */}
      <Dialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận kết thúc trận đấu</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn kết thúc trận đấu này? Kết quả sẽ được gửi cho
              Tổng trọng tài phê duyệt.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center gap-8 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="font-medium">{entryAName}</p>
                <p className="text-3xl font-bold">{setsWonA}</p>
              </div>
              <div className="text-xl text-muted-foreground">-</div>
              <div className="text-center">
                <p className="font-medium">{entryBName}</p>
                <p className="text-3xl font-bold">{setsWonB}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span>
                Sau khi kết thúc, bạn không thể chỉnh sửa kết quả. Tổng trọng
                tài sẽ xem xét và phê duyệt.
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinalizeDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleFinalize} disabled={isFinalizing}>
              {isFinalizing ? "Đang xử lý..." : "Xác nhận kết thúc"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
