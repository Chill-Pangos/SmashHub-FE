import axiosInstance from "@/config/axiosConfig";
import type {
  CreateScheduleRequest,
  CreateScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  GetScheduleResponse,
  GetSchedulesResponse,
  GetSchedulesByContentResponse,
  DeleteScheduleResponse,
  GenerateScheduleRequest,
  GenerateScheduleResponse,
  UpdateKnockoutEntriesRequest,
  UpdateKnockoutEntriesResponse,
  GenerateGroupStageScheduleRequest,
  GenerateGroupStageScheduleResponse,
  GenerateCompleteScheduleRequest,
  GenerateCompleteScheduleResponse,
  GenerateKnockoutOnlyScheduleRequest,
  GenerateKnockoutOnlyScheduleResponse,
  GenerateKnockoutStageScheduleRequest,
  GenerateKnockoutStageScheduleResponse,
  ScheduleStage,
} from "@/types/schedule.types";

/**
 * Schedule Service
 * Handles all schedule-related API calls
 */
class ScheduleService {
  private readonly baseURL = "/schedules";

  /**
   * Create schedule
   * POST /api/schedules
   *
   * @param data Schedule creation data
   * @returns Promise with created schedule
   *
   * @example
   * const schedule = await scheduleService.createSchedule({
   *   contentId: 1,
   *   matchTime: "2026-03-15 10:00:00",
   *   tableNumber: 1
   * });
   */
  async createSchedule(
    data: CreateScheduleRequest,
  ): Promise<CreateScheduleResponse> {
    const response = await axiosInstance.post<CreateScheduleResponse>(
      this.baseURL,
      data,
    );

    return response.data;
  }

  /**
   * Get all schedules
   * GET /api/schedules
   *
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @returns Promise with schedules
   *
   * @example
   * const schedules = await scheduleService.getAllSchedules(0, 20);
   */
  async getAllSchedules(
    skip: number = 0,
    limit: number = 10,
  ): Promise<GetSchedulesResponse> {
    const response = await axiosInstance.get<GetSchedulesResponse>(
      this.baseURL,
      { params: { skip, limit } },
    );

    return response.data;
  }

  /**
   * Get schedule by ID
   * GET /api/schedules/:id
   *
   * @param id Schedule ID
   * @returns Promise with schedule details
   *
   * @example
   * const schedule = await scheduleService.getScheduleById(1);
   */
  async getScheduleById(id: number): Promise<GetScheduleResponse> {
    const response = await axiosInstance.get<GetScheduleResponse>(
      `${this.baseURL}/${id}`,
    );

    return response.data;
  }

  /**
   * Update schedule
   * PUT /api/schedules/:id
   *
   * @param id Schedule ID
   * @param data Partial schedule data to update
   * @returns Promise with updated schedule
   *
   * @example
   * const updated = await scheduleService.updateSchedule(1, {
   *   tableNumber: 2
   * });
   */
  async updateSchedule(
    id: number,
    data: UpdateScheduleRequest,
  ): Promise<UpdateScheduleResponse> {
    const response = await axiosInstance.put<UpdateScheduleResponse>(
      `${this.baseURL}/${id}`,
      data,
    );

    return response.data;
  }

