import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
  Clock,
  Globe,
  FileText,
} from "lucide-react";

interface LogDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logId: number | null;
}

interface DetailedLog {
  id: number;
  timestamp: string;
  user: string;
  userId: number | null;
  action: string;
  description: string;
  level: string;
  ipAddress: string;
  userAgent: string;
  method: string;
  endpoint: string;
  requestBody?: Record<string, unknown>;
  responseStatus: number;
  duration: string;
  errorMessage?: string;
  errorStack?: string;
}

// Mock detailed log data
const mockDetailedLog: Record<number, DetailedLog> = {
  1: {
    id: 1,
    timestamp: "10/01/2024 09:45:23",
    user: "Nguyễn Văn A",
    userId: 1,
    action: "Tạo giải đấu",
    description: "Tạo giải đấu 'Cúp Vô Địch Quốc Gia 2024'",
    level: "success",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    method: "POST",
    endpoint: "/api/tournaments",
    requestBody: {
      name: "Cúp Vô Địch Quốc Gia 2024",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      location: "Hà Nội",
    },
    responseStatus: 201,
    duration: "142ms",
  },
  3: {
    id: 3,
    timestamp: "10/01/2024 09:15:42",
    user: "System",
    userId: null,
    action: "Đồng bộ dữ liệu",
    description: "Lỗi đồng bộ dữ liệu với cơ sở dữ liệu phụ",
    level: "error",
    ipAddress: "127.0.0.1",
    userAgent: "System Process",
    method: "SYNC",
    endpoint: "/internal/sync",
    errorMessage: "Connection timeout to replica database",
    errorStack: "DatabaseConnectionError: timeout exceeded\n  at connect...",
    responseStatus: 500,
    duration: "30000ms",
  },
};

const getLevelIcon = (level: string) => {
  switch (level) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
  }
};

const getLevelBadge = (level: string) => {
  const variants: Record<string, string> = {
    success: "bg-green-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };
  const labels: Record<string, string> = {
    success: "Thành công",
    info: "Thông tin",
    warning: "Cảnh báo",
    error: "Lỗi",
  };
  return <Badge className={variants[level]}>{labels[level]}</Badge>;
};

export default function LogDetailDialog({
  open,
  onOpenChange,
  logId,
}: LogDetailDialogProps) {
  if (!logId || !mockDetailedLog[logId]) {
    return null;
  }

  const log = mockDetailedLog[logId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getLevelIcon(log.level)}
            Chi tiết nhật ký #{log.id}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hoạt động trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Thời gian</span>
                </div>
                <p className="font-medium">{log.timestamp}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Người dùng</span>
                </div>
                <p className="font-medium">
                  {log.user} {log.userId && `(ID: ${log.userId})`}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>IP Address</span>
                </div>
                <p className="font-mono text-sm">{log.ipAddress}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Mức độ</span>
                </div>
                <div>{getLevelBadge(log.level)}</div>
              </div>
            </div>
          </Card>

          {/* Action Details */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Chi tiết hành động</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">
                  Hành động:
                </span>
                <p className="font-medium">{log.action}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Mô tả:</span>
                <p>{log.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Method:</span>
                  <Badge variant="outline" className="ml-2">
                    {log.method}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className={`ml-2 ${
                      log.responseStatus < 400
                        ? "border-green-500 text-green-500"
                        : "border-red-500 text-red-500"
                    }`}
                  >
                    {log.responseStatus}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Endpoint:</span>
                <p className="font-mono text-sm mt-1">{log.endpoint}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Thời gian xử lý:
                </span>
                <p className="font-mono text-sm">{log.duration}</p>
              </div>
            </div>
          </Card>

          {/* Request Body */}
          {log.requestBody && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Request Body</h3>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                {JSON.stringify(log.requestBody, null, 2)}
              </pre>
            </Card>
          )}

          {/* Error Details */}
          {log.errorMessage && (
            <Card className="p-4 border-red-500">
              <h3 className="font-semibold mb-2 text-red-500">Chi tiết lỗi</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Thông báo:
                  </span>
                  <p className="text-red-600 font-medium mt-1">
                    {log.errorMessage}
                  </p>
                </div>
                {log.errorStack && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Stack trace:
                    </span>
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-1">
                      {log.errorStack}
                    </pre>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* User Agent */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">User Agent</h3>
            <p className="text-sm font-mono text-muted-foreground break-all">
              {log.userAgent}
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
