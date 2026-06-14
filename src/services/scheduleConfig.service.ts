import axiosInstance from "@/config/axiosConfig";
import type {
  DeleteScheduleConfigResponse,
  CreateScheduleConfigRequest,
  ScheduleConfigDefaultsResponse,
  ScheduleConfigResponse,
  UpdateScheduleConfigRequest,
  ValidateScheduleConfigRequest,
  ValidateScheduleConfigResponse,
  PreviewScheduleConfigRequest,
  PreviewUpdateScheduleConfigRequest,
  PreviewScheduleConfigResponse,
} from "@/types/scheduleConfig.types";

class ScheduleConfigService {
  private readonly baseURL = "/schedule-configs";

  /**
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
      `${this.baseURL}/${tournamentId}/schedule-config`,
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
      `${this.baseURL}/${tournamentId}/schedule-config`,
      data,
    );
    return response.data;
  }

  /**
   * Delete schedule config by tournament
   * DELETE /api/schedule-configs/{tournamentId}/schedule-config
   */
  async deleteScheduleConfig(
    tournamentId: number,
  ): Promise<DeleteScheduleConfigResponse> {
    await axiosInstance.delete(`${this.baseURL}/${tournamentId}/schedule-config`);
  }

  /**
   * Validate schedule config against total matches
   * POST /api/schedule-configs/validate
   */
  async validateScheduleConfig(
    data: ValidateScheduleConfigRequest,
  ): Promise<ValidateScheduleConfigResponse> {
    const response = await axiosInstance.post<ValidateScheduleConfigResponse>(
      `${this.baseURL}/validate`,
      data,
    );
    return response.data;
  }

  /**
   * Preview schedule config before creation
   * POST /api/schedule-configs/{tournamentId}/schedule-config/preview-create
   */
  async previewCreateScheduleConfig(
    tournamentId: number,
    data: PreviewScheduleConfigRequest,
  ): Promise<PreviewScheduleConfigResponse> {
    const response = await axiosInstance.post<PreviewScheduleConfigResponse>(
      `${this.baseURL}/${tournamentId}/schedule-config/preview-create`,
      data,
    );
    return response.data;
  }

  /**
   * Preview schedule config update
   * POST /api/schedule-configs/{tournamentId}/schedule-config/preview-update
   */
  async previewUpdateScheduleConfig(
    tournamentId: number,
    data: PreviewUpdateScheduleConfigRequest,
  ): Promise<PreviewScheduleConfigResponse> {
    const response = await axiosInstance.post<PreviewScheduleConfigResponse>(
      `${this.baseURL}/${tournamentId}/schedule-config/preview-update`,
      data,
    );
    return response.data;
  }
}

export default new ScheduleConfigService();
