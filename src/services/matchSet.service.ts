import axiosInstance from "@/config/axiosConfig";
import type {
  CreateMatchSetRequest,
  CreateMatchSetResponse,
  UpdateLiveScoreRequest,
  UpdateLiveScoreResponse,
  SubmitFinalScoreRequest,
  SubmitFinalScoreResponse,
  UpdateMatchSetRequest,
  UpdateMatchSetResponse,
  GetMatchSetResponse,
  GetMatchSetsByMatchResponse,
  DeleteMatchSetResponse,
  MatchSet,
} from "@/types/matchSet.types";

class MatchSetService {
  private readonly baseURL = "/match-sets";

  async createMatchSet(
    data: CreateMatchSetRequest,
  ): Promise<CreateMatchSetResponse> {
    const response = await axiosInstance.post<CreateMatchSetResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  async updateLiveScore(
    data: UpdateLiveScoreRequest,
  ): Promise<UpdateLiveScoreResponse> {
    const response = await axiosInstance.put<UpdateLiveScoreResponse>(
      `${this.baseURL}/live-score`,
      data,
    );
    return response.data;
  }

  async submitFinalScore(
    data: SubmitFinalScoreRequest,
  ): Promise<SubmitFinalScoreResponse> {
    const response = await axiosInstance.post<SubmitFinalScoreResponse>(
      `${this.baseURL}/final-score`,
      data,
    );
    return response.data;
  }

  async getLiveScore(
    subMatchId: number,
    setNumber?: number
  ): Promise<MatchSet | null> {
    const response = await axiosInstance.get<MatchSet | null>(
      `${this.baseURL}/sub-match/${subMatchId}/live-score`,
      { params: { setNumber } }
    );
    return response.data;
  }

  async getMatchSetById(id: number): Promise<GetMatchSetResponse> {
    const response = await axiosInstance.get<GetMatchSetResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  async getMatchSetsByMatch(
    subMatchId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetMatchSetsByMatchResponse> {
    const response = await axiosInstance.get<GetMatchSetsByMatchResponse>(
      `${this.baseURL}/sub-match/${subMatchId}`,
      { params: { page, limit } },
    );
    return response.data;
  }

  async updateMatchSet(
    id: number,
    data: UpdateMatchSetRequest,
  ): Promise<UpdateMatchSetResponse> {
    const response = await axiosInstance.put<UpdateMatchSetResponse>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  async deleteMatchSet(id: number): Promise<DeleteMatchSetResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }
}

export default new MatchSetService();
