import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";

interface Complaint {
  id: number;
  matchCode: string;
  complainant: string;
  type: string;
  status: "new" | "processing" | "resolved";
  time: string;
  priority: "high" | "medium" | "low";
}

const mockComplaints: Complaint[] = [
  {
    id: 1,
    matchCode: "M-2024-001",
    complainant: "Đoàn Hà Nội",
    type: "Điểm số",
    status: "new",
    time: "10 phút trước",
    priority: "high",
  },
  {
    id: 2,
    matchCode: "M-2024-003",
    complainant: "Đoàn TP.HCM",
    type: "Vi phạm luật",
    status: "processing",
    time: "25 phút trước",
    priority: "medium",
  },
  {
    id: 3,
    matchCode: "M-2024-007",
    complainant: "Đoàn Đà Nẵng",
    type: "Thiết bị",
    status: "processing",
    time: "1 giờ trước",
    priority: "low",
  },
  {
    id: 4,
    matchCode: "M-2024-012",
    complainant: "Đoàn Hải Phòng",
    type: "Điểm số",
    status: "resolved",
    time: "2 giờ trước",
    priority: "medium",
  },
];

const getStatusLabel = (status: Complaint["status"]) => {
  const labels = {
    new: "Mới",
    processing: "Đang xử lý",
    resolved: "Đã giải quyết",
  };
  return labels[status];
};

const getStatusColor = (status: Complaint["status"]) => {
  const colors = {
    new: "bg-orange-100 text-orange-800",
    processing: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };
  return colors[status];
};

const getPriorityColor = (priority: Complaint["priority"]) => {
  const colors = {
    high: "text-red-500",
    medium: "text-orange-500",
    low: "text-gray-500",
  };
  return colors[priority];
};

export default function RecentComplaints() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Khiếu nại gần đây</h2>
        <Badge variant="outline">{mockComplaints.length} khiếu nại</Badge>
      </div>

      <div className="space-y-4">
        {mockComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-full ${complaint.priority === "high" ? "bg-red-100" : "bg-gray-100"}`}>
              <AlertCircle className={`h-5 w-5 ${getPriorityColor(complaint.priority)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{complaint.matchCode}</h3>
                <Badge className={getStatusColor(complaint.status)}>
                  {getStatusLabel(complaint.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {complaint.complainant} • {complaint.type}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {complaint.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
