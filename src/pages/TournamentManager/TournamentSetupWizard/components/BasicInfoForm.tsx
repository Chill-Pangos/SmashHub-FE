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
import type { TournamentFormData, ValidationErrors } from "@/utils/validation.utils";
import type { TournamentStatus } from "@/types";

interface BasicInfoFormProps {
  formData: TournamentFormData;
  onChange: (field: keyof TournamentFormData, value: string) => void;
  errors?: ValidationErrors;
}

export default function BasicInfoForm({
  formData,
  onChange,
  errors = {},
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
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Địa điểm tổ chức *</Label>
          <Input
            placeholder="VD: Sân vận động Quốc gia Mỹ Đình"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ngày bắt đầu *</Label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ngày kết thúc</Label>
            <Input
              type="datetime-local"
              value={formData.endDate || ""}
              onChange={(e) => onChange("endDate", e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onChange("status", value as TournamentStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
              <SelectItem value="ongoing">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Lưu ý:</strong> Các trường có dấu (*) là bắt buộc. Bạn sẽ thiết lập
            các nội dung thi đấu (đơn/đôi/đồng đội) ở bước tiếp theo.
          </p>
        </div>
      </div>
    </Card>
  );
}
