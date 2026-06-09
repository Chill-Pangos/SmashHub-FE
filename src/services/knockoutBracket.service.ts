import axiosInstance from "@/config/axiosConfig";
import type {
  GetKnockoutBracketTreeResponse,
  GetKnockoutStandingsResponse,
  AdvanceWinnerRequest,
  AdvanceWinnerResponse,
  ValidateKnockoutBracketResponse,
  GenerateKnockoutPlaceholdersRequest,
  PreviewKnockoutBracketTreeResponse,
  FillQualifiersRequest,
  GenerateFromEntriesRequest,
  GetKnockoutBracketsByEntryResponse,
  SaveKnockoutAssignmentsRequest,
  SaveKnockoutAssignmentsResponse,
} from "@/types/knockoutBracket.types";

/**
 * Knockout Bracket Service
 * Handles all knockout bracket-related API calls
 */
class KnockoutBracketService {
  private readonly baseURL = "/knockout-brackets";

  async previewPlaceholders(
    data: GenerateKnockoutPlaceholdersRequest,
  ): Promise<PreviewKnockoutBracketTreeResponse> {
    const response = await axiosInstance.post<PreviewKnockoutBracketTreeResponse>(
      `${this.baseURL}/preview-placeholders`,
      data,
    );
    return response.data;
  }

  async previewFillQualifiers(
    data: FillQualifiersRequest,
  ): Promise<PreviewKnockoutBracketTreeResponse> {
    const response = await axiosInstance.post<PreviewKnockoutBracketTreeResponse>(
      `${this.baseURL}/preview-fill-qualifiers`,
      data,
    );
    return response.data;
  }

  async previewFromEntries(
    data: GenerateFromEntriesRequest,
  ): Promise<PreviewKnockoutBracketTreeResponse> {
    const response = await axiosInstance.post<PreviewKnockoutBracketTreeResponse>(
      `${this.baseURL}/preview-from-entries`,
      data,
    );
    return response.data;
  }

  async saveAssignments(
    data: SaveKnockoutAssignmentsRequest,
  ): Promise<SaveKnockoutAssignmentsResponse> {
    const response = await axiosInstance.post<SaveKnockoutAssignmentsResponse>(
      `${this.baseURL}/save-assignments`,
      data,
    );
    return response.data;
  }

  async advanceWinner(
    id: number,
    data: AdvanceWinnerRequest,
  ): Promise<AdvanceWinnerResponse> {
    const response = await axiosInstance.post<AdvanceWinnerResponse>(
      `${this.baseURL}/${id}/advance-winner`,
      data,
    );
    return response.data;
  }

  async validateKnockoutBrackets(
    categoryId: number,
  ): Promise<ValidateKnockoutBracketResponse> {
    const response = await axiosInstance.get<ValidateKnockoutBracketResponse>(
      `${this.baseURL}/validate/${categoryId}`,
    );
    return response.data;
  }

  async getKnockoutBracketTreeByCategory(
    categoryId: number,
  ): Promise<GetKnockoutBracketTreeResponse> {
    const response = await axiosInstance.get<GetKnockoutBracketTreeResponse>(
      `${this.baseURL}/tree/${categoryId}`,
    );
    return response.data;
  }

  async getKnockoutStandingsByCategory(
    categoryId: number,
  ): Promise<GetKnockoutStandingsResponse> {
    const response = await axiosInstance.get<GetKnockoutStandingsResponse>(
      `${this.baseURL}/standings/${categoryId}`,
    );
    return response.data;
  }

  async getKnockoutBracketsByEntry(
    categoryId: number,
    options?: { entryId?: number; entryName?: string; page?: number; limit?: number }
  ): Promise<GetKnockoutBracketsByEntryResponse> {
    const response = await axiosInstance.get<GetKnockoutBracketsByEntryResponse>(
      `${this.baseURL}/category/${categoryId}/entry`,
      { params: options }
    );
    return response.data;
  }
}

export default new KnockoutBracketService();
