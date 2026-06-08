import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Schedule,
  ScheduleStage,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "@/types";

const getCategoryId = (data: { categoryId?: number }) => data.categoryId;

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả schedules với pagination
 */
export const useSchedules = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.schedules.list({ page, limit }),
    queryFn: () => scheduleService.getAllSchedules(page, limit),
  });
};

/**
 * Hook để lấy schedule theo ID
 */
export const useSchedule = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.schedules.detail(id),
    queryFn: () => scheduleService.getScheduleById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy schedules theo category ID
 */
export const useSchedulesByCategory = (
  categoryId: number,
  options?: {
    stage?: ScheduleStage;
    page?: number;
    limit?: number;
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [
      ...queryKeys.schedules.byCategory(categoryId),
      { stage: options?.stage, page: options?.page, limit: options?.limit },
    ],
    queryFn: () =>
      scheduleService.getSchedulesByCategory(categoryId, {
        stage: options?.stage,
        page: options?.page,
        limit: options?.limit,
      }),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

/**
 * @deprecated Use useSchedulesByCategory instead.
 */
export const useSchedulesByContent = (
  contentId: number,
  options?: {
    stage?: ScheduleStage;
    page?: number;
    limit?: number;
    enabled?: boolean;
  },
) => useSchedulesByCategory(contentId, options);

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo schedule mới
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) =>
      scheduleService.createSchedule(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
      if (result) {
        const categoryId = getCategoryId(result);
        if (categoryId) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.schedules.byCategory(categoryId),
          });
        }
      }
    },
  });
};

/**
 * Hook để cập nhật schedule
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
      scheduleService.updateSchedule(id, data),
    onSuccess: (result, { id }) => {
      queryClient.setQueryData(queryKeys.schedules.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.lists(),
      });
    },
  });
};

/**
 * Hook để xóa schedule
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => scheduleService.deleteSchedule(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.schedules.all,
      });

      const previousSchedules = queryClient.getQueriesData({
        queryKey: queryKeys.schedules.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.schedules.lists() },
        (old: Schedule[] | undefined) => old?.filter((s) => s.id !== id) ?? [],
      );

      return { previousSchedules };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSchedules) {
        context.previousSchedules.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
    },
  });
};
