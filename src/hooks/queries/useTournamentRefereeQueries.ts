import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentRefereeService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  CreateTournamentRefereeRequest,
  InviteRefereeRequest,
  AcceptInvitationRequest,
  RejectInvitationRequest,
  CancelInvitationRequest,
  RemoveRefereeRequest,
  UpdateRefereeRoleRequest,
  AssignRefereesRequest,
  UpdateTournamentRefereeRequest,
  UpdateAvailabilityRequest,
  GetAllTournamentRefereesResponse,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy danh sách tổng trọng tài sẵn sàng
 */
export const useAvailableChiefReferees = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.availableChiefReferees(),
    queryFn: () => tournamentRefereeService.getAvailableChiefReferees(),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook để lấy tất cả tournament referees với pagination
 */
export const useTournamentReferees = (
  tournamentId?: number,
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.list({ tournamentId, page, limit }),
    queryFn: () =>
      tournamentRefereeService.getAllTournamentReferees(
        tournamentId,
        page,
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
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.byTournament(tournamentId),
    queryFn: () =>
      tournamentRefereeService.getRefereesByTournament(
        tournamentId,
        page,
        limit,
      ),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

/**
 * Hook to get invitations by tournament
 */
export const useTournamentRefereeInvitations = (
  tournamentId: number,
  status?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournamentReferees.invitations(tournamentId, status),
    queryFn: () =>
      tournamentRefereeService.getInvitationsByTournament(tournamentId, status),
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
      if (result) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.byTournament(
            result.tournamentId,
          ),
        });
      }
    },
  });
};

/**
 * Hook to invite referee
 */
export const useInviteReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteRefereeRequest) =>
      tournamentRefereeService.inviteReferee(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.invitations(data.tournamentId),
      });
    },
  });
};

/**
 * Hook to accept invitation
 */
export const useAcceptRefereeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) =>
      tournamentRefereeService.acceptInvitation(data),
    onSuccess: (result) => {
      const tournamentId = result?.tournamentId;
      if (tournamentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.byTournament(tournamentId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.invitations(tournamentId),
        });
      }
    },
  });
};

/**
 * Hook to reject invitation
 */
export const useRejectRefereeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectInvitationRequest) =>
      tournamentRefereeService.rejectInvitation(data),
    onSuccess: (result) => {
      const tournamentId = result?.tournamentId;
      if (tournamentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.invitations(tournamentId),
        });
      }
    },
  });
};

/**
 * Hook to cancel invitation
 */
export const useCancelRefereeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelInvitationRequest) =>
      tournamentRefereeService.cancelInvitation(data),
    onSuccess: (result) => {
      const tournamentId = result?.tournamentId;
      if (tournamentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.invitations(tournamentId),
        });
      }
    },
  });
};

/**
 * Hook to remove referee from tournament
 */
export const useRemoveReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveRefereeRequest) =>
      tournamentRefereeService.removeReferee(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.byTournament(data.tournamentId),
      });
    },
  });
};

/**
 * Hook to update referee role
 */
export const useUpdateRefereeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRefereeRoleRequest) =>
      tournamentRefereeService.updateRefereeRole(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.byTournament(data.tournamentId),
      });
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
        (old: GetAllTournamentRefereesResponse | undefined) => {
          if (old) {
            return {
              ...old,
              referees: old.referees.filter((r) => r.id !== id),
            };
          }
          return old;
        },
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
