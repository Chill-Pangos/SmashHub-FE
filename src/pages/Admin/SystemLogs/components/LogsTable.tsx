import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Log {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  level: "info" | "warning" | "error" | "success";
  ipAddress: string;
}

const mockLogs: Log[] = [
  {
    id: 1,
    timestamp: "10/01/2024 09:45:23",
    user: "Nguyễn Văn A",
    action: "Tạo giải đấu",
    description: "Tạo giải đấu 'Cúp Vô Địch Quốc Gia 2024'",
    level: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "10/01/2024 09:30:15",
    user: "Trần Thị B",
    action: "Cập nhật người dùng",
    description: "Cập nhật thông tin người dùng ID: 45",
    level: "info",
    ipAddress: "192.168.1.102",
  },
  {
    id: 3,
    timestamp: "10/01/2024 09:15:42",
    user: "System",
    action: "Đồng bộ dữ liệu",
    description: "Lỗi đồng bộ dữ liệu với cơ sở dữ liệu phụ",
    level: "error",
    ipAddress: "127.0.0.1",
  },
  {
    id: 4,
    timestamp: "10/01/2024 09:00:10",
    user: "Lê Văn C",
    action: "Đăng nhập",
    description: "Đăng nhập thành công",
    level: "success",
    ipAddress: "192.168.1.105",
  },
  {
    id: 5,
    timestamp: "10/01/2024 08:45:30",
    user: "Phạm Thị D",
    action: "Đăng nhập",
    description: "Thử đăng nhập với mật khẩu sai (lần 3)",
    level: "warning",
    ipAddress: "192.168.1.110",
  },
  {
    id: 6,
    timestamp: "10/01/2024 08:30:55",
    user: "Hoàng Văn E",
    action: "Xóa VĐV",
    description: "Xóa vận động viên khỏi giải đấu",
    level: "warning",
    ipAddress: "192.168.1.108",
  },
  {
    id: 7,
    timestamp: "10/01/2024 08:15:20",
    user: "Vũ Thị F",
    action: "Cập nhật kết quả",
    description: "Cập nhật kết quả trận đấu #M1234",
    level: "success",
    ipAddress: "192.168.1.112",
  },
  {
    id: 8,
    timestamp: "10/01/2024 08:00:05",
    user: "System",
    action: "Backup dữ liệu",
    description: "Backup dữ liệu tự động hoàn tất",
    level: "info",
    ipAddress: "127.0.0.1",
  },
  {
    id: 9,
    timestamp: "10/01/2024 07:45:18",
    user: "Đặng Văn G",
    action: "Phân quyền",
    description: "Thay đổi quyền của người dùng ID: 32",
    level: "warning",
    ipAddress: "192.168.1.115",
  },
  {
    id: 10,
    timestamp: "10/01/2024 07:30:40",
    user: "Bùi Thị H",
    action: "Đăng ký thi đấu",
    description: "Đăng ký 5 VĐV vào giải đấu",
    level: "success",
    ipAddress: "192.168.1.118",
  },
];

const getLevelIcon = (level: Log["level"]) => {
  switch (level) {
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "error":
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getLevelBadge = (level: Log["level"]) => {
  switch (level) {
    case "success":
      return (
        <Badge className="bg-green-500">
          {getLevelIcon(level)}
          <span className="ml-1">Thành công</span>
        </Badge>
      );
    case "info":
      return (
        <Badge className="bg-blue-500">
          {getLevelIcon(level)}
          <span className="ml-1">Thông tin</span>
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-yellow-500">
          {getLevelIcon(level)}
          <span className="ml-1">Cảnh báo</span>
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive">
          {getLevelIcon(level)}
          <span className="ml-1">Lỗi</span>
        </Badge>
      );
  }
};

interface LogsTableProps {
  searchQuery: string;
  filters: {
    level?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  onViewDetail: (logId: number) => void;
}

export default function LogsTable({
  searchQuery,
  filters,
  onViewDetail,
}: LogsTableProps) {
  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      !filters.level || filters.level === "all" || log.level === filters.level;

    return matchesSearch && matchesLevel;
  });

  const getInitials = (name: string) => {
    if (name === "System") return "SYS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thời gian</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead>Hành động</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Mức độ</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="text-right">Chi tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                Không tìm thấy nhật ký nào
              </TableCell>
            </TableRow>
          ) : (
            filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(log.user)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{log.user}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {log.description}
                </TableCell>
                <TableCell>{getLevelBadge(log.level)}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {log.ipAddress}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetail(log.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { Log };
