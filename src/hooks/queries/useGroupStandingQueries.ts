import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupStandingService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  GeneratePlaceholdersRequest,
  RandomDrawRequest,
  SaveAssignmentsRequest,
  RandomDrawAndSaveRequest,
  CalculateStandingsRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy group standings theo content ID
 */
export const useGroupStandingsByContent = (
  contentId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.groupStandings.byContent(contentId),
    queryFn: () => groupStandingService.getStandingsByContent(contentId),
    enabled: (options?.enabled ?? true) && contentId > 0,
  });
};

/**
 * Hook để lấy qualified teams
 */
export const useQualifiedTeams = (
  contentId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.groupStandings.byContent(contentId), "qualified"],
    queryFn: () => groupStandingService.getQualifiedTeams(contentId),
    enabled: (options?.enabled ?? true) && contentId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để generate group placeholders
 */
export const useGeneratePlaceholders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneratePlaceholdersRequest) =>
      groupStandingService.generatePlaceholders(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byContent(data.contentId),
      });
    },
  });
};

/**
 * Hook để random draw (không lưu)
 */
export const useRandomDraw = () => {
  return useMutation({
    mutationFn: (data: RandomDrawRequest) =>
      groupStandingService.randomDraw(data),
  });
};

/**
 * Hook để save group assignments
 */
export const useSaveAssignments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveAssignmentsRequest) =>
      groupStandingService.saveAssignments(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.all,
      });
    },
  });
};

/**
 * Hook để random draw và lưu luôn
 */
export const useRandomDrawAndSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RandomDrawAndSaveRequest) =>
      groupStandingService.randomDrawAndSave(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.all,
      });
    },
  });
};

/**
 * Hook để calculate standings
 */
export const useCalculateStandings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalculateStandingsRequest) =>
      groupStandingService.calculateStandings(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byContent(data.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.all,
      });
    },
  });
};
