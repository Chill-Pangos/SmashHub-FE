import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    id: string;
    match: string;
    category: string;
    originalScore: string;
    requestedScore: string;
    reason: string;
    requestedBy: string;
    delegation: string;
  } | null;
}

export default function ApprovalDialog({
  open,
  onOpenChange,
  request,
}: ApprovalDialogProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xét duyệt yêu cầu chỉnh sửa kết quả</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">{request.match}</h3>
              <p className="text-sm text-muted-foreground">
                {request.category}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Điểm hiện tại
                </Label>
                <p className="font-semibold mt-1">{request.originalScore}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Điểm đề xuất
                </Label>
                <p className="font-semibold text-primary mt-1">
                  {request.requestedScore}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">
                Lý do yêu cầu
              </Label>
              <p className="mt-1">{request.reason}</p>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Người yêu cầu:{" "}
                <span className="font-medium">{request.requestedBy}</span> (
                {request.delegation})
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Quyết định</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDecision("approve")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  decision === "approve"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <CheckCircle
                  className={`h-8 w-8 mx-auto mb-2 ${
                    decision === "approve" ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <p className="font-semibold text-center">Chấp nhận</p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  Cập nhật kết quả theo đề xuất
                </p>
              </button>

              <button
                onClick={() => setDecision("reject")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  decision === "reject"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <XCircle
                  className={`h-8 w-8 mx-auto mb-2 ${
                    decision === "reject" ? "text-red-600" : "text-gray-400"
                  }`}
                />
                <p className="font-semibold text-center">Từ chối</p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  Giữ nguyên kết quả hiện tại
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú (tuỳ chọn)</Label>
            <textarea
              placeholder="Nhập ghi chú về quyết định..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {decision === "approve" && (
            <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-1">Cảnh báo!</p>
                <p>
                  Thao tác này sẽ cập nhật kết quả chính thức và không thể hoàn
                  tác. Vui lòng kiểm tra kỹ trước khi xác nhận.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            disabled={!decision}
            variant={decision === "reject" ? "destructive" : "default"}
          >
            {decision === "approve"
              ? "Xác nhận duyệt"
              : decision === "reject"
              ? "Xác nhận từ chối"
              : "Chọn quyết định"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
