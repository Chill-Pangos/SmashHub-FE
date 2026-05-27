import axiosInstance from "@/config/axiosConfig";
import type {
  AssignSubMatchPlayersRequest,
  AssignSubMatchPlayersResponse,
  CreateSubMatchesFromFormatRequest,
  FinalizeSubMatchResponse,
  StartSubMatchResponse,
  SubMatchResponse,
  SubMatchesResponse,
} from "@/types/subMatch.types";

class SubMatchService {
  private readonly baseURL = "/sub-matches";

  async createFromFormat(
    data: CreateSubMatchesFromFormatRequest,
  ): Promise<SubMatchesResponse> {
    const response = await axiosInstance.post<SubMatchesResponse>(
      `${this.baseURL}/create-from-format`,
      data,
    );
    return response.data;
  }

  async startSubMatch(id: number): Promise<StartSubMatchResponse> {
    const response = await axiosInstance.post<StartSubMatchResponse>(
      `${this.baseURL}/${id}/start`,
    );
    return response.data;
  }

  async finalizeSubMatch(id: number): Promise<FinalizeSubMatchResponse> {
    const response = await axiosInstance.post<FinalizeSubMatchResponse>(
      `${this.baseURL}/${id}/finalize`,
    );
    return response.data;
  }

  async assignPlayers(
    id: number,
    data: AssignSubMatchPlayersRequest,
  ): Promise<AssignSubMatchPlayersResponse> {
    const response = await axiosInstance.post<AssignSubMatchPlayersResponse>(
      `${this.baseURL}/${id}/assign-players`,
      data,
    );
    return response.data;
  }

  async getSubMatchesByMatch(matchId: number): Promise<SubMatchesResponse> {
    const response = await axiosInstance.get<SubMatchesResponse>(
      `${this.baseURL}/match/${matchId}`,
    );
    return response.data;
  }

  async getSubMatchById(id: number): Promise<SubMatchResponse> {
    const response = await axiosInstance.get<SubMatchResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }
}

export default new SubMatchService();
