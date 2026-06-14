import axiosInstance from "@/config/axiosConfig";
import type {
  Entry,
  RegisterEntryRequest,
  UpdateEntryRequest,
  RespondJoinRequestRequest,
  ConfirmImportSingleEntriesRequest,
  ConfirmImportDoubleEntriesRequest,
  ConfirmImportTeamEntriesRequest,
  ImportEntriesPreviewResult,
  ImportEntriesConfirmResult,
  EntryMembersResponse,
  EntryJoinRequestsResponse,
  EntryJoinRequestStatus,
  EntryEligibilityResponse,
  MyEntriesResponse,
  EntryJoinRequest,
  EntryMember,
  DisqualifyEntriesRequest,
  DisqualifyEntriesResponse,
  EntriesResponse,
  EntryRoleResponse,
} from "@/types/entry.types";

/**
 * Entry Service
 * Handles all entry-related API calls
 */
class EntryService {
  private readonly baseURL = "/entries";

  // createEntry removed (not in docs)

  /**
   * Register entry (team manager)
   * POST /api/entries/register
   * Requires authentication - team manager only
   *
   * @param data Entry registration data with member IDs
   * @returns Promise with created entry data
   *
   * @example
   * const entry = await entryService.registerEntry({
   *   contentId: 1,
   *   teamId: 5,
   *   memberIds: [10, 15]
   * });
   */
  async registerEntry(data: RegisterEntryRequest): Promise<Entry> {
    const response = await axiosInstance.post<{
      entry: Entry;
      message: string;
    }>(`${this.baseURL}/register`, data);
    return response.data.entry;
  }

  // getAllEntries removed (replaced by getEntriesByCategoryId)

  /**
   * Get entry by ID
   * GET /api/entries/:id
   *
   * @param id Entry ID
   * @returns Promise with entry data
   *
   * @example
   * const entry = await entryService.getEntryById(1);
   */
  async getEntryById(id: number): Promise<Entry> {
    const response = await axiosInstance.get<Entry>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Get entry members
   * GET /api/entries/{entryId}/members
   */
  async getEntryMembers(
    entryId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<EntryMembersResponse> {
    const response = await axiosInstance.get<EntryMembersResponse>(
      `${this.baseURL}/${entryId}/members`,
      { params: { page, limit } },
    );
    return response.data;
  }

  /**
   * Invite member to entry
   * POST /api/entries/{entryId}/members/invite
   */
  async inviteEntryMember(
    entryId: number,
    data: { inviteeId: number },
  ): Promise<EntryJoinRequest> {
    const response = await axiosInstance.post<EntryJoinRequest>(
      `${this.baseURL}/${entryId}/members/invite`,
      data,
    );
    return response.data;
  }

  /**
   * Accept invitation
   * POST /api/entries/{entryId}/members/invitations/{invitationId}/accept
   */
  async acceptInvitation(
    entryId: number,
    invitationId: number,
  ): Promise<EntryMember> {
    const response = await axiosInstance.post<EntryMember>(
      `${this.baseURL}/${entryId}/members/invitations/${invitationId}/accept`,
    );
    return response.data;
  }

  /**
   * Reject invitation
   * POST /api/entries/{entryId}/members/invitations/{invitationId}/reject
   */
  async rejectInvitation(
    entryId: number,
    invitationId: number,
  ): Promise<void> {
    await axiosInstance.post(
      `${this.baseURL}/${entryId}/members/invitations/${invitationId}/reject`,
    );
  }

  /**
   * Remove member from entry (captain only)
   * DELETE /api/entries/{entryId}/members/{memberId}
   */
  async removeEntryMember(
    entryId: number,
    memberId: number,
  ): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${entryId}/members/${memberId}`);
  }

  /**
   * Leave entry (member only)
   * DELETE /api/entries/{entryId}/members/me
   */
  async leaveEntry(entryId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${entryId}/members/me`);
  }

  /**
   * Set required members
   * PUT /api/entries/{entryId}/required-members
   */
  async setRequiredMembers(
    entryId: number,
    requiredMemberCount: number,
  ): Promise<Entry> {
    const response = await axiosInstance.put<Entry>(
      `${this.baseURL}/${entryId}/required-members`,
      { requiredMemberCount },
    );
    return response.data;
  }

