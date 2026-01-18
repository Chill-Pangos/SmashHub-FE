import axiosInstance from "@/config/axiosConfig";
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  ConfirmImportTeamsRequest,
  ImportPreviewResult,
  ImportConfirmResult,
} from "@/types/team.types";

/**
 * Team Service
 * Handles all team-related API calls
 */
class TeamService {
  private readonly baseURL = "/teams";

  /**
   * Create a new team
   * POST /api/teams
   *
   * @param data Team creation data
   * @returns Promise with created team data
   *
   * @example
   * const team = await teamService.createTeam({
   *   tournamentId: 1,
   *   name: "Team Alpha",
   *   description: "Elite championship team"
   * });
   */
  async createTeam(data: CreateTeamRequest): Promise<Team> {
    const response = await axiosInstance.post<Team>(this.baseURL, data);
    return response.data;
  }

  /**
   * Get all teams with pagination
   * GET /api/teams
   *
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of teams
   *
   * @example
   * const teams = await teamService.getAllTeams(0, 20);
   */
  async getAllTeams(skip: number = 0, limit: number = 10): Promise<Team[]> {
    const response = await axiosInstance.get<Team[]>(this.baseURL, {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Get team by ID
   * GET /api/teams/:id
   *
   * @param id Team ID
   * @returns Promise with team data including members
   *
   * @example
   * const team = await teamService.getTeamById(1);
   */
  async getTeamById(id: number): Promise<Team> {
    const response = await axiosInstance.get<Team>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Get teams by tournament ID
   * GET /api/teams/tournament/:tournamentId
   *
   * @param tournamentId Tournament ID
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of teams in the tournament
   *
   * @example
   * const teams = await teamService.getTeamsByTournamentId(1, 0, 50);
   */
  async getTeamsByTournamentId(
    tournamentId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<Team[]> {
    const response = await axiosInstance.get<Team[]>(
      `${this.baseURL}/tournament/${tournamentId}`,
      {
        params: { skip, limit },
      },
    );
    return response.data;
  }

  /**
   * Update team
   * PUT /api/teams/:id
   *
   * @param id Team ID
   * @param data Team update data
   * @returns Promise with update result
   *
   * @example
   * const result = await teamService.updateTeam(1, {
   *   name: "Team Alpha Elite",
   *   description: "Championship winning team 2026"
   * });
   */
  async updateTeam(
    id: number,
    data: UpdateTeamRequest,
  ): Promise<[number, Team[]]> {
    const response = await axiosInstance.put<[number, Team[]]>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete team
   * DELETE /api/teams/:id
   *
   * @param id Team ID
   * @returns Promise that resolves when team is deleted
   *
   * @example
   * await teamService.deleteTeam(5);
   */
  async deleteTeam(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Preview import teams from Excel file
   * POST /api/teams/import/preview
   *
   * @param file Excel file (.xlsx or .xls)
   * @returns Promise with preview result including validation errors
   *
   * @example
   * const preview = await teamService.previewImportTeams(file);
   * if (preview.data.errors.length === 0) {
   *   // Proceed to confirm import
   * }
   */
  async previewImportTeams(file: File): Promise<ImportPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ImportPreviewResult>(
      `${this.baseURL}/import/preview`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  /**
   * Confirm import teams
   * POST /api/teams/import/confirm
   *
   * @param data Import confirmation data with teams and members
   * @returns Promise with import result
   *
   * @example
   * const result = await teamService.confirmImportTeams({
   *   tournamentId: 1,
   *   teams: previewData.teams
   * });
   * console.log(`Created ${result.data.created} teams`);
   */
  async confirmImportTeams(
    data: ConfirmImportTeamsRequest,
  ): Promise<ImportConfirmResult> {
    const response = await axiosInstance.post<ImportConfirmResult>(
      `${this.baseURL}/import/confirm`,
      data,
    );
    return response.data;
  }
}

// Export singleton instance
export default new TeamService();
