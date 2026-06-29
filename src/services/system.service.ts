import axiosInstance from "@/config/axiosConfig";
import type {
  SystemHealthResponse,
  SystemMetricsParams,
  SystemMetricsResponse,
  SystemEventsParams,
  SystemEventsResponse
} from "@/types/system.types";

class SystemService {
  private readonly baseURL = "/admin/system";

  async getHealth(): Promise<SystemHealthResponse> {
    const response = await axiosInstance.get<SystemHealthResponse>(`${this.baseURL}/health`);
    return response.data;
  }

  async getMetrics(params?: SystemMetricsParams): Promise<SystemMetricsResponse> {
    const response = await axiosInstance.get<SystemMetricsResponse>(`${this.baseURL}/metrics`, { params });
    return response.data;
  }

  async getEvents(params?: SystemEventsParams): Promise<SystemEventsResponse> {
    const response = await axiosInstance.get<SystemEventsResponse>(`${this.baseURL}/events`, { params });
    return response.data;
  }
}

export default new SystemService();
