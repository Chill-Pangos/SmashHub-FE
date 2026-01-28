import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { CreateRoleRequest, UpdateRoleRequest } from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả roles với pagination
 */
export const useRoles = (
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.roles.list({ skip, limit }),
    queryFn: () => roleService.getAllRoles(skip, limit),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook để lấy role theo ID
 */
export const useRole = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => roleService.getRoleById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy role theo name
 */
export const useRoleByName = (
  name: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.roles.all, "name", name] as const,
    queryFn: () => roleService.getRoleByName(name),
    enabled: (options?.enabled ?? true) && !!name,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo role mới
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => roleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      });
    },
  });
};

/**
 * Hook để cập nhật role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleRequest }) =>
      roleService.updateRole(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.lists(),
      });
    },
  });
};

/**
 * Hook để xóa role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      });
    },
  });
};
