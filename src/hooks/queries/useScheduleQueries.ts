import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  ScheduleStage,
  GenerateTournamentScheduleRequest,
  GenerateGroupStageScheduleRequest,
  GenerateKnockoutScheduleRequest,
  SyncMatchEntriesRequest,
} from "@/types";

const getCategoryId = (data: { categoryId: number }) => data.categoryId;

// ==================== Query Hooks ====================

export const useSchedule = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.schedules.detail(id),
    queryFn: () => scheduleService.getScheduleById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

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

// ==================== Mutation Hooks ====================

export const useGenerateTournamentSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateTournamentScheduleRequest) =>
      scheduleService.generateTournamentSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
    },
  });
};

export const useGenerateGroupStageSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateGroupStageScheduleRequest) =>
      scheduleService.generateGroupStageSchedule(data),
    onSuccess: (_result, data) => {
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
    },
  });
};

export const useGenerateKnockoutSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateKnockoutScheduleRequest) =>
      scheduleService.generateKnockoutSchedule(data),
    onSuccess: (_result, data) => {
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.all,
      });
    },
  });
};

export const useSyncMatchEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SyncMatchEntriesRequest) =>
      scheduleService.syncMatchEntries(data),
    onSuccess: (_result, data) => {
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.all, // Since matches are synced
      });
    },
  });
};
