import axiosInstance from "@/config/axiosConfig";
import type {
  DeleteScheduleConfigResponse,
  CreateScheduleConfigRequest,
  ScheduleConfigDefaultsResponse,
  ScheduleConfigResponse,
  UpdateScheduleConfigRequest,
  ValidateScheduleConfigRequest,
  ValidateScheduleConfigResponse,
} from "@/types/scheduleConfig.types";

class ScheduleConfigService {
  private readonly baseURL = "/schedule-configs";
  private readonly tournamentBaseURL = "/tournaments";

  /**
   * Create schedule config
   * POST /api/schedule-configs
   */
  async createScheduleConfig(
    data: CreateScheduleConfigRequest,
  ): Promise<ScheduleConfigResponse> {
    const response = await axiosInstance.post<ScheduleConfigResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  /**
   * Get default schedule config values
   * GET /api/schedule-configs/defaults
   */
  async getScheduleConfigDefaults(): Promise<ScheduleConfigDefaultsResponse> {
    const response = await axiosInstance.get<ScheduleConfigDefaultsResponse>(
      `${this.baseURL}/defaults`,
    );
    return response.data;
  }

  /**
   * Get schedule config by tournament
   * GET /api/schedule-configs/{tournamentId}/schedule-config
   */
  async getScheduleConfigByTournament(
    tournamentId: number,
  ): Promise<ScheduleConfigResponse> {
    const response = await axiosInstance.get<ScheduleConfigResponse>(
      `${this.tournamentBaseURL}/${tournamentId}/schedule-config`,
    );
    return response.data;
  }

  /**
   * Update schedule config by tournament
   * PATCH /api/schedule-configs/{tournamentId}/schedule-config
   */
  async updateScheduleConfig(
    tournamentId: number,
    data: UpdateScheduleConfigRequest,
  ): Promise<ScheduleConfigResponse> {
    const response = await axiosInstance.patch<ScheduleConfigResponse>(
      `${this.tournamentBaseURL}/${tournamentId}/schedule-config`,
      data,
    );
    return response.data;
  }

  /**
   * Delete schedule config by tournament
   * DELETE /api/tournaments/{tournamentId}/schedule-config
   */
  async deleteScheduleConfig(
    tournamentId: number,
  ): Promise<DeleteScheduleConfigResponse> {
    await axiosInstance.delete(
      `${this.tournamentBaseURL}/${tournamentId}/schedule-config`,
    );

    return {
      success: true,
      message: "Schedule config deleted successfully",
      data: undefined,
    };
  }

  /**
   * Validate schedule config against total matches
   * POST /api/schedule-configs/{tournamentId}/schedule-config/validate
   */
  async validateScheduleConfig(
    tournamentId: number,
    data: ValidateScheduleConfigRequest,
  ): Promise<ValidateScheduleConfigResponse> {
    const response = await axiosInstance.post<ValidateScheduleConfigResponse>(
      `${this.tournamentBaseURL}/${tournamentId}/schedule-config/validate`,
      data,
    );
    return response.data;
  }
}

export default new ScheduleConfigService();
