import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { TournamentFormData, TournamentContentFormData } from "@/utils/validation.utils";

interface ConfirmationSummaryProps {
  formData: TournamentFormData;
  tournamentContents: TournamentContentFormData[];
  selectedDelegations: string[];
}

export default function ConfirmationSummary({
  formData,
  tournamentContents,
  selectedDelegations,
}: ConfirmationSummaryProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      upcoming: "Sắp diễn ra",
      ongoing: "Đang diễn ra",
      completed: "Đã kết thúc",
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single: "Đơn",
      double: "Đôi",
      team: "Đồng đội",
    };
    return labels[type] || type;
  };

  const getGenderLabel = (gender?: string | null) => {
    if (!gender) return "Tất cả";
    const labels: Record<string, string> = {
      male: "Nam",
      female: "Nữ",
      mixed: "Hỗn hợp",
    };
    return labels[gender] || gender;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
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
              <span className="text-muted-foreground">Địa điểm:</span>
              <span className="col-span-2">{formData.location || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Thời gian bắt đầu:</span>
              <span className="col-span-2">
                {formatDate(formData.startDate)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Thời gian kết thúc:</span>
              <span className="col-span-2">
                {formatDate(formData.endDate)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className="col-span-2">
                {getStatusLabel(formData.status || "upcoming")}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Số bàn thi đấu:</span>
              <span className="col-span-2 font-medium">
                {formData.numberOfTables || 1} bàn
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge>2</Badge>
            Nội dung thi đấu
            <Badge variant="secondary">{tournamentContents.length}</Badge>
          </h3>
          {tournamentContents.length === 0 ? (
            <p className="pl-8 text-sm text-muted-foreground">
              Chưa có nội dung thi đấu
            </p>
          ) : (
            <div className="pl-8 space-y-3">
              {tournamentContents.map((content, index) => (
                <Card key={index} className="p-3">
                  <div className="font-medium mb-1">{content.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Loại: <strong>{getTypeLabel(content.type)}</strong></div>
                    <div>Giới tính: <strong>{getGenderLabel(content.gender)}</strong></div>
                    <div>Số lượng: <strong>{content.maxEntries}</strong></div>
                    <div>Số set: <strong>{content.maxSets}</strong></div>
                    
                    {content.type === "team" && (
                      <>
                        <div>Trận đơn: <strong>{content.numberOfSingles ?? 0}</strong></div>
                        <div>Trận đôi: <strong>{content.numberOfDoubles ?? 0}</strong></div>
                      </>
                    )}
                    
                    {(content.minAge || content.maxAge) && (
                      <div className="col-span-2">
                        Độ tuổi: <strong>{content.minAge ?? "?"} - {content.maxAge ?? "?"}</strong>
                      </div>
                    )}
                    
                    {(content.minElo || content.maxElo) && (
                      <div className="col-span-2">
                        ELO: <strong>{content.minElo ?? "?"} - {content.maxElo ?? "?"}</strong>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedDelegations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Badge>3</Badge>
              Đoàn tham gia
              <Badge variant="secondary">{selectedDelegations.length}</Badge>
            </h3>
            <div className="pl-8 text-sm text-muted-foreground">
              {selectedDelegations.length} đoàn đã được chọn
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Lưu ý:</strong> Sau khi tạo giải đấu, bạn có thể chỉnh sửa thông tin
          hoặc thêm/xóa nội dung thi đấu trong phần quản lý giải đấu.
        </p>
      </div>
    </Card>
  );
}
