import axiosInstance from "@/config/axiosConfig";
import type {
  CreateTournamentRequest,
  CreateTournamentResponse,
  Tournament,
  UpdateTournamentRequest,
  TournamentSearchFilters,
  TournamentSearchResponseWithPagination,
  TournamentStatus,
  UpcomingTournamentStatusChangesResponse,
  UpdateTournamentStatusesResponse,
  TournamentListResponse,
} from "@/types/tournament.types";

/**
 * Tournament Service
 * Handles all tournament-related API calls
 */
class TournamentService {
  private readonly baseURL = "/tournaments";

  /**
   * Create a new tournament
   * POST /api/tournaments
   *
   * @param data Tournament creation data
   * @returns Promise with created tournament data
   *
   * @example
   * const tournament = await tournamentService.createTournament({
   *   name: "Spring Championship 2026",
   *   startDate: "2026-03-15T09:00:00Z",
   *   location: "National Stadium",
   *   status: "upcoming",
   *   contents: [
   *     {
   *       name: "Men's Singles",
   *       type: "single",
   *       maxEntries: 32,
   *       maxSets: 3,
   *       racketCheck: true
   *     }
   *   ]
   * });
   */
  async createTournament(
    data: CreateTournamentRequest,
  ): Promise<CreateTournamentResponse> {
    const { contents, ...rest } = data;
    const payload = {
      ...rest,
      categories: data.categories ?? contents,
    };
    const response = await axiosInstance.post<Tournament>(
      this.baseURL,
      payload,
    );

    // Transform axios response to ApiResponse format
    return {
      success: true,
      message: "Tournament created successfully",
      data: response.data,
    };
  }

  /**
   * Get all tournaments with pagination
   * GET /api/tournaments
   *
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with tournaments list and pagination info
   *
   * @example
   * const response = await tournamentService.getAllTournaments(0, 20);
   * console.log(response.tournaments); // Array of tournaments
   * console.log(response.pagination); // Pagination info
   */
  async getAllTournaments(
    skip: number = 0,
    limit: number = 10,
  ): Promise<TournamentListResponse> {
    const response = await axiosInstance.get<TournamentListResponse>(
      this.baseURL,
      {
        params: { skip, limit },
      },
    );
    return response.data;
  }

  /**
   * Search tournaments with filters
   * GET /api/tournaments/search
   *
   * @param filters Search filters (userId, createdBy, age, ELO, gender, pagination, etc.)
   * @returns Promise with filtered tournaments array and pagination info
   *
   * @example
   * const result = await tournamentService.searchTournaments({
   *   gender: "male",
   *   minAge: 18,
   *   maxAge: 35,
   *   minElo: 1200,
   *   maxElo: 1800,
   *   skip: 0,
   *   limit: 20
   * });
   * console.log(`Found ${result.pagination.total} tournaments`);
   */
  async searchTournaments(
    filters: TournamentSearchFilters,
  ): Promise<TournamentSearchResponseWithPagination> {
    const response =
      await axiosInstance.get<TournamentSearchResponseWithPagination>(
        `${this.baseURL}/search`,
        { params: filters },
      );
    return response.data;
  }

  /**
   * Get tournament by ID
   * GET /api/tournaments/:id
   *
   * @param id Tournament ID
   * @returns Promise with tournament details including contents
   *
   * @example
   * const tournament = await tournamentService.getTournamentById(1);
   */
  async getTournamentById(id: number): Promise<Tournament> {
    const response = await axiosInstance.get<Tournament>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  /**
   * Get tournaments by status
   * GET /api/tournaments/status/:status
   *
   * @param status Tournament status (upcoming, registration_open, registration_closed, ongoing, completed)
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with tournaments list and pagination info
   *
   * @example
   * const response = await tournamentService.getTournamentsByStatus("registration_open", 0, 10);
   */
  async getTournamentsByStatus(
    status: TournamentStatus,
    skip: number = 0,
    limit: number = 10,
  ): Promise<TournamentListResponse> {
    const response = await axiosInstance.get<TournamentListResponse>(
      `${this.baseURL}/status/${status}`,
      { params: { skip, limit } },
    );
    return response.data;
  }

  /**
   * Update tournament
   * PUT /api/tournaments/:id
   *
   * @param id Tournament ID
   * @param data Partial tournament data to update
   * @returns Promise with updated tournament
   *
   * @example
   * const updated = await tournamentService.updateTournament(1, {
   *   status: "ongoing",
   *   endDate: "2026-03-20T18:00:00Z"
   * });
   */
  async updateTournament(
    id: number,
    data: UpdateTournamentRequest,
  ): Promise<Tournament> {
    const { contents, ...rest } = data;
    const payload = {
      ...rest,
      categories: data.categories ?? contents,
    };
    const response = await axiosInstance.put<Tournament>(
      `${this.baseURL}/${id}`,
      payload,
    );
    return response.data;
  }

  /**
   * Manually trigger tournament status updates
   * POST /api/tournaments/update-statuses
   */
  async updateTournamentStatuses(): Promise<UpdateTournamentStatusesResponse> {
    const response = await axiosInstance.post<UpdateTournamentStatusesResponse>(
      `${this.baseURL}/update-statuses`,
    );
    return response.data;
  }

  /**
   * Preview upcoming tournament status changes
   * GET /api/tournaments/upcoming-changes
   *
   * @param hours Number of hours to look ahead (default: 24)
   * @returns Promise with tournaments opening, closing, and brackets generating soon
   *
   * @example
   * const changes = await tournamentService.getUpcomingTournamentStatusChanges(48);
   * console.log(changes.data.openingSoon); // Tournaments about to open registration
   * console.log(changes.data.closingSoon); // Tournaments about to close registration
   * console.log(changes.data.bracketsSoon); // Tournaments about to generate brackets
   */
  async getUpcomingTournamentStatusChanges(
    hours: number = 24,
  ): Promise<UpcomingTournamentStatusChangesResponse> {
    const response =
      await axiosInstance.get<UpcomingTournamentStatusChangesResponse>(
        `${this.baseURL}/upcoming-changes`,
        { params: { hours } },
      );
    return response.data;
  }

  /**
   * Delete tournament
   * DELETE /api/tournaments/:id
   *
   * @param id Tournament ID
   * @returns Promise<void>
   *
   * @example
   * await tournamentService.deleteTournament(1);
   */
  async deleteTournament(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }
}

// Export singleton instance
export default new TournamentService();
