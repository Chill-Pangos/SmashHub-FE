import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockDecisions = [
  {
    id: "QD-2024-001",
    title: "Chấp nhận khiếu nại điểm số - Trận bán kết A",
    type: "Khiếu nại",
    date: "2024-01-15 14:30",
    status: "Đã hoàn thành",
    result: "Chấp nhận",
    description: "Sau khi xem xét video, quyết định điều chỉnh điểm số từ 21-19 thành 21-18"
  },
  {
    id: "QD-2024-002",
    title: "Xử phạt hành vi phi thể thao - Đấu thủ X",
    type: "Kỷ luật",
    date: "2024-01-15 11:20",
    status: "Đã hoàn thành",
    result: "Cảnh cáo",
    description: "Đưa ra cảnh cáo chính thức cho đấu thủ do hành vi thiếu tôn trọng trọng tài"
  },
  {
    id: "QD-2024-003",
    title: "Từ chối khiếu nại - Trận vòng loại B",
    type: "Khiếu nại",
    date: "2024-01-14 16:45",
    status: "Đã hoàn thành",
    result: "Từ chối",
    description: "Không có bằng chứng rõ ràng để chấp nhận khiếu nại về việc vi phạm luật"
  },
  {
    id: "QD-2024-004",
    title: "Thay đổi trọng tài - Sân 2",
    type: "Điều chỉnh",
    date: "2024-01-14 10:15",
    status: "Đã hoàn thành",
    result: "Chấp nhận",
    description: "Thay đổi trọng tài do xung đột lợi ích được phát hiện"
  },
  {
    id: "QD-2024-005",
    title: "Xử lý sự cố thiết bị - Sân 1",
    type: "Sự cố",
    date: "2024-01-13 15:30",
    status: "Đã hoàn thành",
    result: "Đấu lại",
    description: "Quyết định đấu lại trận đấu do sự cố nghiêm trọng của bảng điện tử"
  }
];

export default function DecisionHistory() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lịch sử quyết định</CardTitle>
            <CardDescription>{mockDecisions.length} quyết định gần đây</CardDescription>
          </div>
          <Button size="sm" variant="outline">Xuất báo cáo</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDecisions.map((decision) => (
            <div key={decision.id} className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 cursor-pointer transition">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{decision.id}</Badge>
                    <Badge variant={decision.result === "Chấp nhận" ? "default" : decision.result === "Từ chối" ? "destructive" : "secondary"}>
                      {decision.result}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{decision.title}</h3>
                  <p className="text-sm text-muted-foreground">{decision.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Loại: {decision.type}</span>
                <span>{decision.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
