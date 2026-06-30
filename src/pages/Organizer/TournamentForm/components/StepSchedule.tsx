import React, { useState } from "react";
import type { StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  Clock,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useValidateScheduleConfig } from "@/hooks/queries/useScheduleConfigQueries";
import { extractScheduleTimezone } from "@/utils/timezone.utils";

import { useFormContext } from "react-hook-form";

export const StepSchedule: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();
  const form = useFormContext();
  const [isValidated, setIsValidated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccessMessage, setValidationSuccessMessage] = useState<string | null>(null);

  const parseTimeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const validateSchedule = () => {
    const matchDurationMinutes = Number(data.schedule.matchDurationMinutes);
    const dailyStartMinutes = parseTimeToMinutes(data.schedule.dailyStartTime);
    const dailyEndMinutes = parseTimeToMinutes(data.schedule.dailyEndTime);

    if (dailyStartMinutes === null || dailyEndMinutes === null) return t("tournamentManager.createTournamentForm.schedule.validation.dailyTimeInvalid");
    if (dailyStartMinutes >= dailyEndMinutes) return t("tournamentManager.createTournamentForm.schedule.validation.dailyTimeOrderInvalid");

    const operatingWindowMinutes = dailyEndMinutes - dailyStartMinutes;
    if (operatingWindowMinutes < matchDurationMinutes) return t("tournamentManager.createTournamentForm.schedule.validation.operatingWindowTooShort");

    if (data.schedule.hasBreak) {
      const breakStartMinutes = parseTimeToMinutes(data.schedule.breakStartTime);
      const breakDurationMinutes = Number(data.schedule.breakDurationMinutes);
      if (breakStartMinutes === null) return t("tournamentManager.createTournamentForm.schedule.validation.breakStartInvalid");
      
      const breakEndMinutes = breakStartMinutes + breakDurationMinutes;
      if (breakStartMinutes < dailyStartMinutes || breakEndMinutes > dailyEndMinutes) {
        return t("tournamentManager.createTournamentForm.schedule.validation.breakOutsideWindow");
      }
    }
    return null;
  };

  const { mutateAsync: validateConfig } = useValidateScheduleConfig();

  const handleValidate = async () => {
    setValidationError(null);
    setIsValidated(false);

    const isValid = await form.trigger("schedule");
    if (!isValid) {
      const errors = form.formState.errors.schedule as any;
      let firstErrorMessage = t("tournamentManager.createTournamentForm.schedule.validation.checkFields", "Vui lòng kiểm tra lại các cấu hình thời gian.");
      const getFirstError = (obj: any): string | undefined => {
        for (const key in obj) {
          if (obj[key]?.message) return obj[key].message;
          if (typeof obj[key] === "object") {
            const nested = getFirstError(obj[key]);
            if (nested) return nested;
          }
        }
      };
      const err = getFirstError(errors);
      if (err) firstErrorMessage = err;
      setValidationError(firstErrorMessage);
      return;
    }

    const localError = validateSchedule();
    if (localError) {
      setValidationError(localError);
      return;
    }

    setIsChecking(true);
    try {
      const lunchBreakStartMinutes = data.schedule.hasBreak ? parseTimeToMinutes(data.schedule.breakStartTime) : null;
      const lunchBreakEndMinutes = lunchBreakStartMinutes !== null ? lunchBreakStartMinutes + data.schedule.breakDurationMinutes : null;

      const dailyStartLocalHour = parseInt(data.schedule.dailyStartTime.split(":")[0]);
      const dailyStartLocalMinute = parseInt(data.schedule.dailyStartTime.split(":")[1]);
      const dailyEndLocalHour = parseInt(data.schedule.dailyEndTime.split(":")[0]);
      const dailyEndLocalMinute = parseInt(data.schedule.dailyEndTime.split(":")[1]);

      const startUtc = extractScheduleTimezone(dailyStartLocalHour, dailyStartLocalMinute);
      const endUtc = extractScheduleTimezone(dailyEndLocalHour, dailyEndLocalMinute);

      let lunchStartUtc = { hour: null, minute: null };
      let lunchEndUtc = { hour: null, minute: null };

      if (lunchBreakStartMinutes !== null && lunchBreakEndMinutes !== null) {
        lunchStartUtc = extractScheduleTimezone(Math.floor(lunchBreakStartMinutes / 60), lunchBreakStartMinutes % 60) as any;
        lunchEndUtc = extractScheduleTimezone(Math.floor(lunchBreakEndMinutes / 60), lunchBreakEndMinutes % 60) as any;
      }

      const res = await validateConfig({
        category: {
          maxEntries: (data.categories || []).reduce((acc: any, cat: any) => acc + (cat.maxEntries || 0), 0),
          isGroupStage: (data.categories || []).some((cat: any) => cat.isGroupStage),
        },
        scheduleConfig: {
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          registrationStartDate: new Date(data.registrationStartDate).toISOString(),
          registrationEndDate: new Date(data.registrationEndDate).toISOString(),
          bracketGenerationDate: new Date(data.bracketGenerationDate).toISOString(),
          numberOfTables: Number(data.schedule.activeTables),
          matchDurationMinutes: Number(data.schedule.matchDurationMinutes),
          breakDurationMinutes: 10,
          dailyStartHour: startUtc.hour,
          dailyStartMinute: startUtc.minute,
          dailyEndHour: endUtc.hour,
          dailyEndMinute: endUtc.minute,
          lunchBreakStartHour: lunchStartUtc.hour,
          lunchBreakStartMinute: lunchStartUtc.minute,
          lunchBreakEndHour: lunchEndUtc.hour,
          lunchBreakEndMinute: lunchEndUtc.minute,
          lunchBreakDurationMinutes: data.schedule.hasBreak ? data.schedule.breakDurationMinutes : null,
          timeZone: "UTC",
          notes: data.schedule.notes || "",
        }
      });

      if (res.isValid) {
        setIsValidated(true);
        setValidationSuccessMessage(res.message || null);
      } else {
        setValidationError(res.message || "Invalid schedule configuration.");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to validate schedule configuration.";
      setValidationError(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  const schedule = data.schedule;
  const updateSchedule = (fields: Partial<typeof schedule>) => {
    updateData({ schedule: { ...schedule, ...fields } });
    setIsValidated(false); // Re-validate if data changes
    setValidationError(null);
    setValidationSuccessMessage(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Parameters */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Settings className="w-5 h-5" />
              <h3 className="font-semibold">
                {t(
                  "tournamentManager.createTournamentForm.schedule.globalParameters",
                )}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.activeTables",
                  )}
                </Label>
                <Input
                  type="number"
                  value={schedule.activeTables}
                  onChange={(e) =>
                    updateSchedule({ activeTables: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.matchDuration",
                  )}
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    min={30}
                    max={90}
                    step={1}
                    value={[schedule.matchDurationMinutes]}
                    onValueChange={([val]) => updateSchedule({ matchDurationMinutes: val })}
                    className="flex-1"
                  />
                  <span className="w-10 text-sm font-medium">{schedule.matchDurationMinutes}p</span>
                </div>
              </div>
            </div>
          </section>

          {/* Operating Hours */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <h3 className="font-semibold">
                {t(
                  "tournamentManager.createTournamentForm.schedule.operatingHours",
                )}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.facilityOpen",
                  )}
                </Label>
                <Input
                  type="time"
                  value={schedule.dailyStartTime}
                  onChange={(e) =>
                    updateSchedule({ dailyStartTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.facilityClose",
                  )}
                </Label>
                <Input
                  type="time"
                  value={schedule.dailyEndTime}
                  onChange={(e) =>
                    updateSchedule({ dailyEndTime: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* Scheduled Breaks */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Utensils className="w-5 h-5" />
                <h3 className="font-semibold">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.scheduledBreaks",
                  )}
                </h3>
              </div>
              <Switch
                checked={schedule.hasBreak}
                onCheckedChange={(val: boolean) =>
                  updateSchedule({ hasBreak: val })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 animate-in fade-in">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.breakStartTime",
                  )}
                </Label>
                <Input
                  type="time"
                  disabled={!schedule.hasBreak}
                  value={schedule.breakStartTime}
                  onChange={(e) =>
                    updateSchedule({ breakStartTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  {t(
                    "tournamentManager.createTournamentForm.schedule.breakDuration",
                  )}
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    min={0}
                    max={90}
                    step={1}
                    disabled={!schedule.hasBreak}
                    value={[schedule.breakDurationMinutes]}
                    onValueChange={([val]) => updateSchedule({ breakDurationMinutes: val })}
                    className="flex-1"
                  />
                  <span className="w-10 text-sm font-medium text-muted-foreground">{schedule.breakDurationMinutes}p</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                onClick={handleValidate}
                disabled={isChecking}
              >
                {isChecking
                  ? t(
                      "tournamentManager.createTournamentForm.schedule.validating",
                    )
                  : t(
                      "tournamentManager.createTournamentForm.schedule.validateConfiguration",
                    )}
              </Button>
            </div>
          </section>
        </div>

        {/* Right Col: Validation Engine */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-xl border border-border bg-card/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-sm">
                {t(
                  "tournamentManager.createTournamentForm.schedule.validationEngine",
                )}
              </h3>
              <span
                className={`text-[10px] uppercase px-2 py-1 rounded-full font-semibold ${isValidated ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                {isValidated
                  ? t(
                      "tournamentManager.createTournamentForm.schedule.systemReady",
                    )
                  : t(
                      "tournamentManager.createTournamentForm.schedule.pending",
                    )}
              </span>
            </div>

            {isValidated ? (
              <div className="flex-1 space-y-6">
                <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <CheckCircle2 className="w-12 h-12 text-primary mb-2" />
                  <h4 className="font-bold text-lg text-foreground">
                    {t(
                      "tournamentManager.createTournamentForm.schedule.configurationValid",
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {validationSuccessMessage || t(
                      "tournamentManager.createTournamentForm.schedule.configurationValidDescription",
                    )}
                  </p>
                </div>

                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {t(
                          "tournamentManager.createTournamentForm.schedule.capacityResolution",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "tournamentManager.createTournamentForm.schedule.capacityResolutionDescription",
                          { activeTables: schedule.activeTables },
                        )}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {t(
                          "tournamentManager.createTournamentForm.schedule.timeConstraints",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "tournamentManager.createTournamentForm.schedule.timeConstraintsDescription",
                          {
                            start: schedule.dailyStartTime,
                            end: schedule.dailyEndTime,
                          },
                        )}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-chart-4">
                        {t(
                          "tournamentManager.createTournamentForm.schedule.marginWarning",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "tournamentManager.createTournamentForm.schedule.marginWarningDescription",
                        )}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                {validationError ? (
                  <div className="w-full rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive text-left">
                    <div className="flex items-center gap-2 mb-2 font-medium">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <p>
                        {t(
                          "tournamentManager.createTournamentForm.schedule.validation.title",
                        )}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{validationError}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "tournamentManager.createTournamentForm.schedule.validationHint",
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("tournamentManager.createTournamentForm.schedule.back")}
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValidated}
          className="bg-primary text-primary-foreground px-8"
        >
          {isValidated
            ? t("tournamentManager.createTournamentForm.schedule.next")
            : t(
                "tournamentManager.createTournamentForm.schedule.validateToContinue",
              )}
        </Button>
      </div>
    </div>
  );
};
