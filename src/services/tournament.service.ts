import axiosInstance from "@/config/axiosConfig";
import type {
  CreateTournamentRequest,
  CreateTournamentResponse,
  Tournament,
  UpdateTournamentRequest,
  TournamentSearchFilters,
  TournamentSearchResponse,
  TournamentStatus,
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
    data: CreateTournamentRequest
  ): Promise<CreateTournamentResponse> {
    const response = await axiosInstance.post<Tournament>(this.baseURL, data);

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
   * @returns Promise with array of tournaments
   *
   * @example
   * const tournaments = await tournamentService.getAllTournaments(0, 20);
   */
  async getAllTournaments(
    skip: number = 0,
    limit: number = 10
  ): Promise<Tournament[]> {
    const response = await axiosInstance.get<Tournament[]>(this.baseURL, {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Search tournaments with filters
   * GET /api/tournaments/search
   *
   * @param filters Search filters (userId, createdBy, age, ELO, gender, etc.)
   * @returns Promise with tournaments array and total count
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
   * console.log(`Found ${result.total} tournaments`);
   */
  async searchTournaments(
    filters: TournamentSearchFilters
  ): Promise<TournamentSearchResponse> {
    const response = await axiosInstance.get<TournamentSearchResponse>(
      `${this.baseURL}/search`,
      { params: filters }
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
      `${this.baseURL}/${id}`
    );
    return response.data;
  }

  /**
   * Get tournaments by status
   * GET /api/tournaments/status/:status
   *
   * @param status Tournament status (upcoming, ongoing, completed)
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of tournaments
   *
   * @example
   * const upcomingTournaments = await tournamentService.getTournamentsByStatus("upcoming", 0, 10);
   */
  async getTournamentsByStatus(
    status: TournamentStatus,
    skip: number = 0,
    limit: number = 10
  ): Promise<Tournament[]> {
    const response = await axiosInstance.get<Tournament[]>(
      `${this.baseURL}/status/${status}`,
      { params: { skip, limit } }
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
    data: UpdateTournamentRequest
  ): Promise<Tournament> {
    const response = await axiosInstance.put<Tournament>(
      `${this.baseURL}/${id}`,
      data
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