  /**
   * Delete schedule
   * DELETE /api/schedules/:id
   *
   * @param id Schedule ID
   * @returns Promise<void>
   *
   * @example
   * await scheduleService.deleteSchedule(1);
   */
  async deleteSchedule(id: number): Promise<DeleteScheduleResponse> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);

    return {
      success: true,
      message: "Schedule deleted successfully",
      data: undefined,
    };
  }

  /**
   * Generate schedule
   * POST /api/schedules/generate
   *
   * @param data Request with contentId, startDate, endDate
   * @returns Promise with generation result
   *
   * @example
   * const result = await scheduleService.generateSchedule({
   *   contentId: 1,
   *   startDate: "2024-12-25",
   *   endDate: "2024-12-27"
   * });
   */
  async generateSchedule(
    data: GenerateScheduleRequest,
  ): Promise<GenerateScheduleResponse> {
    const response = await axiosInstance.post<GenerateScheduleResponse>(
      `${this.baseURL}/generate`,
      data,
    );
    return response.data;
  }

  /**
   * Update knockout entries
   * POST /api/schedules/update-knockout
   *
   * @param data Request with contentId and groupResults
   * @returns Promise with update result
   *
   * @example
   * const result = await scheduleService.updateKnockoutEntries({
   *   contentId: 1,
   *   groupResults: [
   *     { groupName: "Group A", qualifiedEntryIds: [1, 2] },
   *     { groupName: "Group B", qualifiedEntryIds: [3, 4] }
   *   ]
   * });
   */
  async updateKnockoutEntries(
    data: UpdateKnockoutEntriesRequest,
  ): Promise<UpdateKnockoutEntriesResponse> {
    const response = await axiosInstance.post<UpdateKnockoutEntriesResponse>(
      `${this.baseURL}/update-knockout`,
      data,
    );
    return response.data;
  }

  /**
   * Generate group stage schedule
   * POST /api/schedules/generate-group-stage
   *
   * @param data Request with contentId, startDate, endDate
   * @returns Promise with generation result
   *
   * @example
   * const result = await scheduleService.generateGroupStageSchedule({
   *   contentId: 1,
   *   startDate: "2024-12-25",
   *   endDate: "2024-12-27"
   * });
   */
  async generateGroupStageSchedule(
    data: GenerateGroupStageScheduleRequest,
  ): Promise<GenerateGroupStageScheduleResponse> {
    const response =
      await axiosInstance.post<GenerateGroupStageScheduleResponse>(
        `${this.baseURL}/generate-group-stage`,
        data,
      );
    return response.data;
  }

  /**
   * Generate complete schedule (group + knockout)
   * POST /api/schedules/generate-complete
   *
   * @param data Request with contentId, startDate, endDate, groupStageEndDate
   * @returns Promise with generation result
   *
   * @example
   * const result = await scheduleService.generateCompleteSchedule({
   *   contentId: 1,
   *   startDate: "2024-12-25",
   *   endDate: "2024-12-30",
   *   groupStageEndDate: "2024-12-27"
   * });
   */
  async generateCompleteSchedule(
    data: GenerateCompleteScheduleRequest,
  ): Promise<GenerateCompleteScheduleResponse> {
    const response = await axiosInstance.post<GenerateCompleteScheduleResponse>(
      `${this.baseURL}/generate-complete`,
      data,
    );
    return response.data;
  }

  /**
   * Generate knockout only schedule
   * POST /api/schedules/generate-knockout-only
   *
   * @param data Request with contentId, startDate, endDate
   * @returns Promise with generation result
   *
   * @example
   * const result = await scheduleService.generateKnockoutOnlySchedule({
   *   contentId: 1,
   *   startDate: "2024-12-25",
   *   endDate: "2024-12-27"
   * });
   */
  async generateKnockoutOnlySchedule(
    data: GenerateKnockoutOnlyScheduleRequest,
  ): Promise<GenerateKnockoutOnlyScheduleResponse> {
    const response =
      await axiosInstance.post<GenerateKnockoutOnlyScheduleResponse>(
        `${this.baseURL}/generate-knockout-only`,
        data,
      );
    return response.data;
  }

  /**
   * Generate knockout stage schedule
   * POST /api/schedules/generate-knockout-stage
   *
   * @param data Request with contentId, startDate, endDate
   * @returns Promise with generation result
   *
   * @example
   * const result = await scheduleService.generateKnockoutStageSchedule({
   *   contentId: 1,
   *   startDate: "2024-12-28",
   *   endDate: "2024-12-30"
   * });
   */
  async generateKnockoutStageSchedule(
    data: GenerateKnockoutStageScheduleRequest,
  ): Promise<GenerateKnockoutStageScheduleResponse> {
    const response =
      await axiosInstance.post<GenerateKnockoutStageScheduleResponse>(
        `${this.baseURL}/generate-knockout-stage`,
        data,
      );
    return response.data;
  }

  /**
   * Get schedules by content ID
   * GET /api/schedules/content/:contentId
   *
   * @param contentId Tournament content ID
   * @param options Query options for filtering and pagination
   * @returns Promise with schedules for the content
   *
   * @example
   * const schedules = await scheduleService.getSchedulesByContent(1, {
   *   stage: "knockout",
   *   skip: 0,
   *   limit: 20
   * });
   */
  async getSchedulesByContent(
    contentId: number,
    options?: {
      stage?: ScheduleStage;
      skip?: number;
      limit?: number;
    },
  ): Promise<GetSchedulesByContentResponse> {
    const response = await axiosInstance.get<GetSchedulesByContentResponse>(
      `${this.baseURL}/content/${contentId}`,
      { params: options },
    );
    return response.data;
  }
}

// Export singleton instance
export default new ScheduleService();
