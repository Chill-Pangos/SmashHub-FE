import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText } from "lucide-react";

interface HistoryLog {
  id: string;
  matchId: string;
  match: string;
  action: "submitted" | "approved" | "rejected" | "updated";
  actor: string;
  role: string;
  timestamp: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}

const mockHistory: HistoryLog[] = [
  {
    id: "1",
    matchId: "M125",
    match: "Lê Hoàng Nam vs Phạm Cao Cường",
    action: "approved",
    actor: "Admin Nguyễn Văn X",
    role: "Quản lý giải đấu",
    timestamp: "2024-12-14 17:00",
    details: "Đã duyệt yêu cầu chỉnh sửa điểm - Lỗi nhập liệu",
    oldValue: "21-10, 19-21, 21-18",
    newValue: "21-10, 21-19, 21-18",
  },
  {
    id: "2",
    matchId: "M125",
    match: "Lê Hoàng Nam vs Phạm Cao Cường",
    action: "submitted",
    actor: "Lê Văn C",
    role: "Quản lý đoàn Đà Nẵng",
    timestamp: "2024-12-14 16:45",
    details: "Gửi yêu cầu chỉnh sửa điểm set 2",
    oldValue: "21-10, 19-21, 21-18",
    newValue: "21-10, 21-19, 21-18",
  },
  {
    id: "3",
    matchId: "M126",
    match: "Đỗ Tuấn Đức/Phạm Hồng Nam vs Trần Văn A/Lê Văn B",
    action: "rejected",
    actor: "Tổng trọng tài Trần Thị Y",
    role: "Tổng trọng tài",
    timestamp: "2024-12-14 09:30",
    details: "Từ chối yêu cầu - Kết quả đã được công bố chính thức",
    oldValue: "21-15, 21-17",
    newValue: "21-15, 19-21, 21-17",
  },
  {
    id: "4",
    matchId: "M126",
    match: "Đỗ Tuấn Đức/Phạm Hồng Nam vs Trần Văn A/Lê Văn B",
    action: "submitted",
    actor: "Phạm Thị D",
    role: "Y tế đoàn Hải Phòng",
    timestamp: "2024-12-14 09:20",
    details: "Gửi yêu cầu chỉnh sửa - Thiếu set 3",
    oldValue: "21-15, 21-17",
    newValue: "21-15, 19-21, 21-17",
  },
  {
    id: "5",
    matchId: "M120",
    match: "Nguyễn Tiến Minh vs Phạm Cao Cường",
    action: "updated",
    actor: "Admin Nguyễn Văn X",
    role: "Quản lý giải đấu",
    timestamp: "2024-12-13 15:30",
    details: "Cập nhật kết quả trận đấu",
    oldValue: "-",
    newValue: "21-15, 21-18",
  },
];

const getActionColor = (action: HistoryLog["action"]) => {
  const colors = {
    submitted: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    updated: "bg-purple-100 text-purple-700",
  };
  return colors[action];
};

const getActionLabel = (action: HistoryLog["action"]) => {
  const labels = {
    submitted: "Gửi yêu cầu",
    approved: "Đã duyệt",
    rejected: "Từ chối",
    updated: "Cập nhật",
  };
  return labels[action];
};

const getActionIcon = (action: HistoryLog["action"]) => {
  const icons = {
    submitted: <FileText className="h-4 w-4" />,
    approved: <FileText className="h-4 w-4" />,
    rejected: <FileText className="h-4 w-4" />,
    updated: <FileText className="h-4 w-4" />,
  };
  return icons[action];
};

export default function HistoryLog() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Lịch sử chỉnh sửa</h2>

      <div className="space-y-4">
        {mockHistory.map((log, index) => (
          <div key={log.id} className="relative">
            {index !== mockHistory.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
            )}

            <div className="flex gap-4">
              <div className="relative">
                <div className="p-2 bg-muted rounded-full">
                  {getActionIcon(log.action)}
                </div>
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)}>
                        {getActionLabel(log.action)}
                      </Badge>
                      <Badge variant="outline">{log.matchId}</Badge>
                    </div>
                    <h3 className="font-semibold">{log.match}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                    <Clock className="h-4 w-4" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-sm mb-2">{log.details}</p>

                {log.oldValue && log.newValue && (
                  <div className="flex items-center gap-3 text-sm p-2 bg-muted rounded">
                    <span className="text-muted-foreground line-through">
                      {log.oldValue}
                    </span>
                    <span>→</span>
                    <span className="font-medium text-primary">
                      {log.newValue}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <User className="h-4 w-4" />
                  <span>{log.actor}</span>
                  <span>•</span>
                  <span>{log.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