  /**
   * Transfer captaincy
   * PUT /api/entries/{entryId}/transfer-captaincy
   */
  async transferCaptaincy(
    entryId: number,
    newCaptainId: number,
  ): Promise<Entry> {
    const response = await axiosInstance.put<Entry>(
      `${this.baseURL}/${entryId}/transfer-captaincy`,
      { newCaptainId },
    );
    return response.data;
  }

  /**
   * Confirm lineup
   * POST /api/entries/{entryId}/confirm-lineup
   */
  async confirmLineup(entryId: number): Promise<Entry> {
    const response = await axiosInstance.post<Entry>(
      `${this.baseURL}/${entryId}/confirm-lineup`,
    );
    return response.data;
  }

  /**
   * Get join requests for entry
   * GET /api/entries/{entryId}/join-requests
   */
  async getJoinRequests(
    entryId: number,
    options?: {
      status?: EntryJoinRequestStatus;
      page?: number;
      limit?: number;
    },
  ): Promise<EntryJoinRequestsResponse> {
    const response = await axiosInstance.get<EntryJoinRequestsResponse>(
      `${this.baseURL}/${entryId}/join-requests`,
      { params: options },
    );
    return response.data;
  }

  /**
   * Respond to join request
   * POST /api/entries/join-requests/{joinRequestId}/respond
   */
  async respondJoinRequest(
    joinRequestId: number,
    data: RespondJoinRequestRequest,
  ): Promise<Entry> {
    const response = await axiosInstance.post<Entry>(
      `${this.baseURL}/join-requests/${joinRequestId}/respond`,
      data,
    );
    return response.data;
  }


  /**
   * Get eligible entries by category
   * GET /api/entries/category/{categoryId}/eligible
   */
  async getEligibleEntriesByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<EntryEligibilityResponse> {
    const response = await axiosInstance.get<EntryEligibilityResponse>(
      `${this.baseURL}/category/${categoryId}/eligible`,
      { params: { page, limit } }
    );
    return response.data;
  }

  /**
   * Disqualify entries by category
   * POST /api/entries/category/{categoryId}/disqualify
   */
  async disqualifyEntriesByCategory(
    categoryId: number,
    data?: DisqualifyEntriesRequest,
  ): Promise<DisqualifyEntriesResponse> {
    const response = await axiosInstance.post<DisqualifyEntriesResponse>(
      `${this.baseURL}/category/${categoryId}/disqualify`,
      data,
    );
    return response.data;
  }

  /**
   * Get current user entries
   * GET /api/entries/me
   */
  async getMyEntries(): Promise<MyEntriesResponse> {
    const response = await axiosInstance.get<MyEntriesResponse>(
      `${this.baseURL}/me`,
    );
    return response.data;
  }

  /**
   * Get my role in entry
   * GET /api/entries/{entryId}/my-role
   */
  async getMyRole(entryId: number): Promise<EntryRoleResponse> {
    const response = await axiosInstance.get<EntryRoleResponse>(
      `${this.baseURL}/${entryId}/my-role`,
    );
    return response.data;
  }  /**
   * Get entries by category ID
   * GET /api/entries/category/:categoryId
   *
   * Falls back to legacy /content path during transition.
   */
  async getEntriesByCategoryId(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
    filters?: {
      isFull?: boolean;
      isAcceptingMembers?: boolean;
      captainName?: string;
    },
  ): Promise<EntriesResponse> {
    const params = {
      page,
      limit,
      ...filters,
    };
    const response = await axiosInstance.get<EntriesResponse>(
      `${this.baseURL}/category/${categoryId}`,
      { params },
    );
    return response.data;
  }

