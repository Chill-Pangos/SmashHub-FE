import axiosInstance from "@/config/axiosConfig";
import type {
  CreateTournamentRefereeRequest,
  CreateTournamentRefereeResponse,
  InviteRefereeRequest,
  InviteRefereeResponse,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  RejectInvitationRequest,
  RejectInvitationResponse,
  CancelInvitationRequest,
  CancelInvitationResponse,
  RemoveRefereeRequest,
  RemoveRefereeResponse,
  UpdateRefereeRoleRequest,
  UpdateRefereeRoleResponse,
  AssignRefereesRequest,
  AssignRefereesResponse,
  GetAllTournamentRefereesResponse,
  GetRefereesByTournamentResponse,
  GetInvitationsByTournamentResponse,
  GetAvailableRefereesResponse,
  GetAvailableChiefRefereesResponse,
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
   * Get available chief referees
   * GET /api/tournament-referees/available-chief-referees
   *
   * @returns Promise with available chief referees list
   *
   * @description Tournament organizer uses this to get a list of available chief referees
   * to assign to a tournament during tournament creation.
   *
   * @example
   * const chiefReferees = await tournamentRefereeService.getAvailableChiefReferees();
   */
  async getAvailableChiefReferees(): Promise<GetAvailableChiefRefereesResponse> {
    const response = await axiosInstance.get<GetAvailableChiefRefereesResponse>(
      `${this.baseURL}/available-chief-referees`,
    );
    return response.data;
  }

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
   * Invite referee to tournament
   * POST /api/tournament-referees/invite
   */
  async inviteReferee(
    data: InviteRefereeRequest,
  ): Promise<InviteRefereeResponse> {
    const response = await axiosInstance.post<InviteRefereeResponse>(
      `${this.baseURL}/invite`,
      data,
    );
    return response.data;
  }

  /**
   * Accept invitation
   * POST /api/tournament-referees/accept-invitation
   */
  async acceptInvitation(
    data: AcceptInvitationRequest,
  ): Promise<AcceptInvitationResponse> {
    const response = await axiosInstance.post<AcceptInvitationResponse>(
      `${this.baseURL}/accept-invitation`,
      data,
    );
    return response.data;
  }

  /**
   * Reject invitation
   * POST /api/tournament-referees/reject-invitation
   */
  async rejectInvitation(
    data: RejectInvitationRequest,
  ): Promise<RejectInvitationResponse> {
    const response = await axiosInstance.post<RejectInvitationResponse>(
      `${this.baseURL}/reject-invitation`,
      data,
    );
    return response.data;
  }

  /**
   * Cancel invitation
   * POST /api/tournament-referees/cancel-invitation
   */
  async cancelInvitation(
    data: CancelInvitationRequest,
  ): Promise<CancelInvitationResponse> {
    const response = await axiosInstance.post<CancelInvitationResponse>(
      `${this.baseURL}/cancel-invitation`,
      data,
    );
    return response.data;
  }

  /**
   * Remove referee from tournament
   * POST /api/tournament-referees/remove
   */
  async removeReferee(
    data: RemoveRefereeRequest,
  ): Promise<RemoveRefereeResponse> {
    const response = await axiosInstance.post<RemoveRefereeResponse>(
      `${this.baseURL}/remove`,
      data,
    );
    return response.data;
  }

  /**
   * Update referee role within tournament
   * POST /api/tournament-referees/update-role
   */
  async updateRefereeRole(
    data: UpdateRefereeRoleRequest,
  ): Promise<UpdateRefereeRoleResponse> {
    const response = await axiosInstance.post<UpdateRefereeRoleResponse>(
      `${this.baseURL}/update-role`,
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
    page: number = 1,
    limit: number = 10,
  ): Promise<GetAllTournamentRefereesResponse> {
    const params: Record<string, number> = { page, limit };
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
    page: number = 1,
    limit: number = 10,
  ): Promise<GetRefereesByTournamentResponse> {
    const response = await axiosInstance.get<GetRefereesByTournamentResponse>(
      `${this.baseURL}/tournament/${tournamentId}`,
      { params: { page, limit } },
    );
    return response.data;
  }

  /**
   * Get invitations by tournament
   * GET /api/tournament-referees/tournament/{tournamentId}/invitations
   */
  async getInvitationsByTournament(
    tournamentId: number,
    status?: string,
  ): Promise<GetInvitationsByTournamentResponse> {
    const response =
      await axiosInstance.get<GetInvitationsByTournamentResponse>(
        `${this.baseURL}/tournament/${tournamentId}/invitations`,
        { params: status ? { status } : undefined },
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
