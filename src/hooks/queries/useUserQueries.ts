import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";
import { queryKeys } from "./queryKeys";

// ==================== Query Hooks ====================

/**
 * Hook để lấy danh sách tất cả users với pagination
 */
export const useUsers = (
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.users.list({ skip, limit }),
    queryFn: () => userService.getUsers(skip, limit),
    enabled: options?.enabled ?? true,
  });
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
 * Hook để tìm kiếm users theo email hoặc tên
 */
export const useSearchUsers = (
  query: string,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.users.search({ query, skip, limit }),
    queryFn: () => userService.searchUsers(query, skip, limit),
    enabled: (options?.enabled ?? true) && query.length > 0,
  });
};
