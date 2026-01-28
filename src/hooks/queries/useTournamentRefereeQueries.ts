import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentRefereeService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  TournamentReferee,
  CreateTournamentRefereeRequest,
  AssignRefereesRequest,
  UpdateTournamentRefereeRequest,
  UpdateAvailabilityRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả tournament referees với pagination
 */
export const useTournamentReferees = (
  tournamentId?: number,
  skip = 0,
  limit = 10,
) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.list({ tournamentId, skip, limit }),
    queryFn: () =>
      tournamentRefereeService.getAllTournamentReferees(
        tournamentId,
        skip,
        limit,
      ),
  });
};

/**
 * Hook để lấy tournament referee theo ID
 */
export const useTournamentReferee = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.detail(id),
    queryFn: () => tournamentRefereeService.getTournamentRefereeById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy referees theo tournament ID
 */
export const useRefereesByTournament = (
  tournamentId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.byTournament(tournamentId),
    queryFn: () =>
      tournamentRefereeService.getRefereesByTournament(
        tournamentId,
        skip,
        limit,
      ),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

/**
 * Hook để lấy available referees cho tournament
 */
export const useAvailableReferees = (
  tournamentId: number,
  excludeIds?: number[],
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [
      ...queryKeys.tournamentReferees.byTournament(tournamentId),
      "available",
      excludeIds,
    ],
    queryFn: () =>
      tournamentRefereeService.getAvailableReferees(tournamentId, excludeIds),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo tournament referee mới
 */
export const useCreateTournamentReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentRefereeRequest) =>
      tournamentRefereeService.createTournamentReferee(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.all,
      });
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.byTournament(
            result.data.tournamentId,
          ),
        });
      }
    },
  });
};

/**
 * Hook để assign nhiều referees vào tournament
 */
export const useAssignReferees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRefereesRequest) =>
      tournamentRefereeService.assignReferees(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.byTournament(data.tournamentId),
      });
    },
  });
};

/**
 * Hook để cập nhật tournament referee
 */
export const useUpdateTournamentReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTournamentRefereeRequest;
    }) => tournamentRefereeService.updateTournamentReferee(id, data),
    onSuccess: (result, { id }) => {
      queryClient.setQueryData(queryKeys.tournamentReferees.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.lists(),
      });
    },
  });
};

/**
 * Hook để cập nhật availability
 */
export const useUpdateRefereeAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateAvailabilityRequest;
    }) => tournamentRefereeService.updateAvailability(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.all,
      });
    },
  });
};

/**
 * Hook để xóa tournament referee
 */
export const useDeleteTournamentReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      tournamentRefereeService.deleteTournamentReferee(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tournamentReferees.all,
      });

      const previousReferees = queryClient.getQueriesData({
        queryKey: queryKeys.tournamentReferees.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.tournamentReferees.lists() },
        (old: TournamentReferee[] | undefined) =>
          old?.filter((r) => r.id !== id) ?? [],
      );

      return { previousReferees };
    },
    onError: (_err, _id, context) => {
      if (context?.previousReferees) {
        context.previousReferees.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.all,
      });
    },
  });
};
