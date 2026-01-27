import axiosInstance from "@/config/axiosConfig";
import type {
  CreateTournamentRefereeRequest,
  CreateTournamentRefereeResponse,
  AssignRefereesRequest,
  AssignRefereesResponse,
  GetAllTournamentRefereesResponse,
  GetRefereesByTournamentResponse,
  GetAvailableRefereesResponse,
  GetTournamentRefereeResponse,
  UpdateTournamentRefereeRequest,
  UpdateTournamentRefereeResponse,
  UpdateAvailabilityRequest,
  UpdateAvailabilityResponse,
  DeleteTournamentRefereeResponse,
} from "@/types/tournamentReferee.types";

/**
 * Tournament Referee Service
 * Handles all tournament referee-related API calls
 */
class TournamentRefereeService {
  private readonly baseURL = "/tournament-referees";

  /**
   * Create tournament referee
   * POST /api/tournament-referees
   *
   * @param data Tournament referee creation data
   * @returns Promise with created tournament referee
   *
   * @example
   * const referee = await tournamentRefereeService.createTournamentReferee({
   *   tournamentId: 1,
   *   refereeId: 15,
   *   role: "main"
   * });
   */
  async createTournamentReferee(
    data: CreateTournamentRefereeRequest,
  ): Promise<CreateTournamentRefereeResponse> {
    const response = await axiosInstance.post<CreateTournamentRefereeResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  /**
   * Assign multiple referees to a tournament
   * POST /api/tournament-referees/assign
   *
   * @param data Request with tournamentId and refereeIds
   * @returns Promise with assignment result
   *
   * @example
   * const result = await tournamentRefereeService.assignReferees({
   *   tournamentId: 1,
   *   refereeIds: [15, 16, 17, 18, 19]
   * });
   */
  async assignReferees(
    data: AssignRefereesRequest,
  ): Promise<AssignRefereesResponse> {
    const response = await axiosInstance.post<AssignRefereesResponse>(
      `${this.baseURL}/assign`,
      data,
    );
    return response.data;
  }

  /**
   * Get all tournament referees
   * GET /api/tournament-referees
   *
   * @param tournamentId Optional filter by tournament ID
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with paginated tournament referees
   *
   * @example
   * const referees = await tournamentRefereeService.getAllTournamentReferees(1, 0, 20);
   */
  async getAllTournamentReferees(
    tournamentId?: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetAllTournamentRefereesResponse> {
    const params: Record<string, number> = { skip, limit };
    if (tournamentId !== undefined) {
      params.tournamentId = tournamentId;
    }

    const response = await axiosInstance.get<GetAllTournamentRefereesResponse>(
      this.baseURL,
      { params },
    );
    return response.data;
  }

  /**
   * Get referees by tournament ID
   * GET /api/tournament-referees/tournament/:tournamentId
   *
   * @param tournamentId Tournament ID
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with tournament referees
   *
   * @example
   * const referees = await tournamentRefereeService.getRefereesByTournament(1, 0, 20);
   */
  async getRefereesByTournament(
    tournamentId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetRefereesByTournamentResponse> {
    const response = await axiosInstance.get<GetRefereesByTournamentResponse>(
      `${this.baseURL}/tournament/${tournamentId}`,
      { params: { skip, limit } },
    );
    return response.data;
  }

  /**
   * Get available referees for a tournament
   * GET /api/tournament-referees/tournament/:tournamentId/available
   *
   * @param tournamentId Tournament ID
   * @param excludeIds Optional comma-separated referee IDs to exclude
   * @returns Promise with available referees
   *
   * @example
   * const available = await tournamentRefereeService.getAvailableReferees(1, [15, 16]);
   */
  async getAvailableReferees(
    tournamentId: number,
    excludeIds?: number[],
  ): Promise<GetAvailableRefereesResponse> {
    const params: Record<string, string> = {};
    if (excludeIds && excludeIds.length > 0) {
      params.excludeIds = excludeIds.join(",");
    }

    const response = await axiosInstance.get<GetAvailableRefereesResponse>(
      `${this.baseURL}/tournament/${tournamentId}/available`,
      { params },
    );
    return response.data;
  }

  /**
   * Get tournament referee by ID
   * GET /api/tournament-referees/:id
   *
   * @param id Tournament referee ID
   * @returns Promise with tournament referee details
   *
   * @example
   * const referee = await tournamentRefereeService.getTournamentRefereeById(1);
   */
  async getTournamentRefereeById(
    id: number,
  ): Promise<GetTournamentRefereeResponse> {
    const response = await axiosInstance.get<GetTournamentRefereeResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  /**
   * Update tournament referee
   * PUT /api/tournament-referees/:id
   *
   * @param id Tournament referee ID
   * @param data Partial tournament referee data to update
   * @returns Promise with updated tournament referee
   *
   * @example
   * const updated = await tournamentRefereeService.updateTournamentReferee(1, {
   *   role: "main",
   *   isAvailable: true
   * });
   */
  async updateTournamentReferee(
    id: number,
    data: UpdateTournamentRefereeRequest,
  ): Promise<UpdateTournamentRefereeResponse> {
    const response = await axiosInstance.put<UpdateTournamentRefereeResponse>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Update referee availability
   * PATCH /api/tournament-referees/:id/availability
   *
   * @param id Tournament referee ID
   * @param data Availability update data
   * @returns Promise with updated availability
   *
   * @example
   * const updated = await tournamentRefereeService.updateAvailability(1, {
   *   isAvailable: false
   * });
   */
  async updateAvailability(
    id: number,
    data: UpdateAvailabilityRequest,
  ): Promise<UpdateAvailabilityResponse> {
    const response = await axiosInstance.patch<UpdateAvailabilityResponse>(
      `${this.baseURL}/${id}/availability`,
      data,
    );
    return response.data;
  }

  /**
   * Delete tournament referee
   * DELETE /api/tournament-referees/:id
   *
   * @param id Tournament referee ID
   * @returns Promise<void>
   *
   * @example
   * await tournamentRefereeService.deleteTournamentReferee(1);
   */
  async deleteTournamentReferee(
    id: number,
  ): Promise<DeleteTournamentRefereeResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
    return {
      success: true,
      message: "Tournament referee deleted successfully",
      data: undefined,
    };
  }
}

// Export singleton instance
export default new TournamentRefereeService();
