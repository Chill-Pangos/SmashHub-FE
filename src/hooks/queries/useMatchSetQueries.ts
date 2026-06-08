import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchSetService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  MatchSet,
  CreateMatchSetRequest,
  UpdateMatchSetRequest,
} from "@/types";

// ==================== Query Hooks ====================

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
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matchSets.byMatch(matchId, { page, limit }),
    queryFn: () => matchSetService.getMatchSetsByMatch(matchId, page, limit),
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
      if (result.matchId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matchSets.byMatch(result.matchId),
        });
        // Also invalidate related match
        queryClient.invalidateQueries({
          queryKey: queryKeys.matches.detail(result.matchId),
        });
      }
    },
  });
};

// useCreateMatchSetWithScore removed

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
      if (result.matchId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matches.detail(result.matchId),
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
