import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  CreateEloScoreRequest,
  DeleteEloScoreResponse,
  EloLeaderboardResponse,
  EloScore,
  EloScoreResponse,
  PaginatedEloScoresResult,
} from "@/types/elo.types";

class EloScoreService {
  private readonly baseURL = "/elo-scores";

  async createEloScore(data: CreateEloScoreRequest): Promise<EloScoreResponse> {
    const response = await axiosInstance.post<EloScoreResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  async getAllEloScores(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedEloScoresResult> {
    const response = await axiosInstance.get<unknown>(this.baseURL, {
      params: { page, limit },
    });

    return parsePaginatedResponse<EloScore>(response.data, {
      skip: (page - 1) * limit,
      limit,
    });
  }

  async getLeaderboard(
    page: number = 1,
    limit: number = 10,
  ): Promise<EloLeaderboardResponse> {
    const response = await axiosInstance.get<EloLeaderboardResponse>(
      `${this.baseURL}/leaderboard`,
      { params: { page, limit } },
    );
    return response.data;
  }

  async getEloScoreById(id: number): Promise<EloScoreResponse> {
    const response = await axiosInstance.get<EloScoreResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  async updateEloScore(id: number): Promise<EloScoreResponse> {
    const response = await axiosInstance.put<EloScoreResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  async deleteEloScore(id: number): Promise<DeleteEloScoreResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
    return {
      success: true,
      message: "ELO score deleted successfully",
      data: undefined,
    };
  }
}

export default new EloScoreService();
