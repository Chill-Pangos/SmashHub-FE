import React from "react";
import type { StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateTournament } from "@/hooks/queries/useTournamentQueries";
import { showToast, showApiError } from "@/utils/toast.utils"; 

// ── Helpers ──────────────────────────────────────────────────────────────────

const TIER_MAP: Record<string, number> = {
  pro: 1,
  challenger: 2,
  local: 3,
};

const FORMAT_META: Record<
  string,
  {
    name: string;
    type: "single" | "double";
    gender: "male" | "female" | "mixed";
    numberOfSingles: number;
    numberOfDoubles: number;
  }
> = {
  mens_singles: {
    name: "Men's Singles",
    type: "single",
    gender: "male",
    numberOfSingles: 3,
    numberOfDoubles: 0,
  },
  womens_singles: {
    name: "Women's Singles",
    type: "single",
    gender: "female",
    numberOfSingles: 3,
    numberOfDoubles: 0,
  },
  mixed_doubles: {
    name: "Mixed Doubles",
    type: "double",
    gender: "mixed",
    numberOfSingles: 0,
    numberOfDoubles: 3,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export const StepReview: React.FC<StepProps> = ({ data, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createTournament = useCreateTournament();

  const isSubmitting = createTournament.isPending;

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

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const categoryMeta =
      FORMAT_META[data.category.format] ?? FORMAT_META.mens_singles;

    const payload = {
      name: data.name,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      tier: TIER_MAP[data.tier] ?? 3,
      status: "upcoming" as const,
      categories: [
        {
          name: categoryMeta.name,
          type: categoryMeta.type,
          gender: categoryMeta.gender,
          maxEntries: data.category.maxEntries,
          maxSets: 3,
          numberOfSingles: categoryMeta.numberOfSingles,
          numberOfDoubles: categoryMeta.numberOfDoubles,
          isGroupStage: false,
        },
      ],
    };

    try {
      await showToast.promise(createTournament.mutateAsync(payload), {
        loading: t("tournamentManager.createTournamentForm.review.initializing"),
        success: t("tournamentManager.createTournamentForm.review.successAlert"),
        error:   t("tournamentManager.createTournamentForm.review.errorAlert"),
      });

      navigate("/organizer/tournaments");
    } catch (error) {
      // showToast.promise đã hiện toast error rồi
      // showApiError để parse error code từ API response nếu muốn chi tiết hơn
      showApiError(error);
    }
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
            {t(
              "tournamentManager.createTournamentForm.review.categorySummary",
            )}
          </h4>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-border">
              <span className="text-sm font-medium">
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