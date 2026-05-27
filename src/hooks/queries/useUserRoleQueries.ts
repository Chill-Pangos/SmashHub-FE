import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userRoleService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { AssignRoleToUserRequest } from "@/types/userRole.types";

export const useUserRoles = (
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.userRoles.list({ page, limit }),
    queryFn: () => userRoleService.getAllUserRoles(page, limit),
    enabled: options?.enabled ?? true,
  });
};

export const useUserRolesByUser = (
  userId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.userRoles.byUser(userId, { page, limit }),
    queryFn: () => userRoleService.getRolesByUser(userId, page, limit),
    enabled: (options?.enabled ?? true) && userId > 0,
  });
};

export const useUserRolesByRole = (
  roleId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.userRoles.byRole(roleId, { page, limit }),
    queryFn: () => userRoleService.getUsersByRole(roleId, page, limit),
    enabled: (options?.enabled ?? true) && roleId > 0,
  });
};

export const useCheckUserRole = (
  userId: number,
  roleId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.userRoles.check(userId, roleId),
    queryFn: () => userRoleService.checkUserRole(userId, roleId),
    enabled: (options?.enabled ?? true) && userId > 0 && roleId > 0,
  });
};

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRoleToUserRequest) =>
      userRoleService.assignRoleToUser(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userRoles.byUser(data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userRoles.byRole(data.roleId),
      });
    },
  });
};

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      userRoleService.removeRoleFromUser(userId, roleId),
    onSuccess: (_result, { userId, roleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userRoles.byUser(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userRoles.byRole(roleId),
      });
    },
  });
};
