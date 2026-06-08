import axiosInstance from "@/config/axiosConfig";
import type {
  GeneratePlaceholdersRequest,
  GeneratePlaceholdersResponse,
  RandomDrawRequest,
  RandomDrawResponse,
  SaveAssignmentsRequest,
  SaveAssignmentsResponse,
  CalculateStandingsRequest,
  CalculateStandingsResponse,
  GetStandingsByContentResponse,
  SyncStandingsResponse,
  GetQualifiedTeamsResponse,
} from "@/types/groupStanding.types";

/**
 * Group Standing Service
 * Handles all group standing-related API calls
 */
class GroupStandingService {
  private readonly baseURL = "/group-standings";

  /**
   * Generate group placeholders
   * POST /api/group-standings/generate-placeholders
   *
   * @param data Request with contentId
   * @returns Promise with group placeholders
   *
   * @example
   * const result = await groupStandingService.generatePlaceholders({ contentId: 1 });
   */
  async generatePlaceholders(
    data: GeneratePlaceholdersRequest,
  ): Promise<GeneratePlaceholdersResponse> {
    const response = await axiosInstance.post<GeneratePlaceholdersResponse>(
      `${this.baseURL}/generate-placeholders`,
      data,
    );
    return response.data;
  }

  /**
   * Random draw entries
   * POST /api/group-standings/random-draw
   *
   * @param data Request with contentId
   * @returns Promise with random draw result (not saved)
   *
   * @example
   * const result = await groupStandingService.randomDraw({ contentId: 1 });
   */
  async randomDraw(data: RandomDrawRequest): Promise<RandomDrawResponse> {
    const response = await axiosInstance.post<RandomDrawResponse>(
      `${this.baseURL}/random-draw`,
      data,
    );
    return response.data;
  }

  /**
   * Save group assignments
   * POST /api/group-standings/save-assignments
   *
   * @param data Request with contentId and groupAssignments
   * @returns Promise with saved group standings
   *
   * @example
   * const result = await groupStandingService.saveAssignments({
   *   contentId: 1,
   *   groupAssignments: [
   *     { groupName: "Group A", entryIds: [1, 2, 3] },
   *     { groupName: "Group B", entryIds: [4, 5, 6] }
   *   ]
   * });
   */
  async saveAssignments(
    data: SaveAssignmentsRequest,
  ): Promise<SaveAssignmentsResponse> {
    const response = await axiosInstance.post<SaveAssignmentsResponse>(
      `${this.baseURL}/save-assignments`,
      data,
    );

    return response.data;
  }


  /**
   * Calculate group standings
   * POST /api/group-standings/calculate
   *
   * @param data Request with contentId
   * @returns Promise with calculated standings
   *
   * @example
   * const result = await groupStandingService.calculateStandings({ contentId: 1 });
   */
  async calculateStandings(
    data: CalculateStandingsRequest,
  ): Promise<CalculateStandingsResponse> {
    const response = await axiosInstance.post<CalculateStandingsResponse>(
      `${this.baseURL}/calculate`,
      data,
    );

    return response.data;
  }

  /**
   * Get group standings by category ID
   * GET /api/group-standings/:categoryId
   */
  async getStandingsByCategory(
    categoryId: number,
    options?: { groupName?: string },
  ): Promise<GetStandingsByContentResponse> {
    const response = await axiosInstance.get<GetStandingsByContentResponse>(
      `${this.baseURL}/${categoryId}`,
      { params: options },
    );

    return response.data;
  }

  /**
   * Sync standings after match completion
   * POST /api/group-standings/matches/{matchId}/sync
   */
  async syncStandings(matchId: number): Promise<SyncStandingsResponse> {
    const response = await axiosInstance.post<SyncStandingsResponse>(
      `${this.baseURL}/matches/${matchId}/sync`,
    );
    return response.data;
  }

  /**
   * Get qualified teams by category ID
   * GET /api/group-standings/:categoryId/qualified
   */
  async getQualifiedTeamsByCategory(
    categoryId: number,
    options?: { qualifiersPerGroup?: number; page?: number; limit?: number },
  ): Promise<GetQualifiedTeamsResponse> {
    const response = await axiosInstance.get<GetQualifiedTeamsResponse>(
      `${this.baseURL}/${categoryId}/qualified`,
      { params: options }
    );

    return response.data;
  }
}

// Export singleton instance
export default new GroupStandingService();
