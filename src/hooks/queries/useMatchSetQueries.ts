import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchSetService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  CreateMatchSetRequest,
  UpdateLiveScoreRequest,
  SubmitFinalScoreRequest,
  UpdateMatchSetRequest,
} from "@/types";

// ==================== Query Hooks ====================

export const useMatchSet = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.matchSets.detail(id),
    queryFn: () => matchSetService.getMatchSetById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

export const useLiveScore = (subMatchId: number, setNumber?: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...queryKeys.matchSets.byMatch(subMatchId), "live-score", setNumber],
    queryFn: () => matchSetService.getLiveScore(subMatchId, setNumber),
    enabled: (options?.enabled ?? true) && subMatchId > 0,
  });
};

export const useMatchSetsBySubMatch = (
  subMatchId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matchSets.byMatch(subMatchId, { page, limit }),
    queryFn: () => matchSetService.getMatchSetsByMatch(subMatchId, page, limit),
    enabled: (options?.enabled ?? true) && subMatchId > 0,
  });
};

// ==================== Mutation Hooks ====================

export const useCreateMatchSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchSetRequest) =>
      matchSetService.createMatchSet(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.all,
      });
      if (result.subMatchId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matchSets.byMatch(result.subMatchId),
        });
      }
    },
  });
};

export const useUpdateLiveScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLiveScoreRequest) => matchSetService.updateLiveScore(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.matchSets.byMatch(variables.subMatchId), "live-score"],
      });
    },
  });
};

export const useSubmitFinalScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitFinalScoreRequest) => matchSetService.submitFinalScore(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.byMatch(variables.subMatchId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.all,
      });
    },
  });
};

export const useUpdateMatchSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMatchSetRequest }) =>
      matchSetService.updateMatchSet(id, data),
    onSuccess: (result, { id }) => {
      queryClient.setQueryData(queryKeys.matchSets.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.lists(),
      });
      if (result.subMatchId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matchSets.byMatch(result.subMatchId),
        });
      }
    },
  });
};

export const useDeleteMatchSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matchSetService.deleteMatchSet(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.all,
      });
    },
  });
};
