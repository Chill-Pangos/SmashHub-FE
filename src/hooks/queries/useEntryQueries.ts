import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entryService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  RegisterEntryRequest,
  UpdateEntryRequest,
  RespondJoinRequestRequest,
  DisqualifyEntriesRequest,
  EntryJoinRequestStatus,
  ConfirmImportSingleEntriesRequest,
  ConfirmImportDoubleEntriesRequest,
  ConfirmImportTeamEntriesRequest,
} from "@/types";

const getCategoryId = (data: { categoryId?: number }) => data.categoryId;

// ==================== Query Hooks ====================

// getAllEntries is no longer used, so removing useEntries

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
    queryFn: () => entryService.getEntryById(entryId), // Fallback if no specific role method
    enabled: (options?.enabled ?? true) && entryId > 0,
  });
};

// useEntriesByContent removed

// ==================== Mutation Hooks ====================

// useCreateEntry removed

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
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries.byCategory(categoryId),
        });
      }
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
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.entries.all,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
};

/**
 * Hook to invite member to entry
 */
export const useInviteEntryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: number;
      data: { inviteeId: number };
    }) => entryService.inviteEntryMember(entryId, data),
    onSuccess: (_result, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
};

/**
 * Hook to accept invitation
 */
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      invitationId,
    }: {
      entryId: number;
      invitationId: number;
    }) => entryService.acceptInvitation(entryId, invitationId),
    onSuccess: (_result, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.members(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
};

/**
 * Hook to reject invitation
 */
export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      invitationId,
    }: {
      entryId: number;
      invitationId: number;
    }) => entryService.rejectInvitation(entryId, invitationId),
    onSuccess: (_result, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
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
      memberId,
    }: {
      entryId: number;
      memberId: number;
    }) => entryService.removeEntryMember(entryId, memberId),
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
      requiredMemberCount,
    }: {
      entryId: number;
      requiredMemberCount: number;
    }) => entryService.setRequiredMembers(entryId, requiredMemberCount),
    onSuccess: (_entry, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.myEntries(),
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
      newCaptainId,
    }: {
      entryId: number;
      newCaptainId: number;
    }) => entryService.transferCaptaincy(entryId, newCaptainId),
    onSuccess: (_entry, { entryId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.myEntries(),
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
 * Hook to confirm lineup
 */
export const useConfirmLineup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: number) => entryService.confirmLineup(entryId),
    onSuccess: (_entry, entryId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.myEntries(),
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
      data?: DisqualifyEntriesRequest;
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
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries.byCategory(categoryId),
        });
      }
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
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries.byCategory(categoryId),
        });
      }
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
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries.byCategory(categoryId),
        });
      }
    },
  });
};
