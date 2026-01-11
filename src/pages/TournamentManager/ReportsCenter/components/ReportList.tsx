import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "tournament" | "delegation" | "match" | "statistics";
  description: string;
  date: string;
  status: "generated" | "pending";
  size: string;
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Báo cáo tổng kết giải đấu",
    type: "tournament",
    description:
      "Báo cáo tổng hợp về toàn bộ giải đấu, bao gồm kết quả, thống kê và đánh giá",
    date: "2024-12-15",
    status: "generated",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Biên bản trận đấu - Vòng Chung kết",
    type: "match",
    description: "Biên bản chi tiết các trận chung kết nam đơn và nữ đơn",
    date: "2024-12-15",
    status: "generated",
    size: "856 KB",
  },
  {
    id: "3",
    name: "Báo cáo thành tích đoàn Hà Nội",
    type: "delegation",
    description: "Báo cáo chi tiết về thành tích VĐV đoàn Hà Nội",
    date: "2024-12-14",
    status: "generated",
    size: "1.2 MB",
  },
  {
    id: "4",
    name: "Thống kê kết quả giải đấu",
    type: "statistics",
    description:
      "Thống kê tổng hợp về số trận đấu, điểm số, thành tích các đoàn",
    date: "2024-12-14",
    status: "generated",
    size: "543 KB",
  },
  {
    id: "5",
    name: "Báo cáo hoạt động trọng tài",
    type: "tournament",
    description: "Báo cáo về hoạt động và phân công trọng tài trong giải",
    date: "2024-12-13",
    status: "pending",
    size: "-",
  },
  {
    id: "6",
    name: "Biên bản trận đấu - Vòng Bán kết",
    type: "match",
    description: "Biên bản chi tiết các trận bán kết tất cả nội dung",
    date: "2024-12-12",
    status: "generated",
    size: "1.8 MB",
  },
];

const getReportTypeLabel = (type: Report["type"]) => {
  const labels = {
    tournament: "Giải đấu",
    delegation: "Đoàn",
    match: "Trận đấu",
    statistics: "Thống kê",
  };
  return labels[type];
};

const getReportTypeColor = (type: Report["type"]) => {
  const colors = {
    tournament: "bg-blue-100 text-blue-700",
    delegation: "bg-green-100 text-green-700",
    match: "bg-purple-100 text-purple-700",
    statistics: "bg-orange-100 text-orange-700",
  };
  return colors[type];
};

export default function ReportList() {
  return (
    <div className="space-y-4">
      {mockReports.map((report) => (
        <Card key={report.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <FileText className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{report.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={getReportTypeColor(report.type)}>
                    {getReportTypeLabel(report.type)}
                  </Badge>
                  <Badge
                    variant={
                      report.status === "generated" ? "default" : "secondary"
                    }
                  >
                    {report.status === "generated" ? "Đã tạo" : "Đang xử lý"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Ngày tạo:{" "}
                    {new Date(report.date).toLocaleDateString("vi-VN")}
                  </span>
                  <span>Kích thước: {report.size}</span>
                </div>

                {report.status === "generated" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Xem trước
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
