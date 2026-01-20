import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Zap } from "lucide-react";
import type { Schedule } from "@/types";

interface CompleteScheduleData {
  groupStage: {
    totalMatches: number;
    groups: string[];
    schedules: Schedule[];
  };
  knockoutStage: {
    totalMatches: number;
    rounds: string[];
    schedules: Schedule[];
  };
}

interface KnockoutScheduleData {
  totalMatches: number;
  totalEntries: number;
  bracketSize: number;
  rounds: string[];
  schedules: Schedule[];
}

interface ResultDisplayProps {
  result: CompleteScheduleData | KnockoutScheduleData;
  isCompleteSchedule: (
    data: CompleteScheduleData | KnockoutScheduleData,
  ) => data is CompleteScheduleData;
  onCreateNew: () => void;
}

export default function ResultDisplay({
  result,
  isCompleteSchedule,
  onCreateNew,
}: ResultDisplayProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Tạo lịch thành công! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Lịch thi đấu đã được tạo và lưu vào hệ thống
            </p>
          </div>
        </div>

        {/* Complete Schedule Result */}
        {isCompleteSchedule(result) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                  Vòng Bảng
                </h4>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng trận đấu:</span>
                  <span className="font-semibold">
                    {result.groupStage.totalMatches}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số bảng:</span>
                  <span className="font-semibold">
                    {result.groupStage.groups?.length || 0}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">
                    Các bảng:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.groupStage.groups?.map(
                      (group: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                        >
                          {group}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                  Vòng Knockout
                </h4>
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng trận đấu:</span>
                  <span className="font-semibold">
                    {result.knockoutStage.totalMatches}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số vòng:</span>
                  <span className="font-semibold">
                    {result.knockoutStage.rounds?.length || 0}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">
                    Các vòng đấu:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.knockoutStage.rounds?.map(
                      (round: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                        >
                          {round}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Knockout Only Result */}
        {!isCompleteSchedule(result) && (
          <Card className="p-4 border-2 border-purple-200 dark:border-purple-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                  Lịch Knockout
                </h4>
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.totalMatches}
                  </div>
                  <div className="text-xs text-muted-foreground">Tổng trận</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.totalEntries}
                  </div>
                  <div className="text-xs text-muted-foreground">Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.bracketSize}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Bracket Size
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">
                  Các vòng đấu:
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.rounds?.map((round: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                    >
                      {round}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onCreateNew}>
            Tạo lịch mới
          </Button>
          <Button onClick={() => window.location.reload()}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Xem lịch thi đấu
          </Button>
        </div>
      </div>
    </Card>
  );
}
