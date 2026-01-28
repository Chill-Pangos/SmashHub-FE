import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  ConfirmImportTeamsRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả teams với pagination
 */
export const useTeams = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.teams.list({ skip, limit }),
    queryFn: () => teamService.getAllTeams(skip, limit),
  });
};

/**
 * Hook để lấy team theo ID
 */
export const useTeam = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.teams.detail(id),
    queryFn: () => teamService.getTeamById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy teams theo tournament ID
 */
export const useTeamsByTournament = (
  tournamentId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.teams.byTournament(tournamentId),
    queryFn: () =>
      teamService.getTeamsByTournamentId(tournamentId, skip, limit),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo team mới
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamService.createTeam(data),
    onSuccess: (newTeam) => {
      // Invalidate team lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.all,
      });
      // Also invalidate teams by tournament
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.byTournament(newTeam.tournamentId),
      });
    },
  });
};

/**
 * Hook để cập nhật team
 */
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeamRequest }) =>
      teamService.updateTeam(id, data),
    onSuccess: (_result, { id }) => {
      // Invalidate specific team detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.detail(id),
      });
      // Invalidate team lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.lists(),
      });
    },
  });
};

/**
 * Hook để xóa team với Optimistic Update
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teamService.deleteTeam(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.teams.all,
      });

      const previousTeams = queryClient.getQueriesData({
        queryKey: queryKeys.teams.all,
      });

      // Optimistically remove from cached lists
      queryClient.setQueriesData(
        { queryKey: queryKeys.teams.lists() },
        (old: Team[] | undefined) => old?.filter((t) => t.id !== id) ?? [],
      );

      return { previousTeams };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTeams) {
        context.previousTeams.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.all,
      });
    },
  });
};

/**
 * Hook để preview import teams từ file Excel
 */
export const usePreviewImportTeams = () => {
  return useMutation({
    mutationFn: (file: File) => teamService.previewImportTeams(file),
  });
};

/**
 * Hook để confirm import teams
 */
export const useConfirmImportTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmImportTeamsRequest) =>
      teamService.confirmImportTeams(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.byTournament(data.tournamentId),
      });
    },
  });
};
