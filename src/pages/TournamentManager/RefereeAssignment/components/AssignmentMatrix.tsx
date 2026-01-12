import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Assignment {
  matchId: string;
  match: string;
  time: string;
  court: string;
  category: string;
  mainReferee: string;
  lineJudges: string[];
}

const mockAssignments: Assignment[] = [
  {
    matchId: "1",
    match: "Nguyễn Tiến Minh vs Nguyễn Hải Đăng",
    time: "08:00 - 16/12/2024",
    court: "Sân 1",
    category: "Nam đơn - Vòng 1",
    mainReferee: "Trần Văn Tuấn",
    lineJudges: ["Hoàng Văn Minh", "Võ Thị Mai"],
  },
  {
    matchId: "2",
    match: "Vũ Thị Trang vs Nguyễn Thùy Linh",
    time: "09:00 - 16/12/2024",
    court: "Sân 2",
    category: "Nữ đơn - Vòng 1",
    mainReferee: "Nguyễn Thị Lan",
    lineJudges: ["Bùi Thị Thu", "Võ Thị Mai"],
  },
  {
    matchId: "3",
    match: "Đỗ Tuấn Đức/Phạm Hồng Nam vs Trần Văn A/Lê Văn B",
    time: "10:00 - 16/12/2024",
    court: "Sân 1",
    category: "Nam đôi - Vòng 2",
    mainReferee: "Lê Hoàng Nam",
    lineJudges: ["Hoàng Văn Minh", "Bùi Thị Thu"],
  },
  {
    matchId: "4",
    match: "Nguyễn Thành Trung/Tô Tròng Thi vs Phạm Văn C/Lê Thị D",
    time: "11:00 - 16/12/2024",
    court: "Sân 3",
    category: "Đôi nam nữ - Vòng 2",
    mainReferee: "Phạm Thị Hương",
    lineJudges: ["Võ Thị Mai", "Bùi Thị Thu"],
  },
  {
    matchId: "5",
    match: "Nguyễn Tiến Minh vs Phạm Cao Cường",
    time: "14:00 - 16/12/2024",
    court: "Sân 1",
    category: "Nam đơn - Bán kết",
    mainReferee: "Đặng Quốc Huy",
    lineJudges: ["Hoàng Văn Minh", "Võ Thị Mai"],
  },
];

export default function AssignmentMatrix() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Ma trận phân công</h2>
        <Button variant="outline" size="sm">
          Xuất lịch phân công
        </Button>
      </div>

      <div className="space-y-4">
        {mockAssignments.map((assignment) => (
          <div
            key={assignment.matchId}
            className="p-4 border rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{assignment.category}</Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {assignment.court}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{assignment.match}</h3>
                  <p className="text-sm text-muted-foreground">
                    {assignment.time}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-100 text-purple-700 shrink-0">
                      TT Chính
                    </Badge>
                    <span className="text-sm font-medium">
                      {assignment.mainReferee}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-100 text-green-700 shrink-0">
                      TT Biên
                    </Badge>
                    <span className="text-sm">
                      {assignment.lineJudges.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-3">Thống kê phân công</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tổng số trận</p>
            <p className="text-xl font-bold">24</p>
          </div>
          <div>
            <p className="text-muted-foreground">Đã phân công</p>
            <p className="text-xl font-bold text-green-600">18</p>
          </div>
          <div>
            <p className="text-muted-foreground">Chưa phân công</p>
            <p className="text-xl font-bold text-orange-600">6</p>
          </div>
          <div>
            <p className="text-muted-foreground">Trọng tài tham gia</p>
            <p className="text-xl font-bold">8</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
