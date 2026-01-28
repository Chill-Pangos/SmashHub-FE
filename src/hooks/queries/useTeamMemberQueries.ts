import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamMemberService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  TeamMember,
  CreateTeamMemberRequest,
  UpdateTeamMemberRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả team members với pagination
 */
export const useTeamMembers = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.teamMembers.list({ skip, limit }),
    queryFn: () => teamMemberService.getAllTeamMembers(skip, limit),
  });
};

/**
 * Hook để lấy team member theo ID
 */
export const useTeamMember = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.teamMembers.detail(id),
    queryFn: () => teamMemberService.getTeamMemberById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy members theo team ID
 */
export const useMembersByTeam = (
  teamId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.teamMembers.byTeam(teamId),
    queryFn: () => teamMemberService.getMembersByTeamId(teamId, skip, limit),
    enabled: (options?.enabled ?? true) && teamId > 0,
  });
};

/**
 * Hook để lấy teams mà user tham gia
 */
export const useTeamsByUser = (
  userId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.teamMembers.byUser(userId),
    queryFn: () => teamMemberService.getTeamsByUserId(userId, skip, limit),
    enabled: (options?.enabled ?? true) && userId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo team member mới
 */
export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamMemberRequest) =>
      teamMemberService.createTeamMember(data),
    onSuccess: (newMember) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamMembers.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamMembers.byTeam(newMember.teamId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamMembers.byUser(newMember.userId),
      });
      // Also invalidate team detail to refresh members list
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.detail(newMember.teamId),
      });
    },
  });
};

/**
 * Hook để cập nhật team member
 */
export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeamMemberRequest }) =>
      teamMemberService.updateTeamMember(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamMembers.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamMembers.lists(),
      });
    },
  });
};

/**
 * Hook để xóa team member
 */
export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teamMemberService.deleteTeamMember(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.teamMembers.all,
      });

      const previousMembers = queryClient.getQueriesData({
        queryKey: queryKeys.teamMembers.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.teamMembers.lists() },
        (old: TeamMember[] | undefined) =>
          old?.filter((m) => m.id !== id) ?? [],
      );

      return { previousMembers };
    },
    onError: (_err, _id, context) => {
      if (context?.previousMembers) {
        context.previousMembers.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamMembers.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teams.all,
      });
    },
  });
};
