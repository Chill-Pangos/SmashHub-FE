import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

export default function DisputeResolution() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Xử lý chi tiết khiếu nại</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Thông tin khiếu nại</h2>
              <p className="text-sm text-muted-foreground">Mã KN: #001</p>
            </div>
            <Badge>Đang xử lý</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <Label>Trận đấu</Label>
              <p className="mt-1">-</p>
            </div>
            <div>
              <Label>Người khiếu nại</Label>
              <p className="mt-1">-</p>
            </div>
            <div>
              <Label>Thời gian</Label>
              <p className="mt-1">-</p>
            </div>
            <div>
              <Label>Loại khiếu nại</Label>
              <p className="mt-1">-</p>
            </div>
          </div>

          <div>
            <Label>Nội dung khiếu nại</Label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="text-sm">Chưa có dữ liệu</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quyết định xử lý</h2>
        <div className="space-y-4">
          <div>
            <Label>Ý kiến xử lý</Label>
            <Input placeholder="Nhập ý kiến xử lý..." className="mt-2" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Chấp nhận
            </Button>
            <Button variant="destructive" className="flex-1">
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button variant="outline" className="flex-1">
              <Clock className="mr-2 h-4 w-4" />
              Hoãn lại
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch sử xử lý</h2>
        <div className="text-center text-muted-foreground py-4">
          Chưa có lịch sử xử lý
        </div>
      </Card>
    </div>
  );
}
