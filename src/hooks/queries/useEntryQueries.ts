import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entryService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  Entry,
  CreateEntryRequest,
  RegisterEntryRequest,
  UpdateEntryRequest,
  AddEntryMemberRequest,
  RemoveEntryMemberRequest,
  SetRequiredMembersRequest,
  TransferCaptaincyRequest,
  RespondJoinRequestRequest,
  DisqualifyEntriesRequest,
  EntryJoinRequestStatus,
  ConfirmImportSingleEntriesRequest,
  ConfirmImportDoubleEntriesRequest,
  ConfirmImportTeamEntriesRequest,
} from "@/types";

const getCategoryId = (data: { contentId: number; categoryId?: number }) =>
  data.categoryId ?? data.contentId;

// ==================== Query Hooks ====================

/**
 * Hook để lấy tất cả entries với pagination
 */
export const useEntries = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.entries.list({ page, limit }),
    queryFn: () => entryService.getAllEntries(page, limit),
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
 * Hook để lấy entries theo category ID
 */
export const useEntriesByCategory = (
  categoryId: number,
  page = 1,
  limit = 10,
  options?: {
    enabled?: boolean;
    isFull?: boolean;
    isAcceptingMembers?: boolean;
    captainName?: string;
  },
) => {
  return useQuery({
    queryKey: queryKeys.entries.byCategory(categoryId),
    queryFn: () =>
      entryService.getEntriesByCategoryId(categoryId, page, limit, {
        isFull: options?.isFull,
        isAcceptingMembers: options?.isAcceptingMembers,
        captainName: options?.captainName,
      }),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

/**
 * Hook to get entry members
 */
export const useEntryMembers = (
  entryId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.entries.members(entryId, { page, limit }),
    queryFn: () => entryService.getEntryMembers(entryId, page, limit),
    enabled: (options?.enabled ?? true) && entryId > 0,
  });
};

/**
 * Hook to get join requests for an entry
 */
export const useEntryJoinRequests = (
  entryId: number,
  options?: {
    status?: EntryJoinRequestStatus;
    page?: number;
    limit?: number;
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: queryKeys.entries.joinRequests(entryId, {
      status: options?.status,
      page: options?.page,
      limit: options?.limit,
    }),
    queryFn: () =>
      entryService.getJoinRequests(entryId, {
        status: options?.status,
        page: options?.page,
        limit: options?.limit,
      }),
    enabled: (options?.enabled ?? true) && entryId > 0,
  });
};

/**
 * Hook to get eligible entries by category
 */
export const useEligibleEntriesByCategory = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.entries.eligible(categoryId),
    queryFn: () => entryService.getEligibleEntriesByCategory(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

/**
 * Hook to get current user entries
 */
export const useMyEntries = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.entries.myEntries(),
    queryFn: () => entryService.getMyEntries(),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook to get current user role in entry
 */
export const useMyEntryRole = (
  entryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.entries.myRole(entryId),
    queryFn: () => entryService.getMyRole(entryId),
    enabled: (options?.enabled ?? true) && entryId > 0,
  });
};

/**
 * @deprecated Use useEntriesByCategory instead.
 */
export const useEntriesByContent = (
  contentId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => useEntriesByCategory(contentId, page, limit, options);

// ==================== Mutation Hooks ====================

/**
 * Hook để tạo entry mới (admin/tournament manager)
 */
export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntryRequest) => entryService.createEntry(data),
    onSuccess: (newEntry) => {
      const categoryId = getCategoryId(newEntry);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
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
      const categoryId = getCategoryId(newEntry);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
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

/**
 * Hook to add member to entry
 */
export const useAddEntryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: AddEntryMemberRequest;
    }) => entryService.addEntryMember(entryId, data),
    onSuccess: (entry, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.members(entryId),
      });
      const categoryId = getCategoryId(entry);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
      });
    },
  });
};

/**
 * Hook to remove member from entry
 */
export const useRemoveEntryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: RemoveEntryMemberRequest;
    }) => entryService.removeEntryMember(entryId, data),
    onSuccess: (_void, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.members(entryId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
};

/**
 * Hook to leave entry
 */
export const useLeaveEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: number) => entryService.leaveEntry(entryId),
    onSuccess: (_void, entryId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.myEntries(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
};

/**
 * Hook to set required members
 */
export const useSetRequiredMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: SetRequiredMembersRequest;
    }) => entryService.setRequiredMembers(entryId, data),
    onSuccess: (_entry, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
};

/**
 * Hook to transfer captaincy
 */
export const useTransferCaptaincy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: TransferCaptaincyRequest;
    }) => entryService.transferCaptaincy(entryId, data),
    onSuccess: (_entry, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.members(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.myRole(entryId),
      });
    },
  });
};

/**
 * Hook to respond to join request
 */
export const useRespondJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      joinRequestId,
      data,
    }: {
      joinRequestId: number;
      entryId?: number;
      data: RespondJoinRequestRequest;
    }) => entryService.respondJoinRequest(joinRequestId, data),
    onSuccess: (_entry, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      if (entryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries.joinRequests(entryId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries.detail(entryId),
        });
      }
    },
  });
};

/**
 * Hook to confirm entry lineup
 */
export const useConfirmLineup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: number) => entryService.confirmLineup(entryId),
    onSuccess: (entry, entryId) => {
      const categoryId = getCategoryId(entry);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
      });
    },
  });
};

/**
 * Hook to disqualify entries by category
 */
export const useDisqualifyEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: number;
      data: DisqualifyEntriesRequest;
    }) => entryService.disqualifyEntriesByCategory(categoryId, data),
    onSuccess: (_entries, { categoryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.eligible(categoryId),
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
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
      const categoryId = getCategoryId(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byCategory(categoryId),
      });
    },
  });
};
