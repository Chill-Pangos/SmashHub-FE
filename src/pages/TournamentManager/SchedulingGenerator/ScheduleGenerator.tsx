import { useState } from "react";
import { scheduleService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type {
  GenerateCompleteScheduleResponse,
  GenerateKnockoutOnlyScheduleResponse,
  GenerateCompleteScheduleRequest,
  GenerateKnockoutOnlyScheduleRequest,
} from "@/types";
import { ScheduleForm, LoadingAnimation, ResultDisplay } from "./components";

// Type guards
type CompleteScheduleData = GenerateCompleteScheduleResponse["data"];
type KnockoutScheduleData = GenerateKnockoutOnlyScheduleResponse["data"];

function isCompleteSchedule(
  data: CompleteScheduleData | KnockoutScheduleData,
): data is CompleteScheduleData {
  return "groupStage" in data && "knockoutStage" in data;
}

export default function ScheduleGenerator() {
  const [contentId, setContentId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<
    "complete" | "knockout-only" | null
  >(null);
  const [result, setResult] = useState<
    CompleteScheduleData | KnockoutScheduleData | null
  >(null);

  const handleGenerateComplete = async () => {
    if (!contentId || isNaN(Number(contentId))) {
      showToast.error("Vui lòng nhập Content ID hợp lệ");
      return;
    }

    if (!startDate || !endDate) {
      showToast.error("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc");
      return;
    }

    setIsGenerating(true);
    setGenerationType("complete");
    setResult(null);

    try {
      const requestData: GenerateCompleteScheduleRequest = {
        contentId: Number(contentId),
        startDate,
        endDate,
      };

      const response =
        await scheduleService.generateCompleteSchedule(requestData);

      if (response.success) {
        setResult(response.data);
        showToast.success(
          "Tạo lịch thi đấu hoàn chỉnh thành công!",
          `Đã tạo ${response.data.groupStage.totalMatches + response.data.knockoutStage.totalMatches} trận đấu`,
        );
      } else if (response.error) {
        throw new Error(response.error.message || "Có lỗi xảy ra");
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      showToast.error(
        "Không thể tạo lịch",
        err.response?.data?.message || err.message || "Vui lòng thử lại",
      );
      setResult(null);
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  const handleGenerateKnockoutOnly = async () => {
    if (!contentId || isNaN(Number(contentId))) {
      showToast.error("Vui lòng nhập Content ID hợp lệ");
      return;
    }

    if (!startDate || !endDate) {
      showToast.error("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc");
      return;
    }

    setIsGenerating(true);
    setGenerationType("knockout-only");
    setResult(null);

    try {
      const requestData: GenerateKnockoutOnlyScheduleRequest = {
        contentId: Number(contentId),
        startDate,
        endDate,
      };

      const response =
        await scheduleService.generateKnockoutOnlySchedule(requestData);

      if (response.success) {
        setResult(response.data);
        showToast.success(
          "Tạo lịch knockout thành công!",
          `Đã tạo ${response.data.totalMatches} trận đấu`,
        );
      } else if (response.error) {
        throw new Error(response.error.message || "Có lỗi xảy ra");
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      showToast.error(
        "Không thể tạo lịch",
        err.response?.data?.message || err.message || "Vui lòng thử lại",
      );
      setResult(null);
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  const handleCreateNew = () => {
    setResult(null);
    setContentId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tạo lịch thi đấu tự động</h1>
          <p className="text-muted-foreground mt-1">
            Hệ thống sẽ tự động tạo lịch thi đấu cho toàn bộ giải đấu
          </p>
        </div>
      </div>

      <ScheduleForm
        contentId={contentId}
        startDate={startDate}
        endDate={endDate}
        isGenerating={isGenerating}
        generationType={generationType}
        onContentIdChange={setContentId}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGenerateComplete={handleGenerateComplete}
        onGenerateKnockoutOnly={handleGenerateKnockoutOnly}
      />

      {isGenerating && <LoadingAnimation generationType={generationType} />}

      {result && !isGenerating && (
        <ResultDisplay
          result={result}
          isCompleteSchedule={isCompleteSchedule}
          onCreateNew={handleCreateNew}
        />
      )}
    </div>
  );
}
