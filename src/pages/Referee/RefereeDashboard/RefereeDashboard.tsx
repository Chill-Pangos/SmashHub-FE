import { useMemo } from "react";
import { showToast } from "@/utils/toast.utils";
import type { Match, MatchSet } from "@/types";
import { RefereeStats, ActiveMatch, UpcomingMatches } from "./components";
import {
  useMatchesByStatus,
  useMatchSetsByMatch,
  useCreateMatchSetWithScore,
  useFinalizeMatch,
} from "@/hooks/queries";
import { useTranslation } from "@/hooks/useTranslation";

interface UpcomingMatch {
  match: Match;
  entryAName?: string;
  entryBName?: string;
  contentName?: string;
}

export default function RefereeDashboard() {
  const { t } = useTranslation();

  // Fetch matches by status using React Query
  const { data: scheduledResponse, isLoading: isLoadingScheduled } =
    useMatchesByStatus("scheduled", 0, 50);

  const { data: inProgressResponse, isLoading: isLoadingInProgress } =
    useMatchesByStatus("in_progress", 0, 50);

  const { data: completedResponse, isLoading: isLoadingCompleted } =
    useMatchesByStatus("completed", 0, 50);

  // Extract matches from responses
  const scheduledMatches = useMemo(() => {
    if (!scheduledResponse) return [];
    return Array.isArray(scheduledResponse)
      ? scheduledResponse
      : scheduledResponse.data || [];
  }, [scheduledResponse]);

  const inProgressMatches = useMemo(() => {
    if (!inProgressResponse) return [];
    return Array.isArray(inProgressResponse)
      ? inProgressResponse
      : inProgressResponse.data || [];
  }, [inProgressResponse]);

  const completedMatches = useMemo(() => {
    if (!completedResponse) return [];
    return Array.isArray(completedResponse)
      ? completedResponse
      : completedResponse.data || [];
  }, [completedResponse]);

  // Derive active match (first in_progress match)
  const activeMatch: Match | null = inProgressMatches[0] || null;

  // Fetch match sets for active match
  const { data: matchSetsResponse } = useMatchSetsByMatch(
    activeMatch?.id || 0,
    0,
    10,
    { enabled: !!activeMatch },
  );

  const matchSets: MatchSet[] = useMemo(() => {
    if (!matchSetsResponse) return [];
    return Array.isArray(matchSetsResponse)
      ? matchSetsResponse
      : matchSetsResponse.data || [];
  }, [matchSetsResponse]);

  // Derive upcoming matches
  const upcomingMatches: UpcomingMatch[] = useMemo(() => {
    return scheduledMatches.map((match: Match) => ({
      match,
      entryAName: `Entry ${match.entryAId}`,
      entryBName: `Entry ${match.entryBId}`,
    }));
  }, [scheduledMatches]);

  // Calculate stats
  const stats = useMemo(
    () => ({
      totalMatches:
        scheduledMatches.length +
        inProgressMatches.length +
        completedMatches.length,
      completedMatches: completedMatches.length,
      pendingMatches: completedMatches.filter(
        (m: Match) => m.resultStatus === "pending",
      ).length,
      upcomingMatches: scheduledMatches.length,
    }),
    [scheduledMatches, inProgressMatches, completedMatches],
  );

  const isLoading =
    isLoadingScheduled || isLoadingInProgress || isLoadingCompleted;

  // Mutations
  const createMatchSetWithScore = useCreateMatchSetWithScore();
  const finalizeMatchMutation = useFinalizeMatch();

  // Add score for a set
  const handleAddScore = async (entryAScore: number, entryBScore: number) => {
    if (!activeMatch) return;

    createMatchSetWithScore.mutate(
      {
        matchId: activeMatch.id,
        entryAScore,
        entryBScore,
      },
      {
        onSuccess: (response) => {
          const newSet: MatchSet =
            "data" in response && response.data
              ? response.data
              : (response as unknown as MatchSet);
          showToast.success(
            t("common.success"),
            t("referee.scoreRecorded", { setNumber: newSet.setNumber }),
          );
        },
        onError: (error) => {
          console.error("Error adding score:", error);
          showToast.error(t("common.error"), t("referee.cannotRecordScore"));
        },
      },
    );
  };

  // Finalize match
  const handleFinalizeMatch = async () => {
    if (!activeMatch) return;

    finalizeMatchMutation.mutate(activeMatch.id, {
      onSuccess: () => {
        showToast.success(
          t("common.success"),
          t("referee.matchEndedAwaitingApproval"),
        );
      },
      onError: (error) => {
        console.error("Error finalizing match:", error);
        showToast.error(t("common.error"), t("referee.cannotEndMatch"));
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("referee.refereeDashboard")}
          </h1>
          <p className="text-muted-foreground">
            {t("referee.manageAssignedMatches")}
          </p>
        </div>
      </div>

      <RefereeStats {...stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveMatch
          match={activeMatch}
          matchSets={matchSets}
          entryAName={activeMatch ? `Entry ${activeMatch.entryAId}` : undefined}
          entryBName={activeMatch ? `Entry ${activeMatch.entryBId}` : undefined}
          maxSets={3}
          onAddScore={handleAddScore}
          onFinalize={handleFinalizeMatch}
          isAddingScore={createMatchSetWithScore.isPending}
          isFinalizing={finalizeMatchMutation.isPending}
        />

        <UpcomingMatches matches={upcomingMatches} isLoading={isLoading} />
      </div>
    </div>
  );
}
