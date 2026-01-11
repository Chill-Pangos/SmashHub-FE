import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, AlertCircle } from "lucide-react";

interface Complaint {
  id: number;
  code: string;
  matchCode: string;
  complainant: string;
  delegation: string;
  type: string;
  status: "new" | "processing" | "resolved" | "rejected";
  priority: "high" | "medium" | "low";
  createdAt: string;
  assignedTo: string;
}

const mockComplaints: Complaint[] = [
  {
    id: 1,
    code: "KN-2024-001",
    matchCode: "M-2024-001",
    complainant: "Nguyễn Văn A",
    delegation: "Đoàn Hà Nội",
    type: "Điểm số",
    status: "new",
    priority: "high",
    createdAt: "10:30 11/01/2026",
    assignedTo: "Chưa phân công",
  },
  {
    id: 2,
    code: "KN-2024-002",
    matchCode: "M-2024-003",
    complainant: "Trần Thị B",
    delegation: "Đoàn TP.HCM",
    type: "Vi phạm luật",
    status: "processing",
    priority: "medium",
    createdAt: "09:15 11/01/2026",
    assignedTo: "Phạm Minh Tuấn",
  },
  {
    id: 3,
    code: "KN-2024-003",
    matchCode: "M-2024-007",
    complainant: "Lê Văn C",
    delegation: "Đoàn Đà Nẵng",
    type: "Thiết bị",
    status: "processing",
    priority: "low",
    createdAt: "08:45 11/01/2026",
    assignedTo: "Nguyễn Thị Mai",
  },
  {
    id: 4,
    code: "KN-2024-004",
    matchCode: "M-2024-012",
    complainant: "Phạm Thị D",
    delegation: "Đoàn Hải Phòng",
    type: "Điểm số",
    status: "resolved",
    priority: "medium",
    createdAt: "07:20 11/01/2026",
    assignedTo: "Trần Văn Hùng",
  },
  {
    id: 5,
    code: "KN-2024-005",
    matchCode: "M-2024-015",
    complainant: "Hoàng Văn E",
    delegation: "Đoàn Cần Thơ",
    type: "Hành vi vận động viên",
    status: "rejected",
    priority: "low",
    createdAt: "06:50 11/01/2026",
    assignedTo: "Phạm Minh Tuấn",
  },
  {
    id: 6,
    code: "KN-2024-006",
    matchCode: "M-2024-018",
    complainant: "Vũ Thị F",
    delegation: "Đoàn Hà Nội",
    type: "Vi phạm luật",
    status: "new",
    priority: "high",
    createdAt: "10:15 11/01/2026",
    assignedTo: "Chưa phân công",
  },
];

const getStatusLabel = (status: Complaint["status"]) => {
  const labels = {
    new: "Mới",
    processing: "Đang xử lý",
    resolved: "Đã giải quyết",
    rejected: "Từ chối",
  };
  return labels[status];
};

const getStatusColor = (status: Complaint["status"]) => {
  const colors = {
    new: "bg-orange-100 text-orange-800",
    processing: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status];
};

const getPriorityLabel = (priority: Complaint["priority"]) => {
  const labels = {
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
  };
  return labels[priority];
};

const getPriorityColor = (priority: Complaint["priority"]) => {
  const colors = {
    high: "text-red-600",
    medium: "text-orange-600",
    low: "text-gray-600",
  };
  return colors[priority];
};

interface ComplaintTableProps {
  searchQuery: string;
  onViewDetail: (id: number) => void;
}

export default function ComplaintTable({ searchQuery, onViewDetail }: ComplaintTableProps) {
  const filteredComplaints = mockComplaints.filter(
    (complaint) =>
      complaint.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.matchCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complainant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.delegation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã KN</TableHead>
          <TableHead>Trận đấu</TableHead>
          <TableHead>Người khiếu nại</TableHead>
          <TableHead>Đoàn</TableHead>
          <TableHead>Loại KN</TableHead>
          <TableHead>Ưu tiên</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Người xử lý</TableHead>
          <TableHead>Thời gian</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell className="font-medium">{complaint.code}</TableCell>
              <TableCell>{complaint.matchCode}</TableCell>
              <TableCell>{complaint.complainant}</TableCell>
              <TableCell>{complaint.delegation}</TableCell>
              <TableCell>{complaint.type}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <AlertCircle className={`h-4 w-4 ${getPriorityColor(complaint.priority)}`} />
                  <span className={`text-sm ${getPriorityColor(complaint.priority)}`}>
                    {getPriorityLabel(complaint.priority)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(complaint.status)}>
                  {getStatusLabel(complaint.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{complaint.assignedTo}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {complaint.createdAt}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail(complaint.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center text-muted-foreground">
              Không tìm thấy khiếu nại nào
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
