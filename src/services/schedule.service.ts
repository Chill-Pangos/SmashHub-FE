import axiosInstance from "@/config/axiosConfig";
import type {
  GetScheduleResponse,
  GetSchedulesByContentResponse,
  GenerateTournamentScheduleRequest,
  GenerateTournamentScheduleResponse,
  GenerateGroupStageScheduleRequest,
  GenerateGroupStageScheduleResponse,
  GenerateKnockoutScheduleRequest,
  GenerateKnockoutScheduleResponse,
  SyncMatchEntriesRequest,
  SyncMatchEntriesResponse,
  ScheduleStage,
} from "@/types/schedule.types";

class ScheduleService {
  private readonly baseURL = "/schedules";

  async getScheduleById(id: number): Promise<GetScheduleResponse> {
    const response = await axiosInstance.get<GetScheduleResponse>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  async getSchedulesByCategory(
    categoryId: number,
    options?: {
      stage?: ScheduleStage;
      page?: number;
      limit?: number;
    },
  ): Promise<GetSchedulesByContentResponse> {
    const response = await axiosInstance.get<GetSchedulesByContentResponse>(
      `${this.baseURL}/category/${categoryId}`,
      { params: options },
    );
    return response.data;
  }

  async generateTournamentSchedule(
    data: GenerateTournamentScheduleRequest,
  ): Promise<GenerateTournamentScheduleResponse> {
    const response = await axiosInstance.post<GenerateTournamentScheduleResponse>(
      `${this.baseURL}/generate-tournament`,
      data,
    );
    return response.data;
  }

  async generateGroupStageSchedule(
    data: GenerateGroupStageScheduleRequest,
  ): Promise<GenerateGroupStageScheduleResponse> {
    const response = await axiosInstance.post<GenerateGroupStageScheduleResponse>(
      `${this.baseURL}/generate-group-stage`,
      data,
    );
    return response.data;
  }

  async generateKnockoutSchedule(
    data: GenerateKnockoutScheduleRequest,
  ): Promise<GenerateKnockoutScheduleResponse> {
    const response = await axiosInstance.post<GenerateKnockoutScheduleResponse>(
      `${this.baseURL}/generate-knockout`,
      data,
    );
    return response.data;
  }

  async syncMatchEntries(
    data: SyncMatchEntriesRequest,
  ): Promise<SyncMatchEntriesResponse> {
    const response = await axiosInstance.post<SyncMatchEntriesResponse>(
      `${this.baseURL}/sync-match-entries`,
      data,
    );
    return response.data;
  }
}

export default new ScheduleService();
