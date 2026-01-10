import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, Printer } from "lucide-react";

export default function ReportsCenter() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Xuất báo cáo & Biên bản</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <FileText className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-semibold mb-2">Biên bản thi đấu</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Xuất biên bản kết quả các trận đấu
          </p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="h-8 w-8 text-green-500 mb-4" />
          <h3 className="font-semibold mb-2">Báo cáo tổng kết</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Báo cáo tổng hợp về giải đấu
          </p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="h-8 w-8 text-purple-500 mb-4" />
          <h3 className="font-semibold mb-2">Bảng xếp hạng</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Xuất bảng xếp hạng giải đấu
          </p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="h-8 w-8 text-orange-500 mb-4" />
          <h3 className="font-semibold mb-2">Danh sách VĐV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Xuất danh sách vận động viên
          </p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="h-8 w-8 text-red-500 mb-4" />
          <h3 className="font-semibold mb-2">Lịch thi đấu</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Xuất lịch thi đấu chi tiết
          </p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="h-8 w-8 text-teal-500 mb-4" />
          <h3 className="font-semibold mb-2">Báo cáo thống kê</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Các chỉ số thống kê giải đấu
          </p>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </Card>
      </div>
    </div>
  );
}
