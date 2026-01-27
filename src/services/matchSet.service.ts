import axiosInstance from "@/config/axiosConfig";
import type {
  CreateMatchSetRequest,
  CreateMatchSetResponse,
  CreateMatchSetWithScoreRequest,
  CreateMatchSetWithScoreResponse,
  UpdateMatchSetRequest,
  UpdateMatchSetResponse,
  GetMatchSetResponse,
  GetMatchSetsResponse,
  GetMatchSetsByMatchResponse,
  DeleteMatchSetResponse,
} from "@/types/matchSet.types";

/**
 * Match Set Service
 * Handles all match set-related API calls
 */
class MatchSetService {
  private readonly baseURL = "/match-sets";

  /**
   * Create match set
   * POST /api/match-sets
   *
   * @param data Match set creation data
   * @returns Promise with created match set
   *
   * @example
   * const matchSet = await matchSetService.createMatchSet({
   *   matchId: 1,
   *   setNumber: 1,
   *   entryAScore: 11,
   *   entryBScore: 5
   * });
   */
  async createMatchSet(
    data: CreateMatchSetRequest,
  ): Promise<CreateMatchSetResponse> {
    const response = await axiosInstance.post<CreateMatchSetResponse>(
      this.baseURL,
      data,
    );

    return response.data;
  }

  /**
   * Create match set with score (recommended)
   * POST /api/match-sets/score
   *
   * @param data Match set creation data with validation
   * @returns Promise with created match set
   *
   * @example
   * const matchSet = await matchSetService.createMatchSetWithScore({
   *   matchId: 1,
   *   entryAScore: 11,
   *   entryBScore: 9
   * });
   */
  async createMatchSetWithScore(
    data: CreateMatchSetWithScoreRequest,
  ): Promise<CreateMatchSetWithScoreResponse> {
    const response = await axiosInstance.post<CreateMatchSetWithScoreResponse>(
      `${this.baseURL}/score`,
      data,
    );

    return response.data;
  }

  /**
   * Get all match sets
   * GET /api/match-sets
   *
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with match sets
   *
   * @example
   * const matchSets = await matchSetService.getAllMatchSets(0, 20);
   */
  async getAllMatchSets(
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetMatchSetsResponse> {
    const response = await axiosInstance.get<GetMatchSetsResponse>(
      this.baseURL,
      { params: { skip, limit } },
    );

    return response.data;
  }

  /**
   * Get match set by ID
   * GET /api/match-sets/:id
   *
   * @param id Match set ID
   * @returns Promise with match set details
   *
   * @example
   * const matchSet = await matchSetService.getMatchSetById(1);
   */
  async getMatchSetById(id: number): Promise<GetMatchSetResponse> {
    const response = await axiosInstance.get<GetMatchSetResponse>(
      `${this.baseURL}/${id}`,
    );

    return response.data;
  }

  /**
   * Get match sets by match ID
   * GET /api/match-sets/match/:matchId
   *
   * @param matchId Match ID
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with match sets
   *
   * @example
   * const matchSets = await matchSetService.getMatchSetsByMatch(1, 0, 10);
   */
  async getMatchSetsByMatch(
    matchId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetMatchSetsByMatchResponse> {
    const response = await axiosInstance.get<GetMatchSetsByMatchResponse>(
      `${this.baseURL}/match/${matchId}`,
      { params: { skip, limit } },
    );

    return response.data;
  }

  /**
   * Update match set
   * PUT /api/match-sets/:id
   *
   * @param id Match set ID
   * @param data Partial match set data to update
   * @returns Promise with updated match set
   *
   * @example
   * const updated = await matchSetService.updateMatchSet(1, {
   *   entryAScore: 12,
   *   entryBScore: 10
   * });
   */
  async updateMatchSet(
    id: number,
    data: UpdateMatchSetRequest,
  ): Promise<UpdateMatchSetResponse> {
    const response = await axiosInstance.put<UpdateMatchSetResponse>(
      `${this.baseURL}/${id}`,
      data,
    );

    return response.data;
  }

  /**
   * Delete match set
   * DELETE /api/match-sets/:id
   *
   * @param id Match set ID
   * @returns Promise<void>
   *
   * @example
   * await matchSetService.deleteMatchSet(1);
   */
  async deleteMatchSet(id: number): Promise<DeleteMatchSetResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);

    return {
      success: true,
      message: "Match set deleted successfully",
      data: undefined,
    };
  }
}

// Export singleton instance
export default new MatchSetService();
