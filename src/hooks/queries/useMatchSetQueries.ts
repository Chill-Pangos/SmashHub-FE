import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchSetService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  MatchSet,
  CreateMatchSetRequest,
  CreateMatchSetWithScoreRequest,
  UpdateMatchSetRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả match sets với pagination
 */
export const useMatchSets = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.matchSets.list({ skip, limit }),
    queryFn: () => matchSetService.getAllMatchSets(skip, limit),
  });
};

/**
 * Hook để lấy match set theo ID
 */
export const useMatchSet = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.matchSets.detail(id),
    queryFn: () => matchSetService.getMatchSetById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy match sets theo match ID
 */
export const useMatchSetsByMatch = (
  matchId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matchSets.byMatch(matchId),
    queryFn: () => matchSetService.getMatchSetsByMatch(matchId, skip, limit),
    enabled: (options?.enabled ?? true) && matchId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo match set mới
 */
export const useCreateMatchSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchSetRequest) =>
      matchSetService.createMatchSet(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.all,
      });
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matchSets.byMatch(result.data.matchId),
        });
        // Also invalidate related match
        queryClient.invalidateQueries({
          queryKey: queryKeys.matches.detail(result.data.matchId),
        });
      }
    },
  });
};

/**
 * Hook để tạo match set với score (recommended)
 */
export const useCreateMatchSetWithScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchSetWithScoreRequest) =>
      matchSetService.createMatchSetWithScore(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.all,
      });
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matchSets.byMatch(result.data.matchId),
        });
        // Also invalidate related match
        queryClient.invalidateQueries({
          queryKey: queryKeys.matches.detail(result.data.matchId),
        });
      }
    },
  });
};

/**
 * Hook để cập nhật match set
 */
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
      // Also invalidate related match
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matches.detail(result.data.matchId),
        });
      }
    },
  });
};

/**
 * Hook để xóa match set
 */
export const useDeleteMatchSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matchSetService.deleteMatchSet(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.matchSets.all,
      });

      const previousMatchSets = queryClient.getQueriesData({
        queryKey: queryKeys.matchSets.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.matchSets.lists() },
        (old: MatchSet[] | undefined) =>
          old?.filter((ms) => ms.id !== id) ?? [],
      );

      return { previousMatchSets };
    },
    onError: (_err, _id, context) => {
      if (context?.previousMatchSets) {
        context.previousMatchSets.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchSets.all,
      });
    },
  });
};
