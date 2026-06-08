import axiosInstance from "@/config/axiosConfig";
import type {
  SubMatchPlayerMatchesResponse,
  SubMatchPlayersResponse,
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
}

export default new SubMatchPlayerService();
