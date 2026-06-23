import {
  LayoutGrid,
  Trophy,
  Users,
  Info,
} from "lucide-react";
import type { Tournament } from "@/types/tournament.types";
import type { ScheduleConfigResponse } from "@/types/scheduleConfig.types";
import { useTranslation } from "react-i18next";

interface OverviewTabProps {
  tournament: Tournament;
  scheduleConfig?: ScheduleConfigResponse;
}

export default function OverviewTab({ tournament, scheduleConfig }: OverviewTabProps) {
  const { t } = useTranslation();
  const totalEntries =
    tournament.categories?.reduce(
      (sum, cat) => sum + (cat.maxEntries || 0),
      0,
    ) || 0;

  const formatTypes = Array.from(
    new Set(tournament.categories?.map((c) => c.type) || []),
  ).join(", ");

  return (
    <div className="space-y-6">
      {/* Overview Info Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.tournamentDetail.totalMaxEntries")}
            </span>
            <Users className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {totalEntries.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-chart-3">
            ~ {t("publicPlayer.tournamentDetail.basedOn", "Based on")} {tournament.categories?.length || 0} {t("publicPlayer.tournamentDetail.categoriesCount", "categories")}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.tournamentDetail.formatDetails")}
            </span>
            <Trophy className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold tracking-tight capitalize">
              {formatTypes || "N/A"}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "100%" }}></div>
          </div>
          <div className="mt-2 text-right text-xs font-medium text-muted-foreground">
            {t("publicPlayer.tournamentDetail.tierEvent", "Tier {{tier}} Event", { tier: tournament.tier ?? "-" })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.tournamentDetail.facilitySetup")}
            </span>
            <LayoutGrid className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {scheduleConfig?.numberOfTables ?? tournament.numberOfTables ?? 0}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {t("publicPlayer.tournamentDetail.tables")}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              {t("publicPlayer.tournamentDetail.groupStage", "Group Stage")}:{" "}
              {tournament.categories?.some((c) => c.isGroupStage)
                ? t("constants.yes", "Yes")
                : t("constants.no", "No")}
            </span>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">{t("publicPlayer.tournamentDetail.about")}</h3>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          {tournament.introduction ? (
            <div dangerouslySetInnerHTML={{ __html: tournament.introduction }} />
          ) : (
            <p className="leading-relaxed">
              {t("publicPlayer.tournamentDetail.welcome")} <span className="font-semibold text-foreground">{tournament.name}</span> tournament! 
              This event will take place at <span className="font-semibold text-foreground">{tournament.location || "TBD"}</span>.
              We are excited to host this competition and look forward to seeing great matches.
            </p>
          )}
        </div>
      </div>

      {/* Categories Section */}
      {tournament.categories && tournament.categories.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">{t("publicPlayer.tournamentDetail.categories")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.categories.map((category) => (
              <div key={category.id} className="rounded-lg border border-border bg-secondary/10 p-5 flex flex-col h-full hover:bg-secondary/20 transition-colors">
                <h4 className="font-bold text-base mb-3 text-primary capitalize flex items-center gap-2 border-b border-border/50 pb-2">
                  {category.name}
                </h4>
                <div className="space-y-2.5 text-sm flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.type")}</span>
                    <span className="font-semibold capitalize">{category.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.format")}</span>
                    <span className="font-semibold">
                      {category.isGroupStage ? t("publicPlayer.tournamentDetail.groupKo", "Group + KO") : t("publicPlayer.tournamentDetail.knockout", "Knockout")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.bestOf")}</span>
                    <span className="font-semibold">{category.maxSets} {t("publicPlayer.tournamentDetail.sets", "sets")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.maxEntries")}</span>
                    <span className="font-semibold">{category.maxEntries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.gender")}</span>
                    <span className="font-semibold capitalize">{category.gender}</span>
                  </div>
                  
                  {(category.minAge !== null || category.maxAge !== null) && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.ageLimit")}</span>
                      <span className="font-semibold">
                        {category.minAge ?? t("constants.any", "Any")} - {category.maxAge ?? t("constants.any", "Any")}
                      </span>
                    </div>
                  )}
                  
                  {(category.minElo !== null || category.maxElo !== null) && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.eloLimit")}</span>
                      <span className="font-semibold">
                        {category.minElo ?? "0"} - {category.maxElo ?? t("constants.max", "Max")}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("publicPlayer.tournamentDetail.entryFee")}</span>
                  <span className="font-bold text-lg text-primary">
                    {Number(category.entryFee) === 0 ? t("constants.free", "Free") : `${category.entryFee}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

