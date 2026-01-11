import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, FileSpreadsheet, FileIcon } from "lucide-react";
import { useState } from "react";

export default function ReportGenerator() {
  const [reportType, setReportType] = useState("");
  const [format, setFormat] = useState("");
  const [tournament, setTournament] = useState("");
  const [dateRange, setDateRange] = useState("");

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Tạo báo cáo mới</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Loại báo cáo</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tournament-summary">
                Báo cáo tổng kết giải đấu
              </SelectItem>
              <SelectItem value="match-report">Biên bản trận đấu</SelectItem>
              <SelectItem value="delegation-report">
                Báo cáo thành tích đoàn
              </SelectItem>
              <SelectItem value="statistics-report">
                Báo cáo thống kê
              </SelectItem>
              <SelectItem value="referee-report">
                Báo cáo hoạt động trọng tài
              </SelectItem>
              <SelectItem value="schedule-report">
                Báo cáo lịch thi đấu
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Giải đấu</Label>
          <Select value={tournament} onValueChange={setTournament}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giải đấu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t1">Giải vô địch Quốc gia 2024</SelectItem>
              <SelectItem value="t2">Giải U19 toàn quốc 2024</SelectItem>
              <SelectItem value="t3">Giải vô địch các CLB 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Khoảng thời gian</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toàn bộ giải đấu</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="yesterday">Hôm qua</SelectItem>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="custom">Tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Định dạng xuất</Label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setFormat("pdf")}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-primary transition-colors ${
                format === "pdf" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <FileIcon className="h-8 w-8 text-red-500" />
              <span className="text-sm font-medium">PDF</span>
            </button>

            <button
              onClick={() => setFormat("excel")}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-primary transition-colors ${
                format === "excel" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">Excel</span>
            </button>

            <button
              onClick={() => setFormat("word")}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-primary transition-colors ${
                format === "word" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium">Word</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1"
            disabled={!reportType || !format || !tournament || !dateRange}
          >
            Tạo báo cáo
          </Button>
          <Button variant="outline" className="flex-1">
            Xem trước
          </Button>
        </div>
      </div>
    </Card>
  );
}
