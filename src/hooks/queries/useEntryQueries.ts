import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entryService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Entry,
  CreateEntryRequest,
  RegisterEntryRequest,
  UpdateEntryRequest,
  ConfirmImportSingleEntriesRequest,
  ConfirmImportDoubleEntriesRequest,
  ConfirmImportTeamEntriesRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả entries với pagination
 */
export const useEntries = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.entries.list({ skip, limit }),
    queryFn: () => entryService.getAllEntries(skip, limit),
  });
};

/**
 * Hook để lấy entry theo ID
 */
export const useEntry = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.entries.detail(id),
    queryFn: () => entryService.getEntryById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

/**
 * Hook để lấy entries theo content ID
 */
export const useEntriesByContent = (
  contentId: number,
  skip = 0,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.entries.byContent(contentId),
    queryFn: () => entryService.getEntriesByContentId(contentId, skip, limit),
    enabled: (options?.enabled ?? true) && contentId > 0,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo entry mới (admin/tournament manager)
 */
export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntryRequest) => entryService.createEntry(data),
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byContent(newEntry.contentId),
      });
    },
  });
};

/**
 * Hook để đăng ký entry (team manager)
 */
export const useRegisterEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterEntryRequest) =>
      entryService.registerEntry(data),
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byContent(newEntry.contentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byTeam(newEntry.teamId),
      });
    },
  });
};

/**
 * Hook để cập nhật entry
 */
export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEntryRequest }) =>
      entryService.updateEntry(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.lists(),
      });
    },
  });
};

/**
 * Hook để xóa entry với Optimistic Update
 */
export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => entryService.deleteEntry(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.entries.all,
      });

      const previousEntries = queryClient.getQueriesData({
        queryKey: queryKeys.entries.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.entries.lists() },
        (old: Entry[] | undefined) => old?.filter((e) => e.id !== id) ?? [],
      );

      return { previousEntries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousEntries) {
        context.previousEntries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
};

// ==================== Import Mutation Hooks ====================

/**
 * Hook để preview import single entries
 */
export const usePreviewImportSingleEntries = () => {
  return useMutation({
    mutationFn: ({ file, contentId }: { file: File; contentId: number }) =>
      entryService.previewImportSingleEntries(file, contentId),
  });
};

/**
 * Hook để confirm import single entries
 */
export const useConfirmImportSingleEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmImportSingleEntriesRequest) =>
      entryService.confirmImportSingleEntries(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byContent(data.contentId),
      });
    },
  });
};

/**
 * Hook để preview import double entries
 */
export const usePreviewImportDoubleEntries = () => {
  return useMutation({
    mutationFn: ({ file, contentId }: { file: File; contentId: number }) =>
      entryService.previewImportDoubleEntries(file, contentId),
  });
};

/**
 * Hook để confirm import double entries
 */
export const useConfirmImportDoubleEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmImportDoubleEntriesRequest) =>
      entryService.confirmImportDoubleEntries(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byContent(data.contentId),
      });
    },
  });
};

/**
 * Hook để preview import team entries
 */
export const usePreviewImportTeamEntries = () => {
  return useMutation({
    mutationFn: ({ file, contentId }: { file: File; contentId: number }) =>
      entryService.previewImportTeamEntries(file, contentId),
  });
};

/**
 * Hook để confirm import team entries
 */
export const useConfirmImportTeamEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmImportTeamEntriesRequest) =>
      entryService.confirmImportTeamEntries(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byContent(data.contentId),
      });
    },
  });
};
