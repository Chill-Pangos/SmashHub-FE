import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockHistory = [
  {
    id: 1,
    time: "2024-01-15 11:30",
    action: "Xem xét hồ sơ",
    user: "Lê Văn C (Trọng tài chính)",
    detail: "Đã xem xét video và bằng chứng đính kèm",
    status: "completed"
  },
  {
    id: 2,
    time: "2024-01-15 11:15",
    action: "Phân công xử lý",
    user: "Admin",
    detail: "Phân công cho trọng tài chính Lê Văn C",
    status: "completed"
  },
  {
    id: 3,
    time: "2024-01-15 10:45",
    action: "Tiếp nhận khiếu nại",
    user: "Hệ thống",
    detail: "Khiếu nại được tạo từ bảng điều khiển",
    status: "completed"
  }
];

export default function ProcessHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử xử lý</CardTitle>
        <CardDescription>Theo dõi quá trình giải quyết khiếu nại</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockHistory.map((item) => (
            <div key={item.id} className="relative pl-6 pb-4 border-l-2 border-muted last:border-l-0">
              <div 
                className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                  item.status === 'completed' ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'
                }`}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{item.action}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.time}</p>
                <p className="text-sm text-muted-foreground">Bởi: {item.user}</p>
                <p className="text-sm">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
