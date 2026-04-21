import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { CreateUserRequest, UpdateUserRequest } from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy users với meta phân trang.
 */
export const useUsersPaginated = (
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.users.list({ skip, limit }),
    queryFn: () => userService.getUsersPaginated(skip, limit),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook để lấy danh sách tất cả users với pagination
 */
export const useUsers = (
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  const query = useUsersPaginated(skip, limit, options);

  return {
    ...query,
    data: query.data?.items ?? [],
  };
};

/**
 * Hook để lấy user theo ID
 */
export const useUser = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để tìm kiếm users với meta phân trang.
 */
export const useSearchUsersPaginated = (
  query: string,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.users.search({ query, skip, limit }),
    queryFn: () => userService.searchUsersPaginated(query, skip, limit),
    enabled: (options?.enabled ?? true) && query.length > 0,
  });
};

/**
 * Hook để tìm kiếm users theo email hoặc tên
 */
export const useSearchUsers = (
  query: string,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  const searchQuery = useSearchUsersPaginated(query, skip, limit, options);

  return {
    ...searchQuery,
    data: searchQuery.data?.items ?? [],
  };
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo user mới
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });
};

/**
 * Hook để cập nhật user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
  });
};

/**
 * Hook để xóa user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });
};
