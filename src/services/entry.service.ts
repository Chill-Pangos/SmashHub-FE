import axiosInstance from "@/config/axiosConfig";
import type {
  Entry,
  CreateEntryRequest,
  RegisterEntryRequest,
  UpdateEntryRequest,
  ConfirmImportSingleEntriesRequest,
  ConfirmImportDoubleEntriesRequest,
  ConfirmImportTeamEntriesRequest,
  ImportEntriesPreviewResult,
  ImportEntriesConfirmResult,
} from "@/types/entry.types";

/**
 * Entry Service
 * Handles all entry-related API calls
 */
class EntryService {
  private readonly baseURL = "/entries";

  /**
   * Create a new entry (admin/tournament manager)
   * POST /api/entries
   *
   * @param data Entry creation data
   * @returns Promise with created entry data
   *
   * @example
   * const entry = await entryService.createEntry({
   *   contentId: 1,
   *   teamId: 5
   * });
   */
  async createEntry(data: CreateEntryRequest): Promise<Entry> {
    const response = await axiosInstance.post<Entry>(this.baseURL, data);
    return response.data;
  }

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
    const response = await axiosInstance.post<Entry>(
      `${this.baseURL}/register`,
      data,
    );
    return response.data;
  }

  /**
   * Get all entries with pagination
   * GET /api/entries
   *
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of entries
   *
   * @example
   * const entries = await entryService.getAllEntries(0, 20);
   */
  async getAllEntries(skip: number = 0, limit: number = 10): Promise<Entry[]> {
    const response = await axiosInstance.get<Entry[]>(this.baseURL, {
      params: { skip, limit },
    });
    return response.data;
  }

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
   * Get entries by content ID
   * GET /api/entries/content/:contentId
   *
   * @param contentId Tournament content ID
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of entries for the content
   *
   * @example
   * const entries = await entryService.getEntriesByContentId(1, 0, 50);
   */
  async getEntriesByContentId(
    contentId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<Entry[]> {
    const response = await axiosInstance.get<Entry[]>(
      `${this.baseURL}/content/${contentId}`,
      {
        params: { skip, limit },
      },
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
  ): Promise<[number, Entry[]]> {
    const response = await axiosInstance.put<[number, Entry[]]>(
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
    const response = await axiosInstance.post<ImportEntriesConfirmResult>(
      `${this.baseURL}/import-double/confirm`,
      data,
    );
    return response.data;
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
    const response = await axiosInstance.post<ImportEntriesConfirmResult>(
      `${this.baseURL}/import-team/confirm`,
      data,
    );
    return response.data;
  }
}

// Export singleton instance
export default new EntryService();
