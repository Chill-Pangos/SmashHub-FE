import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoFormProps {
  formData: {
    name: string;
    startDate: string;
    endDate: string;
    venue: string;
    address: string;
    description: string;
    type: string;
    level: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function BasicInfoForm({
  formData,
  onChange,
}: BasicInfoFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Thông tin cơ bản giải đấu</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Tên giải đấu *</Label>
          <Input
            placeholder="VD: Giải vô địch Quốc gia 2024"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loại giải *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giải" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="championship">Giải vô địch</SelectItem>
                <SelectItem value="open">Giải mở rộng</SelectItem>
                <SelectItem value="club">Giải các CLB</SelectItem>
                <SelectItem value="youth">Giải trẻ</SelectItem>
                <SelectItem value="veterans">Giải người cao tuổi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cấp độ *</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => onChange("level", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="international">Quốc tế</SelectItem>
                <SelectItem value="national">Quốc gia</SelectItem>
                <SelectItem value="regional">Khu vực</SelectItem>
                <SelectItem value="provincial">Tỉnh/Thành phố</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ngày bắt đầu *</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ngày kết thúc *</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Địa điểm tổ chức *</Label>
          <Input
            placeholder="VD: Cung thể thao Quần Vợt"
            value={formData.venue}
            onChange={(e) => onChange("venue", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Địa chỉ chi tiết</Label>
          <Input
            placeholder="VD: Số 291 Láng Hạ, Đống Đa, Hà Nội"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Mô tả giải đấu</Label>
          <textarea
            placeholder="Nhập mô tả về giải đấu..."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p>
            <strong>Lưu ý:</strong> Các trường đánh dấu (*) là bắt buộc. Vui
            lòng điền đầy đủ thông tin trước khi chuyển sang bước tiếp theo.
          </p>
        </div>
      </div>
    </Card>
  );
}
