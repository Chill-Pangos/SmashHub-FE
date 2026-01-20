import axiosInstance from "@/config/axiosConfig";
import type {
  CreateMatchRequest,
  CreateMatchResponse,
  UpdateMatchRequest,
  UpdateMatchResponse,
  GetMatchResponse,
  GetMatchesResponse,
  GetMatchesByScheduleResponse,
  GetMatchesByStatusResponse,
  DeleteMatchResponse,
  StartMatchRequest,
  StartMatchResponse,
  FinalizeMatchRequest,
  FinalizeMatchResponse,
  MatchStatus,
} from "@/types/match.types";

/**
 * Match Service
 * Handles all match-related API calls
 */
class MatchService {
  private readonly baseURL = "/matches";

  /**
   * Create match
   * POST /api/matches
   *
   * @param data Match creation data
   * @returns Promise with created match
   *
   * @example
   * const match = await matchService.createMatch({
   *   scheduleId: 1,
   *   entryAId: 5,
   *   entryBId: 8,
   *   status: "scheduled"
   * });
   */
  async createMatch(data: CreateMatchRequest): Promise<CreateMatchResponse> {
    const response = await axiosInstance.post<CreateMatchResponse>(
      this.baseURL,
      data,
    );

    return response.data;
  }

  /**
   * Get all matches
   * GET /api/matches
   *
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with matches
   *
   * @example
   * const matches = await matchService.getAllMatches(0, 20);
   */
  async getAllMatches(
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetMatchesResponse> {
    const response = await axiosInstance.get<GetMatchesResponse>(this.baseURL, {
      params: { skip, limit },
    });

    return response.data;
  }

  /**
   * Get match by ID
   * GET /api/matches/:id
   *
   * @param id Match ID
   * @returns Promise with match details
   *
   * @example
   * const match = await matchService.getMatchById(1);
   */
  async getMatchById(id: number): Promise<GetMatchResponse> {
    const response = await axiosInstance.get<GetMatchResponse>(
      `${this.baseURL}/${id}`,
    );

    return response.data;
  }

  /**
   * Get matches by schedule ID
   * GET /api/matches/schedule/:scheduleId
   *
   * @param scheduleId Schedule ID
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with matches
   *
   * @example
   * const matches = await matchService.getMatchesBySchedule(1, 0, 10);
   */
  async getMatchesBySchedule(
    scheduleId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetMatchesByScheduleResponse> {
    const response = await axiosInstance.get<GetMatchesByScheduleResponse>(
      `${this.baseURL}/schedule/${scheduleId}`,
      { params: { skip, limit } },
    );

    return response.data;
  }

  /**
   * Get matches by status
   * GET /api/matches/status/:status
   *
   * @param status Match status
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with matches
   *
   * @example
   * const matches = await matchService.getMatchesByStatus("in_progress", 0, 10);
   */
  async getMatchesByStatus(
    status: MatchStatus,
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetMatchesByStatusResponse> {
    const response = await axiosInstance.get<GetMatchesByStatusResponse>(
      `${this.baseURL}/status/${status}`,
      { params: { skip, limit } },
    );

    return response.data;
  }

  /**
   * Update match
   * PUT /api/matches/:id
   *
   * @param id Match ID
   * @param data Partial match data to update
   * @returns Promise with updated match
   *
   * @example
   * const updated = await matchService.updateMatch(1, {
   *   status: "completed",
   *   winnerEntryId: 5
   * });
   */
  async updateMatch(
    id: number,
    data: UpdateMatchRequest,
  ): Promise<UpdateMatchResponse> {
    const response = await axiosInstance.put<UpdateMatchResponse>(
      `${this.baseURL}/${id}`,
      data,
    );

    return response.data;
  }

  /**
   * Delete match
   * DELETE /api/matches/:id
   *
   * @param id Match ID
   * @returns Promise<void>
   *
   * @example
   * await matchService.deleteMatch(1);
   */
  async deleteMatch(id: number): Promise<DeleteMatchResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);

    return {
      success: true,
      message: "Match deleted successfully",
      data: undefined,
    };
  }

  /**
   * Start match
   * POST /api/matches/start
   *
   * @param data Request with matchId
   * @returns Promise with updated match
   *
   * @example
   * const match = await matchService.startMatch({ matchId: 1 });
   */
  async startMatch(data: StartMatchRequest): Promise<StartMatchResponse> {
    const response = await axiosInstance.post<StartMatchResponse>(
      `${this.baseURL}/start`,
      data,
    );

    return response.data;
  }

  /**
   * Finalize match
   * POST /api/matches/finalize
   *
   * @param data Request with matchId and winnerEntryId
   * @returns Promise with updated match
   *
   * @example
   * const match = await matchService.finalizeMatch({
   *   matchId: 1,
   *   winnerEntryId: 5
   * });
   */
  async finalizeMatch(
    data: FinalizeMatchRequest,
  ): Promise<FinalizeMatchResponse> {
    const response = await axiosInstance.post<FinalizeMatchResponse>(
      `${this.baseURL}/finalize`,
      data,
    );

    return response.data;
  }
}

// Export singleton instance
export default new MatchService();
