import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Schedule,
  ScheduleStage,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  GenerateScheduleRequest,
  UpdateKnockoutEntriesRequest,
  GenerateGroupStageScheduleRequest,
  GenerateCompleteScheduleRequest,
  GenerateKnockoutOnlyScheduleRequest,
  GenerateKnockoutStageScheduleRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả schedules với pagination
 */
export const useSchedules = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.schedules.list({ skip, limit }),
    queryFn: () => scheduleService.getAllSchedules(skip, limit),
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
 * Hook để lấy schedules theo content ID
 */
export const useSchedulesByContent = (
  contentId: number,
  options?: {
    stage?: ScheduleStage;
    skip?: number;
    limit?: number;
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [
      ...queryKeys.schedules.byContent(contentId),
      { stage: options?.stage, skip: options?.skip, limit: options?.limit },
    ],
    queryFn: () =>
      scheduleService.getSchedulesByContent(contentId, {
        stage: options?.stage,
        skip: options?.skip,
        limit: options?.limit,
      }),
    enabled: (options?.enabled ?? true) && contentId > 0,
  });
};

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
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.schedules.byContent(result.data.contentId),
        });
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

/**
 * Hook để generate schedule
 */
export const useGenerateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateScheduleRequest) =>
      scheduleService.generateSchedule(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
    },
  });
};

/**
 * Hook để update knockout entries
 */
export const useUpdateKnockoutEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateKnockoutEntriesRequest) =>
      scheduleService.updateKnockoutEntries(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook để generate group stage schedule
 */
export const useGenerateGroupStageSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateGroupStageScheduleRequest) =>
      scheduleService.generateGroupStageSchedule(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byContent(data.contentId),
      });
    },
  });
};

/**
 * Hook để generate complete schedule (group + knockout)
 */
export const useGenerateCompleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateCompleteScheduleRequest) =>
      scheduleService.generateCompleteSchedule(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byContent(data.contentId),
      });
    },
  });
};

/**
 * Hook để generate knockout only schedule
 */
export const useGenerateKnockoutOnlySchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateKnockoutOnlyScheduleRequest) =>
      scheduleService.generateKnockoutOnlySchedule(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byContent(data.contentId),
      });
    },
  });
};

/**
 * Hook để generate knockout stage schedule
 */
export const useGenerateKnockoutStageSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateKnockoutStageScheduleRequest) =>
      scheduleService.generateKnockoutStageSchedule(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byContent(data.contentId),
      });
    },
  });
};
