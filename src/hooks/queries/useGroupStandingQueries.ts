import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupStandingService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  GeneratePlaceholdersRequest,
  RandomDrawRequest,
  SaveAssignmentsRequest,
  CalculateStandingsRequest,
} from "@/types";

const getCategoryId = (data: { categoryId: number }) => data.categoryId;

// ==================== Query Hooks ====================

/**
 * Hook để lấy group standings theo category ID
 */
export const useGroupStandingsByCategory = (
  categoryId: number,
  options?: { enabled?: boolean; groupName?: string },
) => {
  return useQuery({
    queryKey: queryKeys.groupStandings.byCategory(categoryId, {
      groupName: options?.groupName,
    }),
    queryFn: () =>
      groupStandingService.getStandingsByCategory(categoryId, {
        groupName: options?.groupName,
      }),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};


/**
 * Hook để lấy qualified teams
 */
export const useQualifiedTeams = (
  categoryId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean; qualifiersPerGroup?: number },
) => {
  return useQuery({
    queryKey: [...queryKeys.groupStandings.byCategory(categoryId), "qualified", { page, limit, qualifiersPerGroup: options?.qualifiersPerGroup }],
    queryFn: () => groupStandingService.getQualifiedTeamsByCategory(categoryId, { page, limit, qualifiersPerGroup: options?.qualifiersPerGroup }),
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

/**
 * Hook to sync standings after match approval
 */
export const useSyncStandings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) =>
      groupStandingService.syncStandings(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.groupStandings.all,
      });
    },
  });
};
