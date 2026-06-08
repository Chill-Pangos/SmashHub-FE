import axiosInstance from "@/config/axiosConfig";
import type {
  GetKnockoutBracketTreeResponse,
  GetKnockoutStandingsResponse,
  AdvanceWinnerRequest,
  AdvanceWinnerResponse,
  ValidateKnockoutBracketResponse,
  GenerateKnockoutPlaceholdersRequest,
  GenerateKnockoutBracketTreeResponse,
  FillQualifiersRequest,
  GenerateFromEntriesRequest,
  GetKnockoutBracketsByEntryResponse,
} from "@/types/knockoutBracket.types";

/**
 * Knockout Bracket Service
 * Handles all knockout bracket-related API calls
 */
class KnockoutBracketService {
  private readonly baseURL = "/knockout-brackets";

  /**
   * Generate bracket placeholders
   * POST /api/knockout-brackets/placeholders
   */
  async generatePlaceholders(
    data: GenerateKnockoutPlaceholdersRequest,
  ): Promise<GenerateKnockoutBracketTreeResponse> {
    const response = await axiosInstance.post<GenerateKnockoutBracketTreeResponse>(
      `${this.baseURL}/placeholders`,
      data,
    );
    return response.data;
  }

  /**
   * Fill qualifiers into bracket
   * POST /api/knockout-brackets/fill-qualifiers
   */
  async fillQualifiers(
    data: FillQualifiersRequest,
  ): Promise<GenerateKnockoutBracketTreeResponse> {
    const response = await axiosInstance.post<GenerateKnockoutBracketTreeResponse>(
      `${this.baseURL}/fill-qualifiers`,
      data,
    );
    return response.data;
  }

  /**
   * Generate bracket from entries
   * POST /api/knockout-brackets/from-entries
   */
  async generateFromEntries(
    data: GenerateFromEntriesRequest,
  ): Promise<GenerateKnockoutBracketTreeResponse> {
    const response = await axiosInstance.post<GenerateKnockoutBracketTreeResponse>(
      `${this.baseURL}/from-entries`,
      data,
    );
    return response.data;
  }

  /**
   * Advance winner
   * POST /api/knockout-brackets/advance-winner
   *
   * @param data Request with bracketId and winnerEntryId
   * @returns Promise with updated knockout bracket
   *
   * @example
   * const updated = await knockoutBracketService.advanceWinner({
   *   bracketId: 5,
   *   winnerEntryId: 10
   * });
   */
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

  /**
   * Validate knockout brackets
   * POST /api/knockout-brackets/validate
   */
  async validateKnockoutBrackets(
    categoryId: number,
  ): Promise<ValidateKnockoutBracketResponse> {
    const response = await axiosInstance.get<ValidateKnockoutBracketResponse>(
      `${this.baseURL}/validate/${categoryId}`,
    );
    return response.data;
  }

  /**
   * Get knockout bracket tree by category ID
   * GET /api/knockout-brackets/tree/{categoryId}
   */
  async getKnockoutBracketTreeByCategory(
    categoryId: number,
  ): Promise<GetKnockoutBracketTreeResponse> {
    const response = await axiosInstance.get<GetKnockoutBracketTreeResponse>(
      `${this.baseURL}/tree/${categoryId}`,
    );
    return response.data;
  }

  /**
   * Get knockout standings by category ID
   * GET /api/knockout-brackets/standings/{categoryId}
   */
  async getKnockoutStandingsByCategory(
    categoryId: number,
  ): Promise<GetKnockoutStandingsResponse> {
    const response = await axiosInstance.get<GetKnockoutStandingsResponse>(
      `${this.baseURL}/standings/${categoryId}`,
    );
    return response.data;
  }

  /**
   * Get entry brackets by category ID
   * GET /api/knockout-brackets/category/{categoryId}/entry
   */
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

// Export singleton instance
export default new KnockoutBracketService();
