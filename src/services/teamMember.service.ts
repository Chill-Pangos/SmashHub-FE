import axiosInstance from "@/config/axiosConfig";
import type {
  TeamMember,
  CreateTeamMemberRequest,
  UpdateTeamMemberRequest,
} from "@/types/team.types";

/**
 * Team Member Service
 * Handles all team member-related API calls
 */
class TeamMemberService {
  private readonly baseURL = "/team-members";

  /**
   * Create a new team member
   * POST /api/team-members
   *
   * @param data Team member creation data
   * @returns Promise with created team member data
   *
   * @example
   * const member = await teamMemberService.createTeamMember({
   *   teamId: 1,
   *   userId: 5,
   *   role: "team_manager"
   * });
   */
  async createTeamMember(data: CreateTeamMemberRequest): Promise<TeamMember> {
    const response = await axiosInstance.post<TeamMember>(this.baseURL, data);
    return response.data;
  }

  /**
   * Get all team members with pagination
   * GET /api/team-members
   *
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of team members
   *
   * @example
   * const members = await teamMemberService.getAllTeamMembers(0, 20);
   */
  async getAllTeamMembers(
    skip: number = 0,
    limit: number = 10,
  ): Promise<TeamMember[]> {
    const response = await axiosInstance.get<TeamMember[]>(this.baseURL, {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Get team member by ID
   * GET /api/team-members/:id
   *
   * @param id Team member ID
   * @returns Promise with team member data
   *
   * @example
   * const member = await teamMemberService.getTeamMemberById(1);
   */
  async getTeamMemberById(id: number): Promise<TeamMember> {
    const response = await axiosInstance.get<TeamMember>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  /**
   * Get members by team ID
   * GET /api/team-members/team/:teamId
   *
   * @param teamId Team ID
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of members in the team
   *
   * @example
   * const members = await teamMemberService.getMembersByTeamId(1, 0, 50);
   */
  async getMembersByTeamId(
    teamId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<TeamMember[]> {
    const response = await axiosInstance.get<TeamMember[]>(
      `${this.baseURL}/team/${teamId}`,
      {
        params: { skip, limit },
      },
    );
    return response.data;
  }

  /**
   * Get teams by user ID
   * GET /api/team-members/user/:userId
   *
   * @param userId User ID
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of teams the user is a member of
   *
   * @example
   * const teams = await teamMemberService.getTeamsByUserId(5, 0, 50);
   */
  async getTeamsByUserId(
    userId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<TeamMember[]> {
    const response = await axiosInstance.get<TeamMember[]>(
      `${this.baseURL}/user/${userId}`,
      {
        params: { skip, limit },
      },
    );
    return response.data;
  }

  /**
   * Update team member
   * PUT /api/team-members/:id
   *
   * @param id Team member ID
   * @param data Team member update data (role)
   * @returns Promise with update result
   *
   * @example
   * const result = await teamMemberService.updateTeamMember(1, {
   *   role: "team_manager"
   * });
   */
  async updateTeamMember(
    id: number,
    data: UpdateTeamMemberRequest,
  ): Promise<[number, TeamMember[]]> {
    const response = await axiosInstance.put<[number, TeamMember[]]>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete team member
   * DELETE /api/team-members/:id
   *
   * @param id Team member ID
   * @returns Promise that resolves when team member is deleted
   *
   * @example
   * await teamMemberService.deleteTeamMember(5);
   */
  async deleteTeamMember(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }
}

// Export singleton instance
export default new TeamMemberService();
