import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Tournament,
  TournamentSearchFilters,
  TournamentSearchResponse,
  CreateTournamentRequest,
  UpdateTournamentRequest,
  TournamentStatus,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả tournaments với pagination
 */
export const useTournaments = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.tournaments.list({ skip, limit }),
    queryFn: () => tournamentService.getAllTournaments(skip, limit),
  });
};

/**
 * Hook để search tournaments với filters
 */
export const useSearchTournaments = (
  filters: TournamentSearchFilters,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.search(filters),
    queryFn: () => tournamentService.searchTournaments(filters),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook để lấy tournament theo ID
 */
export const useTournament = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.tournaments.detail(id),
    queryFn: () => tournamentService.getTournamentById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy tournaments theo status
 */
export const useTournamentsByStatus = (
  status: TournamentStatus,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.byStatus(status),
    queryFn: () =>
      tournamentService.getTournamentsByStatus(status, skip, limit),
    enabled: options?.enabled ?? true,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo tournament mới
 */
export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentRequest) =>
      tournamentService.createTournament(data),
    onSuccess: () => {
      // Invalidate all tournament queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.all,
      });
    },
  });
};

/**
 * Hook để cập nhật tournament
 */
export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTournamentRequest }) =>
      tournamentService.updateTournament(id, data),
    onSuccess: (updatedTournament, { id }) => {
      // Update cache for this specific tournament
      queryClient.setQueryData(
        queryKeys.tournaments.detail(id),
        updatedTournament,
      );
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.lists(),
      });
    },
  });
};

/**
 * Hook để xóa tournament với Optimistic Update
 */
export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tournamentService.deleteTournament(id),
    onMutate: async (id: number) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.tournaments.all,
      });

      // Snapshot current state for rollback
      const previousTournaments = queryClient.getQueriesData({
        queryKey: queryKeys.tournaments.all,
      });

      // Optimistically remove from all cached lists
      queryClient.setQueriesData(
        { queryKey: queryKeys.tournaments.lists() },
        (old: Tournament[] | undefined) =>
          old?.filter((t) => t.id !== id) ?? [],
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.tournaments.all },
        (old: TournamentSearchResponse | undefined) => {
          if (old && "tournaments" in old) {
            return {
              ...old,
              tournaments: old.tournaments.filter((t) => t.id !== id),
              total: old.total - 1,
            };
          }
          return old;
        },
      );

      return { previousTournaments };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousTournaments) {
        context.previousTournaments.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.all,
      });
    },
  });
};
