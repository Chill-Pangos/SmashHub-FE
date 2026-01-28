import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configuration
 * Cấu hình mặc định cho React Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian dữ liệu được coi là "fresh" (5 phút)
      staleTime: 5 * 60 * 1000,
      // Thời gian cache được giữ khi không sử dụng (30 phút)
      gcTime: 30 * 60 * 1000,
      // Số lần retry khi có lỗi
      retry: 1,
      // Không refetch khi focus lại window
      refetchOnWindowFocus: false,
      // Không refetch khi reconnect
      refetchOnReconnect: false,
    },
    mutations: {
      // Số lần retry cho mutations
      retry: 0,
    },
  },
});
