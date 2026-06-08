import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { knockoutBracketService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  GenerateKnockoutPlaceholdersRequest,
  FillQualifiersRequest,
  GenerateFromEntriesRequest,
  AdvanceWinnerRequest,
} from "@/types";

const getCategoryId = (data: { categoryId: number }) => data.categoryId;

// ==================== Query Hooks ====================


/**
 * Hook to get knockout bracket tree by category
 */
export const useKnockoutBracketTreeByCategory = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.knockoutBrackets.tree(categoryId),
    queryFn: () =>
      knockoutBracketService.getKnockoutBracketTreeByCategory(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

/**
 * Hook to get knockout standings by category
 */
export const useKnockoutStandingsByCategory = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.knockoutBrackets.standings(categoryId),
    queryFn: () =>
      knockoutBracketService.getKnockoutStandingsByCategory(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

/**
 * Hook to get entry brackets by category
 */
export const useKnockoutBracketsByEntry = (
  categoryId: number,
  options?: { enabled?: boolean; entryId?: number; entryName?: string; page?: number; limit?: number },
) => {
  return useQuery({
    queryKey: [...queryKeys.knockoutBrackets.byCategory(categoryId), "entry", { entryId: options?.entryId, entryName: options?.entryName, page: options?.page, limit: options?.limit }],
    queryFn: () =>
      knockoutBracketService.getKnockoutBracketsByEntry(categoryId, { entryId: options?.entryId, entryName: options?.entryName, page: options?.page, limit: options?.limit }),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để generate bracket placeholders
 */
export const useGenerateKnockoutPlaceholders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateKnockoutPlaceholdersRequest) =>
      knockoutBracketService.generatePlaceholders(data),
    onSuccess: (_result, data) => {
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook để fill qualifiers into bracket
 */
export const useFillQualifiers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FillQualifiersRequest) =>
      knockoutBracketService.fillQualifiers(data),
    onSuccess: (_result, data) => {
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook để generate bracket từ entries
 */
export const useGenerateFromEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateFromEntriesRequest) =>
      knockoutBracketService.generateFromEntries(data),
    onSuccess: (_result, data) => {
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook để advance winner
 */
export const useAdvanceWinner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdvanceWinnerRequest }) =>
      knockoutBracketService.advanceWinner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook to validate knockout brackets
 */
export const useValidateKnockoutBrackets = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.knockoutBrackets.byCategory(categoryId), "validate"],
    queryFn: () => knockoutBracketService.validateKnockoutBrackets(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};
