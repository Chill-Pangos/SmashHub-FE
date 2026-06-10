import axiosInstance from "@/config/axiosConfig";
import type {
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
  GetRefereesByTournamentResponse,
  GetInvitationsByTournamentResponse,
  GetAvailableRefereesResponse,
  GetMyInvitationsResponse,
} from "@/types/tournamentReferee.types";

class TournamentRefereeService {
  private readonly baseURL = "/tournament-referees";

  async inviteReferee(
    data: InviteRefereeRequest,
  ): Promise<InviteRefereeResponse> {
    const response = await axiosInstance.post<InviteRefereeResponse>(
      `${this.baseURL}/invite`,
      data,
    );
    return response.data;
  }

  async acceptInvitation(
    data: AcceptInvitationRequest,
  ): Promise<AcceptInvitationResponse> {
    const response = await axiosInstance.post<AcceptInvitationResponse>(
      `${this.baseURL}/accept-invitation`,
      data,
    );
    return response.data;
  }

  async rejectInvitation(
    data: RejectInvitationRequest,
  ): Promise<RejectInvitationResponse> {
    const response = await axiosInstance.post<RejectInvitationResponse>(
      `${this.baseURL}/reject-invitation`,
      data,
    );
    return response.data;
  }

  async cancelInvitation(
    data: CancelInvitationRequest,
  ): Promise<CancelInvitationResponse> {
    const response = await axiosInstance.post<CancelInvitationResponse>(
      `${this.baseURL}/cancel-invitation`,
      data,
    );
    return response.data;
  }

  async removeReferee(
    data: RemoveRefereeRequest,
  ): Promise<RemoveRefereeResponse> {
    const response = await axiosInstance.post<RemoveRefereeResponse>(
      `${this.baseURL}/remove`,
      data,
    );
    return response.data;
  }

  async updateRefereeRole(
    data: UpdateRefereeRoleRequest,
  ): Promise<UpdateRefereeRoleResponse> {
    const response = await axiosInstance.post<UpdateRefereeRoleResponse>(
      `${this.baseURL}/update-role`,
      data,
    );
    return response.data;
  }

  async getRefereesByTournament(
    tournamentId: number,
    page: number = 1,
    limit: number = 10,
    role?: string,
  ): Promise<GetRefereesByTournamentResponse> {
    const response = await axiosInstance.get<GetRefereesByTournamentResponse>(
      `${this.baseURL}/tournament/${tournamentId}`,
      { params: { page, limit, role } },
    );
    return response.data;
  }

  async getInvitationsByTournament(
    tournamentId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<GetInvitationsByTournamentResponse> {
    const response = await axiosInstance.get<GetInvitationsByTournamentResponse>(
      `${this.baseURL}/tournament/${tournamentId}/invitations`,
      { params: { page, limit, status } },
    );
    return response.data;
  }

  async getAvailableReferees(
    tournamentId: number,
    page: number = 1,
    limit: number = 10,
    role?: string,
    search?: string,
  ): Promise<GetAvailableRefereesResponse> {
    const response = await axiosInstance.get<GetAvailableRefereesResponse>(
      `${this.baseURL}/tournament/${tournamentId}/available`,
      { params: { page, limit, role, search } },
    );
    return response.data;
  }

  async getMyInvitations(
    page: number = 1,
    limit: number = 10,
    status?: string,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<GetMyInvitationsResponse> {
    const response = await axiosInstance.get<GetMyInvitationsResponse>(
      `${this.baseURL}/my-invitations`,
      { params: { page, limit, status, sortBy, sortOrder } },
    );
    return response.data;
  }
}

export default new TournamentRefereeService();
