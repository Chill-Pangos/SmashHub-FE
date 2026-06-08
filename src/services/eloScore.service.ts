import axiosInstance from "@/config/axiosConfig";
import type {
  GetEloLeaderboardResponse,
} from "@/types/elo.types";

class EloScoreService {
  private readonly baseURL = "/elo-scores";

  async getLeaderboard(
    page: number = 1,
    limit: number = 10,
  ): Promise<GetEloLeaderboardResponse> {
    const response = await axiosInstance.get<GetEloLeaderboardResponse>(
      `${this.baseURL}/leaderboard`,
      { params: { page, limit } },
    );
    return response.data;
  }
}

export default new EloScoreService();
