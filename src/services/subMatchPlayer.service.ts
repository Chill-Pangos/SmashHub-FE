import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  PaginatedSubMatchPlayersResult,
  SubMatchPlayer,
  SubMatchPlayersResponse,
} from "@/types/subMatchPlayer.types";

class SubMatchPlayerService {
  private readonly baseURL = "/sub-match-players";

  async getPlayersBySubMatch(
    subMatchId: number,
  ): Promise<SubMatchPlayersResponse> {
    const response = await axiosInstance.get<SubMatchPlayersResponse>(
      `${this.baseURL}/sub-match/${subMatchId}`,
    );
    return response.data;
  }

  async getPlayersBySubMatchTeam(
    subMatchId: number,
    team: string,
  ): Promise<SubMatchPlayersResponse> {
    const response = await axiosInstance.get<SubMatchPlayersResponse>(
      `${this.baseURL}/sub-match/${subMatchId}/team/${team}`,
    );
    return response.data;
  }

  async getHistoryByEntryMember(
    entryMemberId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedSubMatchPlayersResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/entry-member/${entryMemberId}`,
      { params: { page, limit } },
    );

    return parsePaginatedResponse<SubMatchPlayer>(response.data, {
      page,
      limit,
    });
  }
}

export default new SubMatchPlayerService();
