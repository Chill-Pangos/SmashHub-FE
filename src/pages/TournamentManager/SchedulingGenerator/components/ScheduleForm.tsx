import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Sparkles, Zap, Loader2 } from "lucide-react";

interface ScheduleFormProps {
  contentId: string;
  startDate: string;
  endDate: string;
  isGenerating: boolean;
  generationType: "complete" | "knockout-only" | null;
  onContentIdChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onGenerateComplete: () => void;
  onGenerateKnockoutOnly: () => void;
}

export default function ScheduleForm({
  contentId,
  startDate,
  endDate,
  isGenerating,
  generationType,
  onContentIdChange,
  onStartDateChange,
  onEndDateChange,
  onGenerateComplete,
  onGenerateKnockoutOnly,
}: ScheduleFormProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-semibold mb-1">Hướng dẫn sử dụng:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>Generate Complete:</strong> Tạo lịch cho cả vòng bảng và
                vòng knockout (dành cho giải có isGroupStage = true)
              </li>
              <li>
                <strong>Generate Knockout Only:</strong> Chỉ tạo lịch vòng
                knockout (dành cho giải không có vòng bảng)
              </li>
              <li>Chỉ cần nhập Content ID, hệ thống sẽ tự động phân bổ</li>
              <li>Quá trình tạo lịch có thể mất 30-60 giây, vui lòng đợi...</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentId">Content ID *</Label>
          <Input
            id="contentId"
            type="number"
            placeholder="Nhập Content ID (ví dụ: 1)"
            value={contentId}
            onChange={(e) => onContentIdChange(e.target.value)}
            disabled={isGenerating}
            className="max-w-md"
          />
          <p className="text-sm text-muted-foreground">
            ID của nội dung thi đấu cần tạo lịch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Ngày bắt đầu *</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              disabled={isGenerating}
              required
            />
            <p className="text-xs text-muted-foreground">
              Ngày giờ bắt đầu giải đấu
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Ngày kết thúc *</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              disabled={isGenerating}
              required
            />
            <p className="text-xs text-muted-foreground">
              Ngày giờ kết thúc giải đấu
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={onGenerateComplete}
            disabled={isGenerating || !contentId || !startDate || !endDate}
            className="flex-1 max-w-xs"
          >
            {isGenerating && generationType === "complete" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tạo lịch...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Complete
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onGenerateKnockoutOnly}
            disabled={isGenerating || !contentId || !startDate || !endDate}
            className="flex-1 max-w-xs"
          >
            {isGenerating && generationType === "knockout-only" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tạo lịch...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Generate Knockout Only
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
