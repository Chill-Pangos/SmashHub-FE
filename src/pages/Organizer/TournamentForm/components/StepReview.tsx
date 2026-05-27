import React from "react";
import type { StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Rocket, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateTournament } from "@/hooks/queries/useTournamentQueries";
import { showToast, showApiError } from "@/utils/toast.utils";
import type { CreateTournamentRequest } from "@/types/tournament.types"; // Đường dẫn tới file types tổng của bạn

export const StepReview: React.FC<StepProps> = ({ data, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createTournament = useCreateTournament();

  const isSubmitting = createTournament.isPending;

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    // Ép kiểu (cast) payload về đúng CreateTournamentRequest để Typescript không báo lỗi
    const payload: CreateTournamentRequest = {
      name: data.name,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "upcoming",
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
        maxMembersPerEntry: cat.maxMembersPerEntry ? Number(cat.maxMembersPerEntry) : null,
        
        gender: cat.gender,
        isGroupStage: cat.isGroupStage,
        
        // Xử lý entryFee từ string/number về number (hoặc null nếu API cho phép null)
        entryFee: cat.entryFee ? Number(cat.entryFee) : 0, 
      })),
    };

    try {
      await showToast.promise(createTournament.mutateAsync(payload), {
        loading: t("tournamentManager.createTournamentForm.review.initializing"),
        success: t("tournamentManager.createTournamentForm.review.successAlert"),
        error: t("tournamentManager.createTournamentForm.review.errorAlert"),
      });

      navigate("/organizer/tournaments");
    } catch (error) {
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