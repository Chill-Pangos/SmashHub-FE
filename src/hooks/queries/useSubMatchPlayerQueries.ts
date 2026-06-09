import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subMatchPlayerService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { LineupSubmitRequest, RejectLineupRequest } from "@/types";

export const useSubMatchPlayers = (
  subMatchId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.subMatchPlayers.bySubMatch(subMatchId), { page, limit }],
    queryFn: () => subMatchPlayerService.getPlayersBySubMatch(subMatchId, page, limit),
    enabled: (options?.enabled ?? true) && subMatchId > 0,
  });
};

export const useSubMatchPlayersByTeam = (
  subMatchId: number,
  team: string,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.subMatchPlayers.bySubMatchTeam(subMatchId, team), { page, limit }],
    queryFn: () =>
      subMatchPlayerService.getPlayersBySubMatchTeam(subMatchId, team, page, limit),
    enabled: (options?.enabled ?? true) && subMatchId > 0 && !!team,
  });
};

export const useSubMatchHistoryByEntryMember = (
  entryMemberId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.subMatchPlayers.byEntryMember(entryMemberId, {
      page,
      limit,
    }),
    queryFn: () =>
      subMatchPlayerService.getHistoryByEntryMember(entryMemberId, page, limit),
    enabled: (options?.enabled ?? true) && entryMemberId > 0,
  });
};

export const usePendingLineups = () => {
  return useQuery({
    queryKey: queryKeys.subMatchPlayers.pendingLineups(),
    queryFn: () => subMatchPlayerService.getPendingLineups(),
  });
};

export const useRejectedLineups = () => {
  return useQuery({
    queryKey: queryKeys.subMatchPlayers.rejectedLineups(),
    queryFn: () => subMatchPlayerService.getRejectedLineups(),
  });
};

// ==================== Mutation Hooks ====================

export const useSubmitLineup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, data }: { matchId: number; data: LineupSubmitRequest }) =>
      subMatchPlayerService.submitLineup(matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatchPlayers.all });
    },
  });
};

export const useApproveLineups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => subMatchPlayerService.approveLineups(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatchPlayers.all });
    },
  });
};

export const useRejectLineups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, data }: { matchId: number; data: RejectLineupRequest }) =>
      subMatchPlayerService.rejectLineups(matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatchPlayers.all });
    },
  });
};
