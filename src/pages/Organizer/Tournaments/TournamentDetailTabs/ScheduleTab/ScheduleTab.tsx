import { useEffect, useMemo, useState } from "react";
import { TournamentScheduleViewer } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSchedulesByCategory, useKnockoutBracketTreeByCategory, useBulkStartMatches } from "@/hooks/queries";
import type {
  Tournament,
  TournamentCategory,
  TournamentContent,
} from "@/types/tournament.types";
import ScheduleGeneration from "../ScheduleGeneration";
import { useTranslation } from "react-i18next";
import { showToast, showApiError } from "@/utils/toast.utils";

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
  const { t } = useTranslation();
  const options = useMemo(() => buildOptions(tournament), [tournament]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [showRegenerateWizard, setShowRegenerateWizard] = useState(false);

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
    setShowRegenerateWizard(false);
  }, [options, selectedCategoryId]);

  const schedulesQuery = useSchedulesByCategory(selectedCategoryId, {
    page: 1,
    limit: 100,
    enabled: selectedCategoryId > 0,
  });

  const bracketQuery = useKnockoutBracketTreeByCategory(selectedCategoryId, {
    enabled: selectedCategoryId > 0,
  });

  const { mutate: bulkStartMatches, isPending: isBulkStarting } = useBulkStartMatches();

  const schedulesData = schedulesQuery.data?.data;
  const scheduleCount = schedulesData?.schedules?.length ?? 0;
  
  const bracketData = bracketQuery.data?.data;
  const hasBracket = !!bracketData && bracketData.rounds && bracketData.rounds.length > 0;

  const hasSchedule = scheduleCount > 0;
  const isLoading = schedulesQuery.isLoading || bracketQuery.isLoading;
  const error = schedulesQuery.error;

  const handleBulkStart = () => {
    if (!schedulesData?.schedules) return;
    const matchIds = schedulesData.schedules
      .filter((s: any) => s.match && s.match.status === "scheduled")
      .map((s: any) => s.match.id);
      
    if (matchIds.length === 0) {
      showToast.info(t('tournamentManager.scheduleTab.noScheduledMatches', 'No scheduled matches to start.'));
      return;
    }
    
    bulkStartMatches({ matchIds }, {
      onSuccess: () => {
        showToast.success(t('tournamentManager.scheduleTab.bulkStartSuccess', 'Matches started successfully.'));
      },
      onError: (err: any) => showApiError(err, t('tournamentManager.scheduleTab.bulkStartError', 'Failed to start matches.'))
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{t('tournamentManager.scheduleTab.title', 'Schedule')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('tournamentManager.scheduleTab.subtitle', 'Select a category to view or generate a schedule.')}
          </p>
        </div>
        {options.length > 0 && (
          <Select
            value={selectedCategoryId ? String(selectedCategoryId) : ""}
            onValueChange={(value) => setSelectedCategoryId(Number(value))}
          >
            <SelectTrigger className="min-w-[220px]">
              <SelectValue placeholder={t('tournamentManager.scheduleTab.selectCategory', 'Select category')} />
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
          {t('tournamentManager.scheduleTab.noCategories', 'No categories are available yet. Add categories before generating schedules.')}
        </div>
      )}

      {options.length > 0 && !selectedCategoryId && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
          {t('tournamentManager.scheduleTab.selectCategoryToContinue', 'Select a category to continue.')}
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

      {options.length > 0 && selectedCategoryId > 0 && error && !(!hasSchedule || error) && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {t('tournamentManager.scheduleTab.failedToLoad', 'Failed to load schedule for this category.')}
        </div>
      )}

      {options.length > 0 &&
        selectedCategoryId > 0 &&
        !isLoading &&
        (!hasSchedule || error) && (
          <div className="space-y-8">
            <ScheduleGeneration
              tournamentId={tournamentId}
              categoryId={selectedCategoryId}
              isGroupStage={options.find(o => o.id === selectedCategoryId)?.isGroupStage}
              hasBracket={hasBracket}
            />
            {hasBracket && (
              <TournamentScheduleViewer
                contentId={selectedCategoryId}
                tournamentId={tournamentId}
                schedulesOverride={schedulesData}
                bracketOverride={bracketData}
              />
            )}
          </div>
        )}

      {options.length > 0 &&
        selectedCategoryId > 0 &&
        !isLoading &&
        !error &&
        hasSchedule && (
          <div className="space-y-8">
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRegenerateWizard(!showRegenerateWizard)}
              >
                {showRegenerateWizard ? t('tournamentManager.scheduleTab.hideRegenerate', 'Hide Regenerate Options') : t('tournamentManager.scheduleTab.regenerateSchedule', 'Regenerate Schedule')}
              </Button>
              <Button 
                onClick={handleBulkStart}
                disabled={isBulkStarting}
              >
                {isBulkStarting ? t('common.starting', 'Starting...') : t('tournamentManager.scheduleTab.bulkStartMatches', 'Bulk Start Matches')}
              </Button>
            </div>
            
            {showRegenerateWizard && (
              <ScheduleGeneration
                tournamentId={tournamentId}
                categoryId={selectedCategoryId}
                isGroupStage={options.find(o => o.id === selectedCategoryId)?.isGroupStage}
                hasBracket={hasBracket}
              />
            )}
            
            <TournamentScheduleViewer
              contentId={selectedCategoryId}
              tournamentId={tournamentId}
              schedulesOverride={schedulesData}
              bracketOverride={bracketData}
            />
          </div>
        )}
    </div>
  );
}