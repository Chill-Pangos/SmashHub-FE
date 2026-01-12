import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IncidentReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Báo cáo sự cố</CardTitle>
        <CardDescription>Ghi nhận sự cố xảy ra trong quá trình giám sát</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sân thi đấu</Label>
            <select className="w-full p-2 border rounded">
              <option>Chọn sân...</option>
              <option>Sân 1</option>
              <option>Sân 2</option>
              <option>Sân 3</option>
              <option>Sân 4</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Loại sự cố</Label>
            <select className="w-full p-2 border rounded">
              <option>Chọn loại...</option>
              <option>Vi phạm kỷ luật</option>
              <option>Sự cố thiết bị</option>
              <option>Y tế</option>
              <option>Tranh cãi điểm số</option>
              <option>Hành vi phi thể thao</option>
              <option>Khác</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mô tả sự cố</Label>
          <textarea 
            className="w-full min-h-[100px] p-2 border rounded" 
            placeholder="Mô tả chi tiết sự cố đã xảy ra..."
          />
        </div>

        <div className="space-y-2">
          <Label>Trọng tài liên quan</Label>
          <Input placeholder="Nhập tên trọng tài..." />
        </div>

        <div className="space-y-2">
          <Label>Mức độ nghiêm trọng</Label>
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="severity" value="low" />
              <span className="text-sm">Thấp</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="severity" value="medium" />
              <span className="text-sm">Trung bình</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="severity" value="high" />
              <span className="text-sm">Cao</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Hành động đã thực hiện</Label>
          <textarea 
            className="w-full min-h-[80px] p-2 border rounded" 
            placeholder="Mô tả hành động đã thực hiện để xử lý..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">Hủy</Button>
          <Button className="flex-1">Gửi báo cáo</Button>
        </div>
      </CardContent>
    </Card>
  );
}