  /**
   * Update entry
   * PUT /api/entries/:id
   *
   * @param id Entry ID
   * @param data Entry update data (member IDs)
   * @returns Promise with update result
   *
   * @example
   * const result = await entryService.updateEntry(1, {
   *   memberIds: [10, 15, 20]
   * });
   */
  async updateEntry(
    id: number,
    data: UpdateEntryRequest,
  ): Promise<Entry> {
    const response = await axiosInstance.put<Entry>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete entry
   * DELETE /api/entries/:id
   *
   * @param id Entry ID
   * @returns Promise that resolves when entry is deleted
   *
   * @example
   * await entryService.deleteEntry(1);
   */
  async deleteEntry(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Preview import single entries from Excel file
   * POST /api/entries/import/preview
   * Requires authentication
   *
   * @param file Excel file (.xlsx or .xls)
   * @param contentId Tournament content ID (must be type 'single')
   * @returns Promise with preview result including validation errors
   *
   * @example
   * const preview = await entryService.previewImportSingleEntries(file, 1);
   * if (preview.data.errors.length === 0) {
   *   // Proceed to confirm import
   * }
   */
  async previewImportSingleEntries(
    file: File,
    contentId: number,
  ): Promise<ImportEntriesPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentId", contentId.toString());

    const response = await axiosInstance.post<ImportEntriesPreviewResult>(
      `${this.baseURL}/import/preview`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  /**
   * Confirm import single entries
   * POST /api/entries/import/confirm
   * Requires authentication
   *
   * @param data Import confirmation data with entries
   * @returns Promise with import result
   *
   * @example
   * const result = await entryService.confirmImportSingleEntries({
   *   contentId: 1,
   *   entries: previewData.entries
   * });
   * console.log(`Created ${result.data.created} entries`);
   */
  async confirmImportSingleEntries(
    data: ConfirmImportSingleEntriesRequest,
  ): Promise<ImportEntriesConfirmResult> {
    const response = await axiosInstance.post<ImportEntriesConfirmResult>(
      `${this.baseURL}/import/confirm`,
      data,
    );
    return response.data;
  }

  /**
   * Preview import double entries from Excel file
   * POST /api/entries/import-double/preview
   * Requires authentication
   *
   * @param file Excel file (.xlsx or .xls)
   * @param contentId Tournament content ID (must be type 'double')
   * @returns Promise with preview result including validation errors
   *
   * @example
   * const preview = await entryService.previewImportDoubleEntries(file, 2);
   */
  async previewImportDoubleEntries(
    file: File,
    contentId: number,
  ): Promise<ImportEntriesPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentId", contentId.toString());

    try {
      const response = await axiosInstance.post<ImportEntriesPreviewResult>(
        `${this.baseURL}/import/double/preview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch {
      const response = await axiosInstance.post<ImportEntriesPreviewResult>(
        `${this.baseURL}/import-double/preview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    }
  }

  /**
   * Confirm import double entries
   * POST /api/entries/import-double/confirm
   * Requires authentication
   *
   * @param data Import confirmation data with entries
   * @returns Promise with import result
   *
   * @example
   * const result = await entryService.confirmImportDoubleEntries({
   *   contentId: 2,
   *   entries: previewData.entries
   * });
   */
  async confirmImportDoubleEntries(
    data: ConfirmImportDoubleEntriesRequest,
  ): Promise<ImportEntriesConfirmResult> {
    try {
      const response = await axiosInstance.post<ImportEntriesConfirmResult>(
        `${this.baseURL}/import/double/confirm`,
        data,
      );
      return response.data;
    } catch {
      const response = await axiosInstance.post<ImportEntriesConfirmResult>(
        `${this.baseURL}/import-double/confirm`,
        data,
      );
      return response.data;
    }
  }

  /**
   * Preview import team entries from Excel file
   * POST /api/entries/import-team/preview
   * Requires authentication
   *
   * @param file Excel file (.xlsx or .xls)
   * @param contentId Tournament content ID (must be type 'team')
   * @returns Promise with preview result including validation errors
   *
   * @example
   * const preview = await entryService.previewImportTeamEntries(file, 3);
   */
  async previewImportTeamEntries(
    file: File,
    contentId: number,
  ): Promise<ImportEntriesPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentId", contentId.toString());

    try {
      const response = await axiosInstance.post<ImportEntriesPreviewResult>(
        `${this.baseURL}/import/team/preview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch {
      const response = await axiosInstance.post<ImportEntriesPreviewResult>(
        `${this.baseURL}/import-team/preview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    }
  }

  /**
   * Confirm import team entries
   * POST /api/entries/import-team/confirm
   * Requires authentication
   *
   * @param data Import confirmation data with entries
   * @returns Promise with import result
   *
   * @example
   * const result = await entryService.confirmImportTeamEntries({
   *   contentId: 3,
   *   entries: previewData.entries
   * });
   */
  async confirmImportTeamEntries(
    data: ConfirmImportTeamEntriesRequest,
  ): Promise<ImportEntriesConfirmResult> {
    try {
      const response = await axiosInstance.post<ImportEntriesConfirmResult>(
        `${this.baseURL}/import/team/confirm`,
        data,
      );
      return response.data;
    } catch {
      const response = await axiosInstance.post<ImportEntriesConfirmResult>(
        `${this.baseURL}/import-team/confirm`,
        data,
      );
      return response.data;
    }
  }
}

// Export singleton instance
export default new EntryService();
