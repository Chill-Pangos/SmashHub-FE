import React from "react";
import type { StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Rocket, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateTournament, useUpdateTournament } from "@/hooks/queries/useTournamentQueries";
import { useCreateScheduleConfig, useUpdateScheduleConfig } from "@/hooks/queries/useScheduleConfigQueries";
import { showToast, showApiError } from "@/utils/toast.utils";
import type { CreateTournamentRequest, UpdateTournamentRequest } from "@/types/tournament.types";

export const StepReview: React.FC<StepProps> = ({ data, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;
  const isEditing = id > 0;

  const createTournament = useCreateTournament();
  const updateTournament = useUpdateTournament();
  const createScheduleConfig = useCreateScheduleConfig();
  const updateScheduleConfig = useUpdateScheduleConfig();

  const isSubmitting = createTournament.isPending || createScheduleConfig.isPending || updateTournament.isPending || updateScheduleConfig.isPending;

  // ── Helper ───────────────────────────────────────────────────────────────────
  const toGMT7String = (dateInput: string | Date | undefined | null) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+07:00`;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    // Ép kiểu (cast) payload về đúng dạng để Typescript không báo lỗi
    const payload: CreateTournamentRequest | UpdateTournamentRequest = {
      name: data.name,
      tier: data.tier,
      location: data.location,
      startDate: toGMT7String(data.startDate),
      endDate: toGMT7String(data.endDate),
      ...(isEditing ? {} : { status: "upcoming" as const }),
      // Map categories từ Form State về chuẩn CreateTournamentCategoryRequest
      categories: (data.categories || []).map((cat) => ({
        name: cat.name,
        type: cat.type,
        maxEntries: cat.maxEntries,
        maxSets: cat.maxSets,

        // Team Format chỉ có nếu type === "team", nếu không trả về null
        teamFormat: cat.type === "team" ? (cat.teamFormat || null) : null,

        // Theo định nghĩa CreateTournamentCategoryRequest mới nhất của bạn,
        // hai trường này BẮT BUỘC (không được null). Do đó trả về 0 nếu không phải team.
        numberOfSingles: cat.type === "team" ? Number(cat.numberOfSingles) : 0,
        numberOfDoubles: cat.type === "team" ? Number(cat.numberOfDoubles) : 0,

        minAge: cat.minAge ? Number(cat.minAge) : null,
        maxAge: cat.maxAge ? Number(cat.maxAge) : null,
        minElo: cat.minElo ? Number(cat.minElo) : null,
        maxElo: cat.maxElo ? Number(cat.maxElo) : null,
        maxMembersPerEntry:
          cat.type === "team"
            ? cat.maxMembersPerEntry !== null
              ? Number(cat.maxMembersPerEntry)
              : null
            : null,

        gender: cat.gender,
        isGroupStage: cat.isGroupStage,

        // Xử lý entryFee từ string/number về number (hoặc null nếu API cho phép null)
        entryFee: (() => {
          // 1. Kiểm tra xem có bị dính mảng (Array) từ Slider không
          let rawValue = Array.isArray(cat.entryFee) ? cat.entryFee[0] : cat.entryFee;

          // 2. Ép kiểu an toàn về số nguyên
          let numericValue = Number(rawValue);

          // 3. Nếu bị NaN (do chuỗi rác) hoặc falsy, trả về 0
          if (Number.isNaN(numericValue) || !numericValue) {
            return 0;
          }

          return numericValue;
        })(),
      })),
    };

    try {
      const toastId = showToast.loading(isEditing ? "Đang cập nhật giải đấu..." : t("tournamentManager.createTournamentForm.review.initializing"));
      
      let targetTournamentId = id;
      if (isEditing) {
        await updateTournament.mutateAsync({ id, data: payload as UpdateTournamentRequest });
      } else {
        const tournamentRes = await createTournament.mutateAsync(payload as CreateTournamentRequest);
        targetTournamentId = tournamentRes.id;
      }

      const parseTimeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const lunchBreakStartMinutes = data.schedule.hasBreak ? parseTimeToMinutes(data.schedule.breakStartTime) : null;
      const lunchBreakEndMinutes = lunchBreakStartMinutes !== null ? lunchBreakStartMinutes + data.schedule.breakDurationMinutes : null;

      const schedulePayload = {
        startDate: toGMT7String(data.startDate),
        endDate: toGMT7String(data.endDate),
        registrationStartDate: toGMT7String(data.registrationStartDate),
        registrationEndDate: toGMT7String(data.registrationEndDate),
        bracketGenerationDate: toGMT7String(data.bracketGenerationDate),
        numberOfTables: Number(data.schedule.activeTables),
        matchDurationMinutes: Number(data.schedule.matchDurationMinutes),
        breakDurationMinutes: 10,
        dailyStartHour: parseInt(data.schedule.dailyStartTime.split(":")[0]),
        dailyStartMinute: parseInt(data.schedule.dailyStartTime.split(":")[1]),
        dailyEndHour: parseInt(data.schedule.dailyEndTime.split(":")[0]),
        dailyEndMinute: parseInt(data.schedule.dailyEndTime.split(":")[1]),
        lunchBreakStartHour: lunchBreakStartMinutes !== null ? Math.floor(lunchBreakStartMinutes / 60) : null,
        lunchBreakStartMinute: lunchBreakStartMinutes !== null ? lunchBreakStartMinutes % 60 : null,
        lunchBreakEndHour: lunchBreakEndMinutes !== null ? Math.floor(lunchBreakEndMinutes / 60) : null,
        lunchBreakEndMinute: lunchBreakEndMinutes !== null ? lunchBreakEndMinutes % 60 : null,
        lunchBreakDurationMinutes: data.schedule.hasBreak ? data.schedule.breakDurationMinutes : null,
        notes: data.schedule.notes || "",
      };

      if (isEditing) {
        await updateScheduleConfig.mutateAsync({
          tournamentId: targetTournamentId,
          data: schedulePayload
        });
      } else {
        await createScheduleConfig.mutateAsync({
          tournamentId: targetTournamentId,
          ...schedulePayload
        });
      }

      showToast.dismiss(toastId);
      showToast.success(t("tournamentManager.createTournamentForm.review.successAlert"));

      navigate("/organizer/tournaments");
    } catch (error) {
      showToast.dismiss(); // dismiss all loading toasts just in case
      showApiError(error);
    }
  };

  // ── Render Helpers ───────────────────────────────────────────────────────────

  const getTierName = (tier: number) => {
    if (tier === 1) return t("tournamentManager.createTournamentForm.general.tiers.pro");
    if (tier === 2) return t("tournamentManager.createTournamentForm.general.tiers.challenger");
    return t("tournamentManager.createTournamentForm.general.tiers.local");
  };

  const getTypeName = (type: string) => {
    if (type === "single") return "Đơn";
    if (type === "double") return "Đôi";
    if (type === "team") return "Đồng đội";
    return type;
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
      {/* System ready banner */}
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

      {/* Summary card */}
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
              <p className="font-medium text-foreground capitalize">
                {getTierName(data.tier)}
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

        {/* Categories Dynamic Render */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Danh sách hạng mục ({data.categories?.length || 0})
          </h4>
          <div className="space-y-3">
            {(data.categories || []).map((cat, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-background rounded-md border border-border gap-2"
              >
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Thể thức: {getTypeName(cat.type)} • Giới tính:{" "}
                    <span className="capitalize">{cat.gender}</span> • Lộ trình:{" "}
                    {cat.isGroupStage ? "Có vòng bảng" : "Knockout"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                    BO{cat.maxSets}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                    Max: {cat.maxEntries} slot
                  </span>
                </div>
              </div>
            ))}
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
                {data.schedule.dailyStartTime} – {data.schedule.dailyEndTime}
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
                  {t(
                    "tournamentManager.createTournamentForm.review.breakInfo",
                  )}
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

      {/* Footer actions */}
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
              {isEditing ? "Cập nhật giải đấu" : t("tournamentManager.createTournamentForm.review.initializeTournament")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};