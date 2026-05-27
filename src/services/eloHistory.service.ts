import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  CreateEloHistoryRequest,
  DeleteEloHistoryResponse,
  EloHistory,
  EloHistoryResponse,
  PaginatedEloHistoriesResult,
} from "@/types/elo.types";

class EloHistoryService {
  private readonly baseURL = "/elo-histories";

  async createEloHistory(
    data: CreateEloHistoryRequest,
  ): Promise<EloHistoryResponse> {
    const response = await axiosInstance.post<EloHistoryResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  async getAllEloHistories(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedEloHistoriesResult> {
    const response = await axiosInstance.get<unknown>(this.baseURL, {
      params: { page, limit },
    });

    return parsePaginatedResponse<EloHistory>(response.data, {
      skip: (page - 1) * limit,
      limit,
    });
  }

  async getEloHistoryById(id: number): Promise<EloHistoryResponse> {
    const response = await axiosInstance.get<EloHistoryResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  async deleteEloHistory(id: number): Promise<DeleteEloHistoryResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
    return {
      success: true,
      message: "ELO history deleted successfully",
      data: undefined,
    };
  }

  async getEloHistoryByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedEloHistoriesResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/user/${userId}`,
      { params: { page, limit } },
    );

    return parsePaginatedResponse<EloHistory>(response.data, {
      skip: (page - 1) * limit,
      limit,
    });
  }

  async getEloHistoryByMatch(
    matchId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedEloHistoriesResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/match/${matchId}`,
      { params: { page, limit } },
    );

    return parsePaginatedResponse<EloHistory>(response.data, {
      skip: (page - 1) * limit,
      limit,
    });
  }
}

export default new EloHistoryService();
