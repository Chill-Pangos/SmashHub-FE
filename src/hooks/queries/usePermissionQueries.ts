import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { CreatePermissionRequest, UpdatePermissionRequest } from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook to get permissions with pagination metadata.
 */
export const usePermissionsPaginated = (
  skip = 0,
  limit = 50,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.permissions.list({ skip, limit }),
    queryFn: () => permissionService.getAllPermissionsPaginated(skip, limit),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook to get all permissions with pagination
 */
export const usePermissions = (
  skip = 0,
  limit = 50,
  options?: { enabled?: boolean },
) => {
  const query = usePermissionsPaginated(skip, limit, options);

  return {
    ...query,
    data: query.data?.items ?? [],
  };
};

/**
 * Hook to get permission by ID
 */
export const usePermission = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.permissions.detail(id),
    queryFn: () => permissionService.getPermissionById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook to create permission
 */
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) =>
      permissionService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.all,
      });
    },
  });
};

/**
 * Hook to update permission
 */
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePermissionRequest }) =>
      permissionService.updatePermission(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.lists(),
      });
    },
  });
};

/**
 * Hook to delete permission
 */
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => permissionService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.all,
      });
    },
  });
};
