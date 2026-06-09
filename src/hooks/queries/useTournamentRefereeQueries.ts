import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentRefereeService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  InviteRefereeRequest,
  AcceptInvitationRequest,
  RejectInvitationRequest,
  CancelInvitationRequest,
  RemoveRefereeRequest,
  UpdateRefereeRoleRequest,
} from "@/types";

export const useRefereesByTournament = (
  tournamentId: number,
  page = 1,
  limit = 10,
  role?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.tournamentReferees.byTournament(tournamentId), { page, limit, role }],
    queryFn: () => tournamentRefereeService.getRefereesByTournament(tournamentId, page, limit, role),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

export const useTournamentRefereeInvitations = (
  tournamentId: number,
  page = 1,
  limit = 10,
  status?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.tournamentReferees.invitations(tournamentId), { page, limit, status }],
    queryFn: () => tournamentRefereeService.getInvitationsByTournament(tournamentId, page, limit, status),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

export const useAvailableReferees = (
  tournamentId: number,
  page = 1,
  limit = 10,
  role?: string,
  search?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.tournamentReferees.byTournament(tournamentId), "available", { page, limit, role, search }],
    queryFn: () => tournamentRefereeService.getAvailableReferees(tournamentId, page, limit, role, search),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

export const useMyRefereeInvitations = (
  page = 1,
  limit = 10,
  status?: string,
  sortBy?: string,
  sortOrder?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["tournamentReferees", "my-invitations", { page, limit, status, sortBy, sortOrder }],
    queryFn: () => tournamentRefereeService.getMyInvitations(page, limit, status, sortBy, sortOrder),
    enabled: options?.enabled ?? true,
  });
};

export const useInviteReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteRefereeRequest) => tournamentRefereeService.inviteReferee(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.invitations(data.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.tournamentReferees.byTournament(data.tournamentId), "available"],
      });
    },
  });
};

export const useAcceptRefereeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) => tournamentRefereeService.acceptInvitation(data),
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
      queryClient.invalidateQueries({
        queryKey: ["tournamentReferees", "my-invitations"],
      });
    },
  });
};

export const useRejectRefereeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectInvitationRequest) => tournamentRefereeService.rejectInvitation(data),
    onSuccess: (result) => {
      const tournamentId = result?.tournamentId;
      if (tournamentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.invitations(tournamentId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["tournamentReferees", "my-invitations"],
      });
    },
  });
};

export const useCancelRefereeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelInvitationRequest) => tournamentRefereeService.cancelInvitation(data),
    onSuccess: (result) => {
      const tournamentId = result?.tournamentId;
      if (tournamentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tournamentReferees.invitations(tournamentId),
        });
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.tournamentReferees.byTournament(tournamentId), "available"],
        });
      }
    },
  });
};

export const useRemoveReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveRefereeRequest) => tournamentRefereeService.removeReferee(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.byTournament(data.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.tournamentReferees.byTournament(data.tournamentId), "available"],
      });
    },
  });
};

export const useUpdateRefereeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRefereeRoleRequest) => tournamentRefereeService.updateRefereeRole(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentReferees.byTournament(data.tournamentId),
      });
    },
  });
};
