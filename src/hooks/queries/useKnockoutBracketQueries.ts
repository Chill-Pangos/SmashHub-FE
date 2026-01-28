import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { knockoutBracketService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  KnockoutBracket,
  CreateKnockoutBracketRequest,
  UpdateKnockoutBracketRequest,
  GenerateKnockoutBracketRequest,
  GenerateFromGroupsRequest,
  AdvanceWinnerRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả knockout brackets với pagination
 */
export const useKnockoutBrackets = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.knockoutBrackets.list({ skip, limit }),
    queryFn: () => knockoutBracketService.getAllKnockoutBrackets(skip, limit),
  });
};

/**
 * Hook để lấy knockout bracket theo ID
 */
export const useKnockoutBracket = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.knockoutBrackets.detail(id),
    queryFn: () => knockoutBracketService.getKnockoutBracketById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy knockout brackets theo content ID
 */
export const useKnockoutBracketsByContent = (
  contentId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.knockoutBrackets.byContent(contentId),
    queryFn: () =>
      knockoutBracketService.getKnockoutBracketsByContent(contentId),
    enabled: (options?.enabled ?? true) && contentId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo knockout bracket mới
 */
export const useCreateKnockoutBracket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateKnockoutBracketRequest) =>
      knockoutBracketService.createKnockoutBracket(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.knockoutBrackets.byContent(result.data.contentId),
        });
      }
    },
  });
};

/**
 * Hook để cập nhật knockout bracket
 */
export const useUpdateKnockoutBracket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateKnockoutBracketRequest;
    }) => knockoutBracketService.updateKnockoutBracket(id, data),
    onSuccess: (result, { id }) => {
      queryClient.setQueryData(queryKeys.knockoutBrackets.detail(id), result);
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.lists(),
      });
    },
  });
};

/**
 * Hook để xóa knockout bracket
 */
export const useDeleteKnockoutBracket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      knockoutBracketService.deleteKnockoutBracket(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });

      const previousBrackets = queryClient.getQueriesData({
        queryKey: queryKeys.knockoutBrackets.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.knockoutBrackets.lists() },
        (old: KnockoutBracket[] | undefined) =>
          old?.filter((b) => b.id !== id) ?? [],
      );

      return { previousBrackets };
    },
    onError: (_err, _id, context) => {
      if (context?.previousBrackets) {
        context.previousBrackets.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};

/**
 * Hook để generate knockout bracket
 */
export const useGenerateKnockoutBracket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateKnockoutBracketRequest) =>
      knockoutBracketService.generateKnockoutBracket(data),
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
 * Hook để generate bracket từ groups
 */
export const useGenerateFromGroups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateFromGroupsRequest) =>
      knockoutBracketService.generateFromGroups(data),
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
 * Hook để advance winner
 */
export const useAdvanceWinner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdvanceWinnerRequest) =>
      knockoutBracketService.advanceWinner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.knockoutBrackets.all,
      });
    },
  });
};
