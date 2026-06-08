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


interface ScheduleTabProps {
  tournamentId: number;
  tournament: Tournament;
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
}: ScheduleTabProps) {
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

  // Cờ kiểm tra xem có phải đang ở Mock Mode không
  const isMockMode = tournamentId === 1;

  const schedulesQuery = useSchedulesByCategory(selectedCategoryId, {
    page: 1,
    limit: 100,
    // Tắt gọi API nếu đang ở Mock Mode
    enabled: selectedCategoryId > 0 && !isMockMode,
  });

  const schedulesData = schedulesQuery.data?.data;
  const scheduleCount = schedulesData?.schedules?.length ?? 0;
  
  // Ép trạng thái UI theo Mock Mode hoặc Data thật
  const hasSchedule = isMockMode ? true : scheduleCount > 0;
  const isLoading = isMockMode ? false : schedulesQuery.isLoading;
  const error = isMockMode ? null : schedulesQuery.error;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Select a category to view its schedule.
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
          No categories are available yet.
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
          Failed to load schedule for this category.
        </div>
      )}

      {options.length > 0 &&
        selectedCategoryId > 0 &&
        !isLoading &&
        !error &&
        !hasSchedule && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
            Schedule has not been generated for this category yet.
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
  );
}