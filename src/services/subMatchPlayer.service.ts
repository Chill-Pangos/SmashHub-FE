import axiosInstance from "@/config/axiosConfig";
import type {
  SubMatchPlayerMatchesResponse,
  SubMatchPlayersResponse,
  LineupSubmitRequest,
  LineupSubmitResponse,
  GetPendingLineupsResponse,
  ApproveLineupResponse,
  RejectLineupRequest,
  RejectLineupResponse,
  GetRejectedLineupsResponse,
} from "@/types/subMatchPlayer.types";

class SubMatchPlayerService {
  private readonly baseURL = "/sub-match-players";

  async getPlayersBySubMatch(
    subMatchId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<SubMatchPlayersResponse> {
    const response = await axiosInstance.get<SubMatchPlayersResponse>(
      `${this.baseURL}/sub-match/${subMatchId}`,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getPlayersBySubMatchTeam(
    subMatchId: number,
    team: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<SubMatchPlayersResponse> {
    const response = await axiosInstance.get<SubMatchPlayersResponse>(
      `${this.baseURL}/sub-match/${subMatchId}/team/${team}`,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getHistoryByEntryMember(
    entryMemberId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<SubMatchPlayerMatchesResponse> {
    const response = await axiosInstance.get<SubMatchPlayerMatchesResponse>(
      `${this.baseURL}/entry-member/${entryMemberId}`,
      { params: { page, limit } },
    );
    return response.data;
  }

  async submitLineup(matchId: number, data: LineupSubmitRequest): Promise<LineupSubmitResponse> {
    const response = await axiosInstance.post<LineupSubmitResponse>(
      `${this.baseURL}/match/${matchId}/lineup-submit`,
      data
    );
    return response.data;
  }

  async getPendingLineups(): Promise<GetPendingLineupsResponse> {
    const response = await axiosInstance.get<GetPendingLineupsResponse>(
      `${this.baseURL}/lineup-requests/pending`
    );
    return response.data;
  }

  async approveLineups(matchId: number): Promise<ApproveLineupResponse> {
    const response = await axiosInstance.post<ApproveLineupResponse>(
      `${this.baseURL}/match/${matchId}/lineup-approve`
    );
    return response.data;
  }

  async rejectLineups(matchId: number, data: RejectLineupRequest): Promise<RejectLineupResponse> {
    const response = await axiosInstance.post<RejectLineupResponse>(
      `${this.baseURL}/match/${matchId}/lineup-reject`,
      data
    );
    return response.data;
  }

  async getRejectedLineups(): Promise<GetRejectedLineupsResponse> {
    const response = await axiosInstance.get<GetRejectedLineupsResponse>(
      `${this.baseURL}/lineup-requests/rejected`
    );
    return response.data;
  }
}

export default new SubMatchPlayerService();
