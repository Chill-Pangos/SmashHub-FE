import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockDispute = {
  code: "KN-2024-001",
  match: "Trận bán kết A - Nam Đơn",
  complainant: "Nguyễn Văn A",
  delegation: "Hà Nội",
  type: "Điểm số",
  status: "Đang xử lý",
  priority: "Cao",
  createdAt: "2024-01-15 10:30",
  description: "Phản đối điểm số hiển thị trên bảng điện tử không đúng với tình huống thực tế. Yêu cầu xem lại video và điều chỉnh.",
  evidence: [
    { name: "Video_bat_tranh_chap.mp4", type: "video", size: "15.2 MB" },
    { name: "Anh_bang_diem.jpg", type: "image", size: "2.4 MB" }
  ],
  timeline: [
    { time: "2024-01-15 10:30", action: "Khiếu nại được tạo", user: "Nguyễn Văn A" },
    { time: "2024-01-15 10:45", action: "Phân công xử lý", user: "Admin" },
    { time: "2024-01-15 11:00", action: "Đang xem xét", user: "Trọng tài chính Lê Văn C" }
  ]
};

export default function DisputeDetail() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thông tin khiếu nại</CardTitle>
              <CardDescription>Chi tiết khiếu nại {mockDispute.code}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={mockDispute.status === "Đang xử lý" ? "default" : "secondary"}>
                {mockDispute.status}
              </Badge>
              <Badge variant={mockDispute.priority === "Cao" ? "destructive" : "outline"}>
                {mockDispute.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mã khiếu nại</p>
              <p className="text-sm">{mockDispute.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trận đấu</p>
              <p className="text-sm">{mockDispute.match}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Người khiếu nại</p>
              <p className="text-sm">{mockDispute.complainant}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đoàn</p>
              <p className="text-sm">{mockDispute.delegation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Loại khiếu nại</p>
              <p className="text-sm">{mockDispute.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Thời gian tạo</p>
              <p className="text-sm">{mockDispute.createdAt}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Nội dung khiếu nại</p>
            <p className="text-sm">{mockDispute.description}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Bằng chứng đính kèm</p>
            <div className="space-y-2">
              {mockDispute.evidence.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{file.type}</Badge>
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
