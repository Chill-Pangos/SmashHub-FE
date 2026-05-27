import { useMemo } from "react";
import { useEntriesByCategory } from "./useEntryQueries";
import {
  useGroupStandingsByCategory,
  useQualifiedTeams,
} from "./useGroupStandingQueries";
import { useKnockoutBracketsByCategory } from "./useKnockoutBracketQueries";
import { usePendingMatches } from "./useMatchQueries";
import { useSchedulesByCategory } from "./useScheduleQueries";
import { useTournament, useTournaments } from "./useTournamentQueries";
import { useRefereesByTournament } from "./useTournamentRefereeQueries";

interface UseTournamentFlowSnapshotOptions {
  tournamentId?: number;
  categoryId?: number;
  enabled?: boolean;
}

interface TournamentFlowSnapshotMetric {
  id: string;
  value: number;
}

const FALLBACK_METRIC_KEYS = [
  "tournaments",
  "entries",
  "schedules",
  "matches",
  "standings",
  "brackets",
  "referees",
  "items",
] as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const extractCount = (source: unknown): number => {
  if (Array.isArray(source)) {
    return source.length;
  }

  if (!isObject(source)) {
    return 0;
  }

  if ("total" in source && typeof source.total === "number") {
    return source.total;
  }

  if ("count" in source && typeof source.count === "number") {
    return source.count;
  }

  if ("data" in source) {
    const nested = extractCount(source.data);
    if (nested > 0) {
      return nested;
    }
  }

  for (const key of FALLBACK_METRIC_KEYS) {
    if (key in source) {
      const count = extractCount(source[key]);
      if (count > 0) {
        return count;
      }
    }
  }

  return 0;
};

export const useTournamentFlowSnapshot = ({
  tournamentId,
  categoryId,
  enabled = true,
}: UseTournamentFlowSnapshotOptions) => {
  const resolvedTournamentId = tournamentId ?? 0;
  const resolvedCategoryId = categoryId ?? 0;

  const tournamentsQuery = useTournaments(0, 10);
  const tournamentDetailQuery = useTournament(resolvedTournamentId, {
    enabled: enabled && resolvedTournamentId > 0,
  });
  const refereesQuery = useRefereesByTournament(resolvedTournamentId, 0, 50, {
    enabled: enabled && resolvedTournamentId > 0,
  });
  const entriesQuery = useEntriesByCategory(resolvedCategoryId, 0, 100, {
    enabled: enabled && resolvedCategoryId > 0,
  });
  const schedulesQuery = useSchedulesByCategory(resolvedCategoryId, {
    page: 1,
    limit: 100,
    enabled: enabled && resolvedCategoryId > 0,
  });
  const pendingMatchesQuery = usePendingMatches(0, 100, { enabled });
  const groupStandingsQuery = useGroupStandingsByCategory(resolvedCategoryId, {
    enabled: enabled && resolvedCategoryId > 0,
  });
  const knockoutBracketsQuery = useKnockoutBracketsByCategory(
    resolvedCategoryId,
    {
      enabled: enabled && resolvedCategoryId > 0,
    },
  );
  const qualifiedTeamsQuery = useQualifiedTeams(resolvedCategoryId, {
    enabled: enabled && resolvedCategoryId > 0,
  });

  const metrics = useMemo<TournamentFlowSnapshotMetric[]>(
    () => [
      {
        id: "tournaments",
        value: extractCount(tournamentsQuery.data),
      },
      {
        id: "referees",
        value: extractCount(refereesQuery.data),
      },
      {
        id: "entries",
        value: extractCount(entriesQuery.data),
      },
      {
        id: "schedules",
        value: extractCount(schedulesQuery.data),
      },
      {
        id: "pendingMatches",
        value: extractCount(pendingMatchesQuery.data),
      },
      {
        id: "groupStandings",
        value: extractCount(groupStandingsQuery.data),
      },
      {
        id: "knockoutBrackets",
        value: extractCount(knockoutBracketsQuery.data),
      },
      {
        id: "qualifiedTeams",
        value: extractCount(qualifiedTeamsQuery.data),
      },
    ],
    [
      entriesQuery.data,
      groupStandingsQuery.data,
      knockoutBracketsQuery.data,
      pendingMatchesQuery.data,
      qualifiedTeamsQuery.data,
      refereesQuery.data,
      schedulesQuery.data,
      tournamentsQuery.data,
    ],
  );

  const isLoading =
    tournamentsQuery.isLoading ||
    tournamentDetailQuery.isLoading ||
    refereesQuery.isLoading ||
    entriesQuery.isLoading ||
    schedulesQuery.isLoading ||
    pendingMatchesQuery.isLoading ||
    groupStandingsQuery.isLoading ||
    knockoutBracketsQuery.isLoading ||
    qualifiedTeamsQuery.isLoading;

  const isFetching =
    tournamentsQuery.isFetching ||
    tournamentDetailQuery.isFetching ||
    refereesQuery.isFetching ||
    entriesQuery.isFetching ||
    schedulesQuery.isFetching ||
    pendingMatchesQuery.isFetching ||
    groupStandingsQuery.isFetching ||
    knockoutBracketsQuery.isFetching ||
    qualifiedTeamsQuery.isFetching;

  const errors = [
    tournamentsQuery.error,
    tournamentDetailQuery.error,
    refereesQuery.error,
    entriesQuery.error,
    schedulesQuery.error,
    pendingMatchesQuery.error,
    groupStandingsQuery.error,
    knockoutBracketsQuery.error,
    qualifiedTeamsQuery.error,
  ].filter(Boolean);

  const refetchAll = async () => {
    await Promise.all([
      tournamentsQuery.refetch(),
      tournamentDetailQuery.refetch(),
      refereesQuery.refetch(),
      entriesQuery.refetch(),
      schedulesQuery.refetch(),
      pendingMatchesQuery.refetch(),
      groupStandingsQuery.refetch(),
      knockoutBracketsQuery.refetch(),
      qualifiedTeamsQuery.refetch(),
    ]);
  };

  return {
    metrics,
    isLoading,
    isFetching,
    hasError: errors.length > 0,
    errorCount: errors.length,
    refetchAll,
    tournamentName:
      (tournamentDetailQuery.data as { name?: string } | undefined)?.name ?? "",
  };
};
