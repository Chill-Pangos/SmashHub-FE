import React, { useState } from "react";
import type { StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Rocket } from "lucide-react";

export const StepReview: React.FC<StepProps> = ({ data, onBack }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatLabels = {
    mens_singles: t(
      "tournamentManager.createTournamentForm.general.formats.mensSingles",
    ),
    womens_singles: t(
      "tournamentManager.createTournamentForm.general.formats.womensSingles",
    ),
    mixed_doubles: t(
      "tournamentManager.createTournamentForm.general.formats.mixedDoubles",
    ),
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Parse time strings to numbers for the JSON payload
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return { hour: h || 0, minute: m || 0 };
    };

    const start = parseTime(data.schedule.dailyStartTime);
    const end = parseTime(data.schedule.dailyEndTime);
    const breakStart = parseTime(data.schedule.breakStartTime);

    // Tính toán break End Time dựa trên start + duration
    const breakStartDate = new Date();
    breakStartDate.setHours(breakStart.hour, breakStart.minute, 0);
    const breakEndDate = new Date(
      breakStartDate.getTime() + data.schedule.breakDurationMinutes * 60000,
    );

    const schedulePayload = {
      tournamentId: 0, // Sẽ được update sau khi gọi api tạo tournament
      matchDurationMinutes: data.schedule.matchDurationMinutes,
      breakDurationMinutes: data.schedule.breakDurationMinutes,
      dailyStartHour: start.hour,
      dailyStartMinute: start.minute,
      dailyEndHour: end.hour,
      dailyEndMinute: end.minute,
      lunchBreakStartHour: data.schedule.hasBreak ? breakStart.hour : 0,
      lunchBreakStartMinute: data.schedule.hasBreak ? breakStart.minute : 0,
      lunchBreakEndHour: data.schedule.hasBreak ? breakEndDate.getHours() : 0,
      lunchBreakEndMinute: data.schedule.hasBreak
        ? breakEndDate.getMinutes()
        : 0,
      notes: `Configured for ${data.schedule.activeTables} active tables.`,
    };

    try {
      // TODO: 1. Sử dụng useMutation để call API POST /tournaments
      console.log("1. Creating Tournament...", data);

      // Giả lập lấy ID sau khi tạo
      const fakeTournamentId = 123;
      schedulePayload.tournamentId = fakeTournamentId;

      // TODO: 2. Sử dụng useMutation khác để call API POST /tournaments/{id}/schedule-config
      // Re-validate dữ liệu config ở backend tại đây
      console.log(
        "2. Submitting Schedule Config Payload: ",
        JSON.stringify(schedulePayload, null, 2),
      );

      // Giả lập delay network
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: 3. Chuyển hướng người dùng về dashboard
      alert(t("tournamentManager.createTournamentForm.review.successAlert"));
      // router.push('/dashboard')
    } catch (error) {
      console.error("Failed to create tournament", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-start gap-4">
        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-primary">
            {t("tournamentManager.createTournamentForm.review.systemReady")}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "tournamentManager.createTournamentForm.review.systemReadyDescription",
              {
                matches: Math.floor(
                  ((24 * 60) / data.schedule.matchDurationMinutes) *
                    data.schedule.activeTables,
                ),
              },
            )}
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-card p-6 rounded-xl border border-border">
        {/* Overview */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            {t("tournamentManager.createTournamentForm.review.overview")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground">
                {t("tournamentManager.createTournamentForm.review.name")}
              </p>
              <p className="font-medium text-foreground">{data.name}</p>
            </div>
            <div className="p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground">
                {t("tournamentManager.createTournamentForm.review.tier")}
              </p>
              <p className="font-medium text-foreground">
                {t(
                  `tournamentManager.createTournamentForm.general.tiers.${data.tier}`,
                )}
              </p>
            </div>
            <div className="p-3 bg-background rounded-md col-span-2">
              <p className="text-xs text-muted-foreground">
                {t("tournamentManager.createTournamentForm.review.location")}
              </p>
              <p className="font-medium text-foreground">{data.location}</p>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            {t("tournamentManager.createTournamentForm.review.categorySummary")}
          </h4>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-border">
              <span className="text-sm font-medium capitalize">
                {formatLabels[
                  data.category.format as keyof typeof formatLabels
                ] ?? data.category.format}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {t(
                  "tournamentManager.createTournamentForm.review.entriesCount",
                  { count: data.category.maxEntries },
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            {t(
              "tournamentManager.createTournamentForm.review.scheduleConfiguration",
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                {t(
                  "tournamentManager.createTournamentForm.review.operatingHours",
                )}
              </p>
              <p className="text-sm font-medium">
                {data.schedule.dailyStartTime} - {data.schedule.dailyEndTime}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("tournamentManager.createTournamentForm.review.tables")}
              </p>
              <p className="text-sm font-medium">
                {data.schedule.activeTables}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t(
                  "tournamentManager.createTournamentForm.review.matchDuration",
                )}
              </p>
              <p className="text-sm font-medium">
                {data.schedule.matchDurationMinutes}{" "}
                {t(
                  "tournamentManager.createTournamentForm.review.minutesShort",
                )}
              </p>
            </div>
            {data.schedule.hasBreak && (
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("tournamentManager.createTournamentForm.review.breakInfo")}
                </p>
                <p className="text-sm font-medium">
                  {data.schedule.breakStartTime} (
                  {data.schedule.breakDurationMinutes}
                  {t(
                    "tournamentManager.createTournamentForm.review.minuteShort",
                  )}
                  )
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("tournamentManager.createTournamentForm.review.back")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {isSubmitting ? (
            t("tournamentManager.createTournamentForm.review.initializing")
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              {t(
                "tournamentManager.createTournamentForm.review.initializeTournament",
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
