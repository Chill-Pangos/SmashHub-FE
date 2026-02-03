import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface CorrectionRequest {
  id: string;
  matchId: string;
  match: string;
  category: string;
  requestedBy: string;
  delegation: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  originalScore: string;
  requestedScore: string;
}

const mockRequests: CorrectionRequest[] = [
  {
    id: "1",
    matchId: "M123",
    match: "Nguyễn Tiến Minh vs Nguyễn Hải Đăng",
    category: "Nam đơn - Vòng 2",
    requestedBy: "Nguyễn Văn A",
    delegation: "Đoàn Hà Nội",
    submittedAt: "2024-12-15 14:30",
    status: "pending",
    reason: "Điểm set 2 bị ghi sai, thực tế là 21-19 chứ không phải 21-17",
    originalScore: "21-15, 21-17",
    requestedScore: "21-15, 21-19",
  },
  {
    id: "2",
    matchId: "M124",
    match: "Vũ Thị Trang vs Nguyễn Thùy Linh",
    category: "Nữ đơn - Vòng 1",
    requestedBy: "Trần Thị B",
    delegation: "Đoàn TP.HCM",
    submittedAt: "2024-12-15 10:15",
    status: "pending",
    reason: "Thiếu set 3, trận đấu đã diễn ra đủ 3 set",
    originalScore: "21-18, 18-21",
    requestedScore: "21-18, 18-21, 21-16",
  },
  {
    id: "3",
    matchId: "M125",
    match: "Lê Hoàng Nam vs Phạm Cao Cường",
    category: "Nam đơn - Bán kết",
    requestedBy: "Lê Văn C",
    delegation: "Đoàn Đà Nẵng",
    submittedAt: "2024-12-14 16:45",
    status: "approved",
    reason: "Lỗi nhập liệu từ phía tổ chức",
    originalScore: "21-10, 19-21, 21-18",
    requestedScore: "21-10, 21-19, 21-18",
  },
  {
    id: "4",
    matchId: "M126",
    match: "Đỗ Tuấn Đức/Phạm Hồng Nam vs Trần Văn A/Lê Văn B",
    category: "Nam đôi - Vòng 2",
    requestedBy: "Phạm Thị D",
    delegation: "Đoàn Hải Phòng",
    submittedAt: "2024-12-14 09:20",
    status: "rejected",
    reason: "Yêu cầu thay đổi kết quả sau khi đã công bố chính thức",
    originalScore: "21-15, 21-17",
    requestedScore: "21-15, 19-21, 21-17",
  },
];

export default function CorrectionRequestList() {
  const { t } = useTranslation();

  const getStatusColor = (status: CorrectionRequest["status"]) => {
    const colors = {
      pending: "bg-orange-100 text-orange-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status];
  };

  const getStatusLabel = (status: CorrectionRequest["status"]) => {
    const labels = {
      pending: t("tournamentManager.resultCorrection.pendingApproval"),
      approved: t("tournamentManager.resultCorrection.approved"),
      rejected: t("tournamentManager.resultCorrection.rejected"),
    };
    return labels[status];
  };

  return (
    <div className="space-y-4">
      {mockRequests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{request.matchId}</Badge>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusLabel(request.status)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    {request.match}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {request.category}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("tournamentManager.resultCorrection.currentScore")}:
                    </p>
                    <p className="font-semibold">{request.originalScore}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("tournamentManager.resultCorrection.proposedScore")}:
                    </p>
                    <p className="font-semibold text-primary">
                      {request.requestedScore}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("tournamentManager.resultCorrection.reasonForRequest")}:
                  </p>
                  <p className="text-sm">{request.reason}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{request.submittedAt}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {request.requestedBy} ({request.delegation})
                    </span>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {t("tournamentManager.resultCorrection.reject")}
                      </Button>
                      <Button size="sm">
                        {t("tournamentManager.resultCorrection.approve")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
