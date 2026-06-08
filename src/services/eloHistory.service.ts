import axiosInstance from "@/config/axiosConfig";
import type {
  GetEloHistoriesResponse,
} from "@/types/elo.types";

class EloHistoryService {
  private readonly baseURL = "/elo-histories";


  async getEloHistoryByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetEloHistoriesResponse> {
    const response = await axiosInstance.get<GetEloHistoriesResponse>(
      `${this.baseURL}/user/${userId}`,
      { params: { page, limit } },
    );
    return response.data;
  }

  async getEloHistoryByMatch(
    matchId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetEloHistoriesResponse> {
    const response = await axiosInstance.get<GetEloHistoriesResponse>(
      `${this.baseURL}/match/${matchId}`,
      { params: { page, limit } },
    );
    return response.data;
  }
}

export default new EloHistoryService();
