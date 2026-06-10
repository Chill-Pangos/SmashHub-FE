import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolePermissionService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { AssignPermissionToRoleRequest } from "@/types/rolePermission.types";

export const useRolePermissions = (
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.rolePermissions.list({ page, limit }),
    queryFn: () => rolePermissionService.getAllRolePermissions(page, limit),
    enabled: options?.enabled ?? true,
  });
};

export const usePermissionsByRole = (
  roleId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.rolePermissions.byRole(roleId, { page, limit }),
    queryFn: () =>
      rolePermissionService.getPermissionsByRole(roleId, page, limit),
    enabled: (options?.enabled ?? true) && roleId > 0,
  });
};

export const useRolesByPermission = (
  permissionId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.rolePermissions.byPermission(permissionId, {
      page,
      limit,
    }),
    queryFn: () =>
      rolePermissionService.getRolesByPermission(permissionId, page, limit),
    enabled: (options?.enabled ?? true) && permissionId > 0,
  });
};

export const useCheckRolePermission = (
  roleId: number,
  permissionId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.rolePermissions.check(roleId, permissionId),
    queryFn: () =>
      rolePermissionService.checkRolePermission(roleId, permissionId),
    enabled: (options?.enabled ?? true) && roleId > 0 && permissionId > 0,
  });
};

export const useAssignPermissionToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignPermissionToRoleRequest) =>
      rolePermissionService.assignPermissionToRole(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rolePermissions.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.rolePermissions.byRole(data.roleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.rolePermissions.byPermission(data.permissionId),
      });
    },
  });
};

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number;
      permissionId: number;
    }) => rolePermissionService.removePermissionFromRole(roleId, permissionId),
    onSuccess: (_result, { roleId, permissionId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rolePermissions.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.rolePermissions.byRole(roleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.rolePermissions.byPermission(permissionId),
      });
    },
  });
};
