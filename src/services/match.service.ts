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
  StartMatchResponse,
  FinalizeMatchResponse,
  GetPendingMatchesResponse,
  GetPendingMatchWithEloResponse,
  PreviewEloChangesResponse,
  ApproveMatchRequest,
  ApproveMatchResponse,
  RejectMatchRequest,
  RejectMatchResponse,
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
   * Get pending matches (waiting for approval)
   * GET /api/matches/pending
   *
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with pending matches
   *
   * @description Chief Referee uses this to get matches waiting for approval
   *
   * @example
   * const pendingMatches = await matchService.getPendingMatches(0, 20);
   */
  async getPendingMatches(
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetPendingMatchesResponse> {
    const response = await axiosInstance.get<GetPendingMatchesResponse>(
      `${this.baseURL}/pending`,
      { params: { skip, limit } },
    );
    return response.data;
  }

  /**
   * Start match
   * POST /api/matches/:id/start
   *
   * @param id Match ID
   * @returns Promise with updated match (status: in_progress, referees assigned)
   *
   * @description Referee uses this to start a match. System auto-assigns available referees.
   *
   * @example
   * const match = await matchService.startMatch(1);
   */
  async startMatch(id: number): Promise<StartMatchResponse> {
    const response = await axiosInstance.post<StartMatchResponse>(
      `${this.baseURL}/${id}/start`,
    );
    return response.data;
  }

  /**
   * Finalize match
   * POST /api/matches/:id/finalize
   *
   * @param id Match ID
   * @returns Promise with completed match
   *
   * @description Referee uses this to finalize a match after all sets are completed.
   * The system will calculate the winner based on sets won and update standings/brackets.
   *
   * @example
   * const match = await matchService.finalizeMatch(1);
   */
  async finalizeMatch(id: number): Promise<FinalizeMatchResponse> {
    const response = await axiosInstance.post<FinalizeMatchResponse>(
      `${this.baseURL}/${id}/finalize`,
    );
    return response.data;
  }

  /**
   * Get pending match with ELO preview
   * GET /api/matches/:id/pending-with-elo
   *
   * @param id Match ID
   * @returns Promise with match details and ELO preview
   *
   * @description Chief Referee uses this to review ELO changes before approving.
   *
   * @example
   * const result = await matchService.getPendingMatchWithElo(15);
   * console.log(result.eloPreview.changes);
   */
  async getPendingMatchWithElo(
    id: number,
  ): Promise<GetPendingMatchWithEloResponse> {
    const response = await axiosInstance.get<GetPendingMatchWithEloResponse>(
      `${this.baseURL}/${id}/pending-with-elo`,
    );
    return response.data;
  }

  /**
   * Preview ELO changes for a match
   * GET /api/matches/:id/elo-preview
   *
   * @param id Match ID
   * @returns Promise with ELO preview
   *
   * @example
   * const preview = await matchService.previewEloChanges(15);
   * console.log(preview.changes);
   */
  async previewEloChanges(id: number): Promise<PreviewEloChangesResponse> {
    const response = await axiosInstance.get<PreviewEloChangesResponse>(
      `${this.baseURL}/${id}/elo-preview`,
    );
    return response.data;
  }

  /**
   * Approve match result
   * POST /api/matches/:id/approve
   *
   * @param id Match ID
   * @param data Optional review notes
   * @returns Promise with approval result
   *
   * @description Chief Referee only. Approves match result and updates ELO.
   *
   * @example
   * const result = await matchService.approveMatch(15, {
   *   reviewNotes: "Result verified via video"
   * });
   */
  async approveMatch(
    id: number,
    data?: ApproveMatchRequest,
  ): Promise<ApproveMatchResponse> {
    const response = await axiosInstance.post<ApproveMatchResponse>(
      `${this.baseURL}/${id}/approve`,
      data || {},
    );
    return response.data;
  }

  /**
   * Reject match result
   * POST /api/matches/:id/reject
   *
   * @param id Match ID
   * @param data Rejection reason (required)
   * @returns Promise with rejection result
   *
   * @description Chief Referee only. Rejects match result, resets status to in_progress.
   *
   * @example
   * const result = await matchService.rejectMatch(15, {
   *   reviewNotes: "Score mismatch in set 2, please verify"
   * });
   */
  async rejectMatch(
    id: number,
    data: RejectMatchRequest,
  ): Promise<RejectMatchResponse> {
    const response = await axiosInstance.post<RejectMatchResponse>(
      `${this.baseURL}/${id}/reject`,
      data,
    );
    return response.data;
  }
}

// Export singleton instance
export default new MatchService();
