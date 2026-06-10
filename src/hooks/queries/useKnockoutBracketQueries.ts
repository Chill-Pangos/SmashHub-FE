import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { knockoutBracketService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  GenerateKnockoutPlaceholdersRequest,
  FillQualifiersRequest,
  GenerateFromEntriesRequest,
  AdvanceWinnerRequest,
  SaveKnockoutAssignmentsRequest,
} from "@/types";

const getCategoryId = (data: { categoryId: number }) => data.categoryId;

// ==================== Query Hooks ====================

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

export const usePreviewKnockoutPlaceholders = () => {
  return useMutation({
    mutationFn: (data: GenerateKnockoutPlaceholdersRequest) =>
      knockoutBracketService.previewPlaceholders(data),
  });
};

export const usePreviewFillQualifiers = () => {
  return useMutation({
    mutationFn: (data: FillQualifiersRequest) =>
      knockoutBracketService.previewFillQualifiers(data),
  });
};

export const usePreviewFromEntries = () => {
  return useMutation({
    mutationFn: (data: GenerateFromEntriesRequest) =>
      knockoutBracketService.previewFromEntries(data),
  });
};

export const useSaveKnockoutAssignments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveKnockoutAssignmentsRequest) =>
      knockoutBracketService.saveAssignments(data),
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
