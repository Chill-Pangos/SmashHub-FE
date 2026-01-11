import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResolutionForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả giải quyết</CardTitle>
        <CardDescription>Nhập quyết định và giải pháp xử lý khiếu nại</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Quyết định</Label>
          <select className="w-full p-2 border rounded">
            <option>Chọn quyết định...</option>
            <option>Chấp nhận khiếu nại</option>
            <option>Từ chối khiếu nại</option>
            <option>Chấp nhận một phần</option>
            <option>Cần điều tra thêm</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Giải pháp xử lý</Label>
          <textarea 
            className="w-full min-h-[100px] p-2 border rounded" 
            placeholder="Mô tả chi tiết giải pháp xử lý..."
          />
        </div>

        <div className="space-y-2">
          <Label>Hành động điều chỉnh</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Điều chỉnh điểm số</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Đấu lại trận đấu</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Thay đổi trọng tài</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Xử phạt kỷ luật</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trọng tài chính phụ trách</Label>
          <Input placeholder="Nhập tên trọng tài chính..." />
        </div>

        <div className="space-y-2">
          <Label>Ghi chú nội bộ</Label>
          <textarea 
            className="w-full min-h-[80px] p-2 border rounded" 
            placeholder="Ghi chú cho ban tổ chức..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button className="flex-1">Lưu nháp</Button>
          <Button className="flex-1" variant="default">Hoàn thành xử lý</Button>
        </div>
      </CardContent>
    </Card>
  );
}
