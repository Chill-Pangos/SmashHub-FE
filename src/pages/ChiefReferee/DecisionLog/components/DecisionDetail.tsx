import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mockSelectedDecision = {
  id: "QD-2024-001",
  title: "Chấp nhận khiếu nại điểm số - Trận bán kết A",
  type: "Khiếu nại",
  date: "2024-01-15 14:30",
  status: "Đã hoàn thành",
  result: "Chấp nhận",
  chiefReferee: "Lê Văn C",
  relatedMatch: "Nam Đơn - Bán kết A",
  relatedComplaint: "KN-2024-001",
  decision: "Sau khi xem xét video và bằng chứng, xác định điểm số hiển thị trên bảng điện tử không chính xác. Quyết định điều chỉnh điểm số từ 21-19 thành 21-18.",
  reason: "Video replay cho thấy rõ ràng cầu đã chạm lưới trước khi đối phương đánh trả, nên điểm số phải được điều chỉnh theo luật thi đấu.",
  actions: [
    "Điều chỉnh điểm số chính thức",
    "Cập nhật bảng xếp hạng",
    "Thông báo cho các bên liên quan"
  ],
  attachments: [
    { name: "Quyet_dinh_chinh_thuc.pdf", size: "245 KB" },
    { name: "Video_replay_edited.mp4", size: "12.3 MB" }
  ]
};

export default function DecisionDetail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết quyết định</CardTitle>
        <CardDescription>Thông tin chi tiết và văn bản quyết định</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{mockSelectedDecision.id}</Badge>
            <Badge variant="default">{mockSelectedDecision.result}</Badge>
          </div>
          <h3 className="font-semibold">{mockSelectedDecision.title}</h3>
          <p className="text-xs text-muted-foreground">{mockSelectedDecision.date}</p>
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Trọng tài chính</p>
            <p>{mockSelectedDecision.chiefReferee}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Trận đấu liên quan</p>
            <p>{mockSelectedDecision.relatedMatch}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Khiếu nại liên quan</p>
            <p>{mockSelectedDecision.relatedComplaint}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="font-medium text-sm mb-2">Quyết định</p>
          <p className="text-sm text-muted-foreground">{mockSelectedDecision.decision}</p>
        </div>

        <div>
          <p className="font-medium text-sm mb-2">Lý do</p>
          <p className="text-sm text-muted-foreground">{mockSelectedDecision.reason}</p>
        </div>

        <div>
          <p className="font-medium text-sm mb-2">Hành động thực hiện</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {mockSelectedDecision.actions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <p className="font-medium text-sm mb-2">Tài liệu đính kèm</p>
          <div className="space-y-2">
            {mockSelectedDecision.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                <span>{file.name}</span>
                <span className="text-xs text-muted-foreground">{file.size}</span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" variant="outline">Xuất PDF</Button>
      </CardContent>
    </Card>
  );
}
