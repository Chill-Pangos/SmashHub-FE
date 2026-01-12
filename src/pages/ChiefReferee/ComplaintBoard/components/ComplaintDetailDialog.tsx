import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle, Clock, User, FileText } from "lucide-react";
import { useState } from "react";

interface ComplaintDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintId: number | null;
}

export default function ComplaintDetailDialog({
  open,
  onOpenChange,
}: ComplaintDetailDialogProps) {
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");

  // Mock data for the selected complaint
  const complaint = {
    code: "KN-2024-001",
    matchCode: "M-2024-001",
    match: "Nguyễn Văn A vs Trần Văn B - Nam đơn",
    complainant: "Nguyễn Văn A",
    delegation: "Đoàn Hà Nội",
    type: "Điểm số",
    status: "new",
    priority: "high",
    createdAt: "10:30 11/01/2026",
    description:
      "Tôi phản đối điểm số của ván 2, hiệp 1. Điểm của tôi bị ghi nhầm từ 15-12 thành 14-12. Trọng tài không điều chỉnh sau khi tôi yêu cầu kiểm tra.",
    evidence: ["Video trận đấu", "Ảnh bảng điểm", "Ghi âm phản đối"],
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      new: <AlertCircle className="h-5 w-5 text-orange-500" />,
      processing: <Clock className="h-5 w-5 text-blue-500" />,
      resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
      rejected: <XCircle className="h-5 w-5 text-red-500" />,
    };
    return icons[status as keyof typeof icons];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: "Mới",
      processing: "Đang xử lý",
      resolved: "Đã giải quyết",
      rejected: "Từ chối",
    };
    return labels[status as keyof typeof labels];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getStatusIcon(complaint.status)}
            <div>
              <div className="flex items-center gap-2">
                <span>Chi tiết khiếu nại {complaint.code}</span>
                <Badge variant="outline">{getStatusLabel(complaint.status)}</Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Tạo lúc: {complaint.createdAt}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Trận đấu</Label>
                <p className="mt-1 font-medium">{complaint.matchCode}</p>
                <p className="text-sm text-muted-foreground">{complaint.match}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Người khiếu nại</Label>
                <p className="mt-1 font-medium">{complaint.complainant}</p>
                <p className="text-sm text-muted-foreground">{complaint.delegation}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Loại khiếu nại</Label>
                <p className="mt-1 font-medium">{complaint.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Mức độ ưu tiên</Label>
                <Badge variant="outline" className="mt-1">
                  {complaint.priority === "high" ? "Cao" : complaint.priority === "medium" ? "Trung bình" : "Thấp"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Nội dung khiếu nại */}
          <div className="space-y-3">
            <h3 className="font-semibold">Nội dung khiếu nại</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">{complaint.description}</p>
            </div>
          </div>

          {/* Bằng chứng */}
          <div className="space-y-3">
            <h3 className="font-semibold">Bằng chứng đính kèm</h3>
            <div className="flex flex-wrap gap-2">
              {complaint.evidence.map((item, index) => (
                <Button key={index} variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Phân công xử lý */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Phân công xử lý
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Người xử lý</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn người xử lý" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referee1">Phạm Minh Tuấn</SelectItem>
                    <SelectItem value="referee2">Nguyễn Thị Mai</SelectItem>
                    <SelectItem value="referee3">Trần Văn Hùng</SelectItem>
                    <SelectItem value="referee4">Lê Thị Hoa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ưu tiên</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Phân công xử lý
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
