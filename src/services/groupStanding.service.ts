import axiosInstance from "@/config/axiosConfig";
import type {
  GeneratePlaceholdersRequest,
  GeneratePlaceholdersResponse,
  RandomDrawRequest,
  RandomDrawResponse,
  SaveAssignmentsRequest,
  SaveAssignmentsResponse,
  RandomDrawAndSaveRequest,
  RandomDrawAndSaveResponse,
  CalculateStandingsRequest,
  CalculateStandingsResponse,
  GetStandingsByContentResponse,
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
   * Random draw and save
   * POST /api/group-standings/random-draw-and-save
   *
   * @param data Request with contentId
   * @returns Promise with drawn and saved group standings
   *
   * @example
   * const result = await groupStandingService.randomDrawAndSave({ contentId: 1 });
   */
  async randomDrawAndSave(
    data: RandomDrawAndSaveRequest,
  ): Promise<RandomDrawAndSaveResponse> {
    const response = await axiosInstance.post<RandomDrawAndSaveResponse>(
      `${this.baseURL}/random-draw-and-save`,
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
   * Get group standings by content ID
   * GET /api/group-standings/:contentId
   *
   * @param contentId Tournament content ID
   * @returns Promise with group standings
   *
   * @example
   * const standings = await groupStandingService.getStandingsByContent(1);
   */
  async getStandingsByContent(
    contentId: number,
  ): Promise<GetStandingsByContentResponse> {
    const response = await axiosInstance.get<GetStandingsByContentResponse>(
      `${this.baseURL}/${contentId}`,
    );

    return response.data;
  }

  /**
   * Get qualified teams
   * GET /api/group-standings/qualified/:contentId
   *
   * @param contentId Tournament content ID
   * @returns Promise with qualified teams
   *
   * @example
   * const qualified = await groupStandingService.getQualifiedTeams(1);
   */
  async getQualifiedTeams(
    contentId: number,
  ): Promise<GetQualifiedTeamsResponse> {
    const response = await axiosInstance.get<GetQualifiedTeamsResponse>(
      `${this.baseURL}/qualified/${contentId}`,
    );

    return response.data;
  }
}

// Export singleton instance
export default new GroupStandingService();
