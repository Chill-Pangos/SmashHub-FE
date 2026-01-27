import axiosInstance from "@/config/axiosConfig";
import type {
  CreateKnockoutBracketRequest,
  CreateKnockoutBracketResponse,
  UpdateKnockoutBracketRequest,
  UpdateKnockoutBracketResponse,
  GetKnockoutBracketResponse,
  GetKnockoutBracketsResponse,
  GetKnockoutBracketsByContentResponse,
  DeleteKnockoutBracketResponse,
  GenerateKnockoutBracketRequest,
  GenerateKnockoutBracketResponse,
  GenerateFromGroupsRequest,
  GenerateFromGroupsResponse,
  AdvanceWinnerRequest,
  AdvanceWinnerResponse,
} from "@/types/knockoutBracket.types";

/**
 * Knockout Bracket Service
 * Handles all knockout bracket-related API calls
 */
class KnockoutBracketService {
  private readonly baseURL = "/knockout-brackets";

  /**
   * Create knockout bracket
   * POST /api/knockout-brackets
   *
   * @param data Knockout bracket creation data
   * @returns Promise with created knockout bracket
   *
   * @example
   * const bracket = await knockoutBracketService.createKnockoutBracket({
   *   contentId: 1,
   *   roundNumber: 2,
   *   bracketPosition: 0,
   *   entryAId: 5,
   *   entryBId: 8
   * });
   */
  async createKnockoutBracket(
    data: CreateKnockoutBracketRequest,
  ): Promise<CreateKnockoutBracketResponse> {
    const response = await axiosInstance.post<CreateKnockoutBracketResponse>(
      this.baseURL,
      data,
    );

    return response.data;
  }

  /**
   * Get all knockout brackets
   * GET /api/knockout-brackets
   *
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with knockout brackets
   *
   * @example
   * const brackets = await knockoutBracketService.getAllKnockoutBrackets(0, 20);
   */
  async getAllKnockoutBrackets(
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetKnockoutBracketsResponse> {
    const response = await axiosInstance.get<GetKnockoutBracketsResponse>(
      this.baseURL,
      { params: { skip, limit } },
    );

    return response.data;
  }

  /**
   * Get knockout bracket by ID
   * GET /api/knockout-brackets/:id
   *
   * @param id Knockout bracket ID
   * @returns Promise with knockout bracket details
   *
   * @example
   * const bracket = await knockoutBracketService.getKnockoutBracketById(1);
   */
  async getKnockoutBracketById(
    id: number,
  ): Promise<GetKnockoutBracketResponse> {
    const response = await axiosInstance.get<GetKnockoutBracketResponse>(
      `${this.baseURL}/${id}`,
    );

    return response.data;
  }

  /**
   * Get knockout brackets by content ID
   * GET /api/knockout-brackets/content/:contentId
   *
   * @param contentId Tournament content ID
   * @returns Promise with knockout brackets
   *
   * @example
   * const brackets = await knockoutBracketService.getKnockoutBracketsByContent(1);
   */
  async getKnockoutBracketsByContent(
    contentId: number,
  ): Promise<GetKnockoutBracketsByContentResponse> {
    const response =
      await axiosInstance.get<GetKnockoutBracketsByContentResponse>(
        `${this.baseURL}/content/${contentId}`,
      );

    return response.data;
  }

  /**
   * Update knockout bracket
   * PUT /api/knockout-brackets/:id
   *
   * @param id Knockout bracket ID
   * @param data Partial knockout bracket data to update
   * @returns Promise with updated knockout bracket
   *
   * @example
   * const updated = await knockoutBracketService.updateKnockoutBracket(1, {
   *   winnerEntryId: 5,
   *   status: "completed"
   * });
   */
  async updateKnockoutBracket(
    id: number,
    data: UpdateKnockoutBracketRequest,
  ): Promise<UpdateKnockoutBracketResponse> {
    const response = await axiosInstance.put<UpdateKnockoutBracketResponse>(
      `${this.baseURL}/${id}`,
      data,
    );

    return response.data;
  }

  /**
   * Delete knockout bracket
   * DELETE /api/knockout-brackets/:id
   *
   * @param id Knockout bracket ID
   * @returns Promise<void>
   *
   * @example
   * await knockoutBracketService.deleteKnockoutBracket(1);
   */
  async deleteKnockoutBracket(
    id: number,
  ): Promise<DeleteKnockoutBracketResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);

    return {
      success: true,
      message: "Knockout bracket deleted successfully",
      data: undefined,
    };
  }

  /**
   * Generate knockout bracket
   * POST /api/knockout-brackets/generate
   *
   * @param data Request with contentId
   * @returns Promise with generated knockout brackets
   *
   * @example
   * const brackets = await knockoutBracketService.generateKnockoutBracket({ contentId: 1 });
   */
  async generateKnockoutBracket(
    data: GenerateKnockoutBracketRequest,
  ): Promise<GenerateKnockoutBracketResponse> {
    const response = await axiosInstance.post<GenerateKnockoutBracketResponse>(
      `${this.baseURL}/generate`,
      data,
    );

    return response.data;
  }

  /**
   * Generate bracket from groups
   * POST /api/knockout-brackets/generate-from-groups
   *
   * @param data Request with contentId and teamsPerGroup
   * @returns Promise with generated knockout brackets
   *
   * @example
   * const brackets = await knockoutBracketService.generateFromGroups({
   *   contentId: 1,
   *   teamsPerGroup: 2
   * });
   */
  async generateFromGroups(
    data: GenerateFromGroupsRequest,
  ): Promise<GenerateFromGroupsResponse> {
    const response = await axiosInstance.post<GenerateFromGroupsResponse>(
      `${this.baseURL}/generate-from-groups`,
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
    data: AdvanceWinnerRequest,
  ): Promise<AdvanceWinnerResponse> {
    const response = await axiosInstance.post<AdvanceWinnerResponse>(
      `${this.baseURL}/advance-winner`,
      data,
    );

    return response.data;
  }
}

// Export singleton instance
export default new KnockoutBracketService();
