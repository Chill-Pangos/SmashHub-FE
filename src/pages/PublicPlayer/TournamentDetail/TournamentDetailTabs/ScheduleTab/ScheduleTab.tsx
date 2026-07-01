import { useEffect, useMemo, useState } from "react";
import { TournamentScheduleViewer, MatchListView } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSchedulesByCategory } from "@/hooks/queries";
import type {
  Tournament,
  TournamentCategory,
  TournamentContent,
} from "@/types/tournament.types";
import type { ScheduleStage } from "@/types/schedule.types";
import { useTranslation } from "react-i18next";
import ServerPagination from "@/components/custom/ServerPagination";
import type { ScheduleConfigResponse } from "@/types/scheduleConfig.types";
import PublicScheduleView from "../../PublicScheduleView";

interface ScheduleTabProps {
  tournamentId: number;
  tournament: Tournament;
  scheduleConfig?: ScheduleConfigResponse;
}

type ScheduleOption = {
  id: number;
  label: string;
  isGroupStage?: boolean;
};

const buildOptions = (tournament: Tournament): ScheduleOption[] => {
  const categories = tournament.categories ?? [];
  const contents = tournament.contents ?? [];
  const source: Array<TournamentCategory | TournamentContent> =
    categories.length > 0 ? categories : contents;

  return source
    .filter((item) => typeof item.id === "number")
    .map((item) => {
      const typeLabel = item.type ? ` (${item.type})` : "";
      const nameLabel = item.name?.trim() || `Category ${item.id}`;
      return {
        id: item.id as number,
        label: `${nameLabel}${typeLabel}`,
        isGroupStage: item.isGroupStage,
      };
    });
};

export default function ScheduleTab({
  tournamentId,
  tournament,
  scheduleConfig,
}: ScheduleTabProps) {
  const { t } = useTranslation();
  const options = useMemo(() => buildOptions(tournament), [tournament]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [stage, setStage] = useState<ScheduleStage | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [subTab, setSubTab] = useState<"list" | "bracket">("list");

  useEffect(() => {
    if (options.length === 0) {
      if (selectedCategoryId !== 0) {
        setSelectedCategoryId(0);
      }
      return;
    }

    if (!options.some((option) => option.id === selectedCategoryId)) {
      setSelectedCategoryId(options[0].id);
    }
  }, [options, selectedCategoryId]);

  const schedulesQuery = useSchedulesByCategory(selectedCategoryId, {
    stage: stage,
    page: page,
    limit: limit,
    enabled: selectedCategoryId > 0,
  });

  const schedulesData = schedulesQuery.data?.data;
  const pagination = schedulesData?.pagination;
  const scheduleCount = schedulesData?.schedules?.length ?? 0;
  
  const hasSchedule = scheduleCount > 0;
  const isLoading = schedulesQuery.isLoading;
  const error = schedulesQuery.error;

  return (
    <div className="space-y-8">
      {scheduleConfig && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <PublicScheduleView config={scheduleConfig} />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{t("publicPlayer.tournamentDetail.scheduleTab.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("publicPlayer.tournamentDetail.scheduleTab.selectCategoryToView")}
          </p>
        </div>
        {options.length > 0 && (
          <Select
            value={selectedCategoryId ? String(selectedCategoryId) : ""}
            onValueChange={(value) => setSelectedCategoryId(Number(value))}
          >
            <SelectTrigger className="min-w-[220px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {options.length > 0 && selectedCategoryId > 0 && (
          <div className="flex gap-2">
            <Select
              value={stage || "all"}
              onValueChange={(val) => {
                setStage(val === "all" ? undefined : (val as ScheduleStage));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("components.tournamentScheduleViewer.allStages", "All Stages")}</SelectItem>
                <SelectItem value="group">{t("components.tournamentScheduleViewer.groupStage", "Group Stage")}</SelectItem>
                <SelectItem value="knockout">{t("components.tournamentScheduleViewer.knockout", "Knockout")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {options.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
          {t("publicPlayer.tournamentDetail.scheduleTab.noCategories")}
        </div>
      )}

      {options.length > 0 && !selectedCategoryId && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
          Select a category to continue.
        </div>
      )}

      {options.length > 0 && selectedCategoryId > 0 && isLoading && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        </div>
      )}

      {options.length > 0 && selectedCategoryId > 0 && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {t("publicPlayer.tournamentDetail.scheduleTab.failedToLoad")}
        </div>
      )}

      {options.length > 0 &&
        selectedCategoryId > 0 &&
        !isLoading &&
        !error &&
        !hasSchedule && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
            {t("publicPlayer.tournamentDetail.scheduleTab.notGenerated")}
          </div>
        )}

      {options.length > 0 &&
        selectedCategoryId > 0 &&
        !isLoading &&
        !error &&
        hasSchedule && (
          <div className="space-y-8">
            <div className="flex gap-2 border-b border-border pb-4 mb-6">
              <Button
                variant={subTab === "list" ? "default" : "outline"}
                onClick={() => setSubTab("list")}
              >
                {t("publicPlayer.tournamentDetail.scheduleTab.matchList", "Match List")}
              </Button>
              <Button
                variant={subTab === "bracket" ? "default" : "outline"}
                onClick={() => setSubTab("bracket")}
              >
                {t("publicPlayer.tournamentDetail.scheduleTab.tournamentBracket", "Tournament Bracket")}
              </Button>
            </div>

            {subTab === "list" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{t("publicPlayer.tournamentDetail.scheduleTab.matchList", "Match List")}</h3>
                  <span className="px-2 py-1 text-xs font-semibold rounded-md bg-secondary text-muted-foreground">
                    {pagination?.total || 0} {t("publicPlayer.tournamentDetail.scheduleTab.matchesCount", "Matches")}
                  </span>
                </div>
                <MatchListView schedules={schedulesData?.schedules || []} />
                
                {pagination && (
                  <div className="mt-6">
                    <ServerPagination
                      skip={(page - 1) * limit}
                      limit={limit}
                      total={pagination.total}
                      hasNext={pagination.hasNextPage}
                      hasPrevious={pagination.hasPrevPage}
                      isLoading={isLoading}
                      onSkipChange={(nextSkip) => setPage(Math.floor(nextSkip / limit) + 1)}
                      onLimitChange={(nextLimit) => {
                        setLimit(nextLimit);
                        setPage(1);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {subTab === "bracket" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg font-bold mb-6">{t("publicPlayer.tournamentDetail.scheduleTab.tournamentBracket", "Tournament Bracket")}</h3>
                <TournamentScheduleViewer
                  contentId={selectedCategoryId}
                  tournamentId={tournamentId} 
                  schedulesOverride={schedulesData}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}