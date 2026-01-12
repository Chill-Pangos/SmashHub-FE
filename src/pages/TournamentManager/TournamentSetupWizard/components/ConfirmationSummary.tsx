import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ConfirmationSummaryProps {
  formData: {
    name: string;
    startDate: string;
    endDate: string;
    venue: string;
    address: string;
    type: string;
    level: string;
  };
  selectedCategories: string[];
  selectedDelegations: string[];
}

export default function ConfirmationSummary({
  formData,
  selectedCategories,
  selectedDelegations,
}: ConfirmationSummaryProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      championship: "Giải vô địch",
      open: "Giải mở rộng",
      club: "Giải các CLB",
      youth: "Giải trẻ",
      veterans: "Giải người cao tuổi",
    };
    return labels[type] || type;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      international: "Quốc tế",
      national: "Quốc gia",
      regional: "Khu vực",
      provincial: "Tỉnh/Thành phố",
    };
    return labels[level] || level;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Xác nhận thông tin</h2>
          <p className="text-sm text-muted-foreground">
            Kiểm tra lại thông tin trước khi tạo giải đấu
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge>1</Badge>
            Thông tin cơ bản
          </h3>
          <div className="pl-8 space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Tên giải:</span>
              <span className="col-span-2 font-medium">
                {formData.name || "-"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Loại giải:</span>
              <span className="col-span-2">{getTypeLabel(formData.type)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Cấp độ:</span>
              <span className="col-span-2">
                {getLevelLabel(formData.level)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Thời gian:</span>
              <span className="col-span-2">
                {formatDate(formData.startDate)} -{" "}
                {formatDate(formData.endDate)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Địa điểm:</span>
              <span className="col-span-2">{formData.venue || "-"}</span>
            </div>
            {formData.address && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Địa chỉ:</span>
                <span className="col-span-2">{formData.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge>2</Badge>
            Nội dung thi đấu
          </h3>
          <div className="pl-8">
            <p className="text-sm text-muted-foreground mb-2">
              Đã chọn {selectedCategories.length} nội dung
            </p>
            {selectedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((id) => (
                  <Badge key={id} variant="outline">
                    Nội dung #{id}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa chọn nội dung
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge>3</Badge>
            Đoàn tham gia
          </h3>
          <div className="pl-8">
            <p className="text-sm text-muted-foreground mb-2">
              Đã chọn {selectedDelegations.length} đoàn
            </p>
            {selectedDelegations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedDelegations.map((id) => (
                  <Badge key={id} variant="outline">
                    Đoàn #{id}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa chọn đoàn</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p className="font-semibold mb-2">
              Bước tiếp theo sau khi tạo giải:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Phân công trọng tài cho các trận đấu</li>
              <li>Xếp lịch thi đấu chi tiết</li>
              <li>Gửi thông báo tới các đoàn tham gia</li>
              <li>Chuẩn bị tài liệu và biên bản</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6">
          <Button className="w-full" size="lg">
            <CheckCircle className="mr-2 h-5 w-5" />
            Xác nhận và tạo giải đấu
          </Button>
        </div>
      </div>
    </Card>
  );
}
