import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Match,
  MatchStatus,
  CreateMatchRequest,
  UpdateMatchRequest,
  ApproveMatchRequest,
  RejectMatchRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả matches với pagination
 */
export const useMatches = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.matches.list({ skip, limit }),
    queryFn: () => matchService.getAllMatches(skip, limit),
  });
};

/**
 * Hook để lấy match theo ID
 */
export const useMatch = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.matches.detail(id),
    queryFn: () => matchService.getMatchById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy matches theo schedule ID
 */
export const useMatchesBySchedule = (
  scheduleId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matches.bySchedule(scheduleId),
    queryFn: () => matchService.getMatchesBySchedule(scheduleId, skip, limit),
    enabled: (options?.enabled ?? true) && scheduleId > 0,
  });
};

/**
 * Hook để lấy matches theo status
 */
export const useMatchesByStatus = (
  status: MatchStatus,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matches.byStatus(status),
    queryFn: () => matchService.getMatchesByStatus(status, skip, limit),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook để lấy pending matches (cho Chief Referee)
 */
export const usePendingMatches = (
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matches.pending(),
    queryFn: () => matchService.getPendingMatches(skip, limit),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook để lấy pending match với ELO preview
 */
export const usePendingMatchWithElo = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.matches.pendingWithElo(id),
    queryFn: () => matchService.getPendingMatchWithElo(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để preview ELO changes
 */
export const useEloPreview = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.matches.eloPreview(id),
    queryFn: () => matchService.previewEloChanges(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo match mới
 */
export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchRequest) => matchService.createMatch(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.matches.bySchedule(result.data.scheduleId),
        });
      }
    },
  });
};

/**
 * Hook để cập nhật match
 */
export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMatchRequest }) =>
      matchService.updateMatch(id, data),
    onSuccess: (result, { id }) => {
      queryClient.setQueryData(queryKeys.matches.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.lists(),
      });
    },
  });
};

/**
 * Hook để xóa match
 */
export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matchService.deleteMatch(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.matches.all,
      });

      const previousMatches = queryClient.getQueriesData({
        queryKey: queryKeys.matches.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.matches.lists() },
        (old: Match[] | undefined) => old?.filter((m) => m.id !== id) ?? [],
      );

      return { previousMatches };
    },
    onError: (_err, _id, context) => {
      if (context?.previousMatches) {
        context.previousMatches.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
    },
  });
};

/**
 * Hook để start match (Referee)
 */
export const useStartMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matchService.startMatch(id),
    onSuccess: (result, id) => {
      queryClient.setQueryData(queryKeys.matches.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
    },
  });
};

/**
 * Hook để finalize match (Referee)
 */
export const useFinalizeMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matchService.finalizeMatch(id),
    onSuccess: (result, id) => {
      queryClient.setQueryData(queryKeys.matches.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      // Also invalidate pending matches as this adds to pending list
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.pending(),
      });
    },
  });
};

/**
 * Hook để approve match result (Chief Referee)
 */
export const useApproveMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: ApproveMatchRequest }) =>
      matchService.approveMatch(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      // Also invalidate group standings and knockout brackets
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook để reject match result (Chief Referee)
 */
export const useRejectMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectMatchRequest }) =>
      matchService.rejectMatch(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
    },
  });
};
