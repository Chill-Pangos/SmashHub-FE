import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface LoadingAnimationProps {
  generationType: "complete" | "knockout-only" | null;
}

export default function LoadingAnimation({
  generationType,
}: LoadingAnimationProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">
            {generationType === "complete"
              ? "Đang tạo lịch thi đấu hoàn chỉnh..."
              : "Đang tạo lịch knockout..."}
          </h3>
          <p className="text-muted-foreground">
            Hệ thống đang phân tích dữ liệu và tạo lịch thi đấu tự động
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span>Vui lòng đợi 30-60 giây...</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Đang xử lý</div>
            <div className="font-semibold">
              {generationType === "complete"
                ? "Vòng bảng + Knockout"
                : "Vòng Knockout"}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Phân bổ</div>
            <div className="font-semibold">Thời gian & Bàn đấu</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Tạo</div>
            <div className="font-semibold">Matches & Schedules</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
