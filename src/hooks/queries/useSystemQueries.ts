import { useQuery } from "@tanstack/react-query";
import { systemService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { SystemMetricsParams, SystemEventsParams } from "@/types/system.types";

export const useSystemHealth = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.system.health(),
    queryFn: () => systemService.getHealth(),
    enabled: options?.enabled ?? true,
    refetchInterval: 30000, // Auto-refresh health every 30s
  });
};

export const useSystemMetrics = (
  params?: SystemMetricsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.system.metrics(params),
    queryFn: () => systemService.getMetrics(params),
    enabled: options?.enabled ?? true,
  });
};

export const useSystemEvents = (
  params?: SystemEventsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.system.events(params),
    queryFn: () => systemService.getEvents(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCronLogDetail = (id: number | null) => {
  return useQuery({
    queryKey: queryKeys.system.cronLogDetail(id!),
    queryFn: () => systemService.getCronLogDetail(id!),
    enabled: !!id,
  });
};

export const useSystemApiLogDetail = (id: number | null) => {
  return useQuery({
    queryKey: queryKeys.system.apiLogDetail(id!),
    queryFn: () => systemService.getApiRequestLogDetail(id!),
    enabled: !!id,
  });
};
