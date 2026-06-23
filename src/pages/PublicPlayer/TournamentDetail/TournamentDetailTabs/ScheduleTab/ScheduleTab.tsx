import { useEffect, useMemo, useState } from "react";
import { TournamentScheduleViewer } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchedulesByCategory } from "@/hooks/queries";
import type {
  Tournament,
  TournamentCategory,
  TournamentContent,
} from "@/types/tournament.types";
import { useTranslation } from "react-i18next";
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
    page: 1,
    limit: 100,
    enabled: selectedCategoryId > 0,
  });

  const schedulesData = schedulesQuery.data?.data;
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
            value={selectedCategoryId ? String(selectedCategoryId) : undefined}
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
          <TournamentScheduleViewer
            contentId={selectedCategoryId}
            tournamentId={tournamentId} // TRUYỀN tournamentId XUỐNG ĐÂY
            schedulesOverride={schedulesData}
          />
        )}
      </div>
    </div>
  );
}