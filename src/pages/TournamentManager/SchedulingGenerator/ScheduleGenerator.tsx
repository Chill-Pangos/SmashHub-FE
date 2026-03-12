import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useGenerateCompleteSchedule,
  useGenerateKnockoutOnlySchedule,
} from "@/hooks/queries";
import { showToast } from "@/utils/toast.utils";
import type {
  GenerateCompleteScheduleResponse,
  GenerateKnockoutOnlyScheduleResponse,
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
  const { t } = useTranslation();
  const [contentId, setContentId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [generationType, setGenerationType] = useState<
    "complete" | "knockout-only" | null
  >(null);
  const [result, setResult] = useState<
    CompleteScheduleData | KnockoutScheduleData | null
  >(null);

  // React Query mutations
  const generateCompleteMutation = useGenerateCompleteSchedule();
  const generateKnockoutMutation = useGenerateKnockoutOnlySchedule();

  const isGenerating =
    generateCompleteMutation.isPending || generateKnockoutMutation.isPending;

  const handleGenerateComplete = () => {
    if (!contentId || isNaN(Number(contentId))) {
      showToast.error(
        t("tournamentManager.scheduleGenerator.invalidContentId"),
      );
      return;
    }

    if (!startDate || !endDate) {
      showToast.error(t("tournamentManager.scheduleGenerator.enterDates"));
      return;
    }

    setGenerationType("complete");
    setResult(null);

    generateCompleteMutation.mutate(
      { contentId: Number(contentId), startDate, endDate },
      {
        onSuccess: (response) => {
          if (response.success) {
            setResult(response.data);
            showToast.success(
              t("tournamentManager.scheduleGenerator.completeScheduleSuccess"),
              t("tournamentManager.scheduleGenerator.matchesCreated", {
                count:
                  response.data.groupStage.totalMatches +
                  response.data.knockoutStage.totalMatches,
              }),
            );
          } else if (response.error) {
            throw new Error(
              response.error.message || t("message.operationFailed"),
            );
          }
          setGenerationType(null);
        },
        onError: (error: unknown) => {
          const err = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          showToast.error(
            t("tournamentManager.scheduleGenerator.cannotCreateSchedule"),
            err.response?.data?.message ||
              err.message ||
              t("message.pleaseTryAgain"),
          );
          setResult(null);
          setGenerationType(null);
        },
      },
    );
  };

  const handleGenerateKnockoutOnly = () => {
    if (!contentId || isNaN(Number(contentId))) {
      showToast.error(
        t("tournamentManager.scheduleGenerator.invalidContentId"),
      );
      return;
    }

    if (!startDate || !endDate) {
      showToast.error(t("tournamentManager.scheduleGenerator.enterDates"));
      return;
    }

    setGenerationType("knockout-only");
    setResult(null);

    generateKnockoutMutation.mutate(
      { contentId: Number(contentId), startDate, endDate },
      {
        onSuccess: (response) => {
          if (response.success) {
            setResult(response.data);
            showToast.success(
              t("tournamentManager.scheduleGenerator.knockoutScheduleSuccess"),
              t("tournamentManager.scheduleGenerator.matchesCreated", {
                count: response.data.totalMatches,
              }),
            );
          } else if (response.error) {
            throw new Error(
              response.error.message || t("message.operationFailed"),
            );
          }
          setGenerationType(null);
        },
        onError: (error: unknown) => {
          const err = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          showToast.error(
            t("tournamentManager.scheduleGenerator.cannotCreateSchedule"),
            err.response?.data?.message ||
              err.message ||
              t("message.pleaseTryAgain"),
          );
          setResult(null);
          setGenerationType(null);
        },
      },
    );
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
          <h1 className="text-3xl font-bold">
            {t("tournamentManager.scheduleGenerator.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("tournamentManager.scheduleGenerator.description")}
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
