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

const getCategoryId = (data: { contentId: number; categoryId?: number }) =>
  data.categoryId ?? data.contentId;

// ==================== Query Hooks ====================

/**
 * Hook để lấy group standings theo category ID
 */
export const useGroupStandingsByCategory = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.groupStandings.byCategory(categoryId),
    queryFn: () => groupStandingService.getStandingsByCategory(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

/**
 * @deprecated Use useGroupStandingsByCategory instead.
 */
export const useGroupStandingsByContent = (
  contentId: number,
  options?: { enabled?: boolean },
) => useGroupStandingsByCategory(contentId, options);

/**
 * Hook để lấy qualified teams
 */
export const useQualifiedTeams = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.groupStandings.byCategory(categoryId), "qualified"],
    queryFn: () => groupStandingService.getQualifiedTeamsByCategory(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byCategory(categoryId),
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byCategory(categoryId),
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byCategory(categoryId),
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.all,
      });
    },
  });
};
