import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleConfigService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  CreateScheduleConfigRequest,
  UpdateScheduleConfigRequest,
  ValidateScheduleConfigRequest,
  PreviewScheduleConfigRequest,
  PreviewUpdateScheduleConfigRequest,
} from "@/types/scheduleConfig.types";

// ==================== Query Hooks ====================

export const useScheduleConfigDefaults = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.scheduleConfigs.defaults(),
    queryFn: () => scheduleConfigService.getScheduleConfigDefaults(),
    enabled: options?.enabled ?? true,
  });
};

export const useScheduleConfigByTournament = (
  tournamentId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.scheduleConfigs.byTournament(tournamentId),
    queryFn: () =>
      scheduleConfigService.getScheduleConfigByTournament(tournamentId),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

// ==================== Mutation Hooks ====================

export const useCreateScheduleConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleConfigRequest) =>
      scheduleConfigService.createScheduleConfig(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scheduleConfigs.byTournament(data.tournamentId),
      });
    },
  });
};

export const useUpdateScheduleConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tournamentId,
      data,
    }: {
      tournamentId: number;
      data: UpdateScheduleConfigRequest;
    }) => scheduleConfigService.updateScheduleConfig(tournamentId, data),
    onSuccess: (_result, { tournamentId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scheduleConfigs.byTournament(tournamentId),
      });
    },
  });
};

export const useDeleteScheduleConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: number) =>
      scheduleConfigService.deleteScheduleConfig(tournamentId),
    onSuccess: (_result, tournamentId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scheduleConfigs.byTournament(tournamentId),
      });
    },
  });
};

export const useValidateScheduleConfig = () => {
  return useMutation({
    mutationFn: ({
      tournamentId,
      data,
    }: {
      tournamentId: number;
      data: ValidateScheduleConfigRequest;
    }) => scheduleConfigService.validateScheduleConfig(tournamentId, data),
  });
};

export const usePreviewCreateScheduleConfig = () => {
  return useMutation({
    mutationFn: ({
      tournamentId,
      data,
    }: {
      tournamentId: number;
      data: PreviewScheduleConfigRequest;
    }) => scheduleConfigService.previewCreateScheduleConfig(tournamentId, data),
  });
};

export const usePreviewUpdateScheduleConfig = () => {
  return useMutation({
    mutationFn: ({
      tournamentId,
      data,
    }: {
      tournamentId: number;
      data: PreviewUpdateScheduleConfigRequest;
    }) => scheduleConfigService.previewUpdateScheduleConfig(tournamentId, data),
  });
};
