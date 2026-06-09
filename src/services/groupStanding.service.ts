import axiosInstance from "@/config/axiosConfig";
import type {
  GeneratePlaceholdersRequest,
  GeneratePlaceholdersResponse,
  RandomDrawRequest,
  RandomDrawResponse,
  SaveAssignmentsRequest,
  SaveAssignmentsResponse,
  CalculateStandingsRequest,
  CalculateStandingsResponse,
  GetStandingsByContentResponse,
  SyncStandingsResponse,
  GetQualifiedTeamsResponse,
} from "@/types/groupStanding.types";

class GroupStandingService {
  private readonly baseURL = "/group-standings";

  async generatePlaceholders(
    data: GeneratePlaceholdersRequest,
  ): Promise<GeneratePlaceholdersResponse> {
    const response = await axiosInstance.post<GeneratePlaceholdersResponse>(
      `${this.baseURL}/generate`,
      data,
    );
    return response.data;
  }

  async randomDraw(data: RandomDrawRequest): Promise<RandomDrawResponse> {
    const response = await axiosInstance.post<RandomDrawResponse>(
      `${this.baseURL}/random-draw`,
      data,
    );
    return response.data;
  }

  async saveAssignments(
    data: SaveAssignmentsRequest,
  ): Promise<SaveAssignmentsResponse> {
    const response = await axiosInstance.post<SaveAssignmentsResponse>(
      `${this.baseURL}/save-assignments`,
      data,
    );
    return response.data;
  }

  async calculateStandings(
    data: CalculateStandingsRequest,
  ): Promise<CalculateStandingsResponse> {
    const response = await axiosInstance.post<CalculateStandingsResponse>(
      `${this.baseURL}/calculate`,
      data,
    );
    return response.data;
  }

  async getStandingsByCategory(
    categoryId: number,
    options?: { groupName?: string },
  ): Promise<GetStandingsByContentResponse> {
    const response = await axiosInstance.get<GetStandingsByContentResponse>(
      `${this.baseURL}/${categoryId}`,
      { params: options },
    );
    return response.data;
  }

  async syncStandings(matchId: number): Promise<SyncStandingsResponse> {
    const response = await axiosInstance.post<SyncStandingsResponse>(
      `${this.baseURL}/matches/${matchId}/sync`,
    );
    return response.data;
  }

  async getQualifiedTeamsByCategory(
    categoryId: number,
    options?: { qualifiersPerGroup?: number; page?: number; limit?: number },
  ): Promise<GetQualifiedTeamsResponse> {
    const response = await axiosInstance.get<GetQualifiedTeamsResponse>(
      `${this.baseURL}/${categoryId}/qualified`,
      { params: options }
    );
    return response.data;
  }
}

export default new GroupStandingService();
