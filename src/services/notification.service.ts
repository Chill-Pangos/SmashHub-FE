import axiosInstance from "@/config/axiosConfig";
import type {
  SendNotificationRequest,
  SendNotificationResponse,
  SendEventRequest,
  SendEventResponse,
  GetConnectedUsersResponse,
  CheckUserConnectionResponse,
  DisconnectUserResponse,
  GetServiceStatusResponse,
} from "@/types/notification.types";

/**
 * Notification Service
 * Handles all notification-related API calls (REST endpoints)
 * Note: Real-time notifications are handled via Socket.IO on the client side
 */
class NotificationService {
  private readonly baseURL = "/notifications";

  /**
   * Send notification
   * POST /api/notifications/send
   *
   * @param data Notification data with target (userId, userIds, roomId, or broadcast)
   * @returns Promise with send result
   *
   * @example
   * // Send to specific user
   * await notificationService.sendNotification({
   *   userId: "123",
   *   type: "match_update",
   *   title: "Match starting soon",
   *   message: "Your match will start in 10 minutes"
   * });
   *
   * @example
   * // Broadcast to all users
   * await notificationService.sendNotification({
   *   broadcast: true,
   *   type: "tournament_start",
   *   title: "Tournament Started",
   *   message: "The tournament has officially started!"
   * });
   */
  async sendNotification(
    data: SendNotificationRequest,
  ): Promise<SendNotificationResponse> {
    const response = await axiosInstance.post<SendNotificationResponse>(
      `${this.baseURL}/send`,
      data,
    );
    return response.data;
  }

  /**
   * Send custom event
   * POST /api/notifications/event
   *
   * @param data Event data with target and payload
   * @returns Promise with send result
   *
   * @example
   * await notificationService.sendEvent({
   *   roomId: "match_45",
   *   event: "score_update",
   *   data: {
   *     matchId: 45,
   *     setNumber: 2,
   *     entryAScore: 8,
   *     entryBScore: 6
   *   }
   * });
   */
  async sendEvent(data: SendEventRequest): Promise<SendEventResponse> {
    const response = await axiosInstance.post<SendEventResponse>(
      `${this.baseURL}/event`,
      data,
    );
    return response.data;
  }

  /**
   * Get connected users
   * GET /api/notifications/connected-users
   *
   * @returns Promise with connected users info
   *
   * @example
   * const result = await notificationService.getConnectedUsers();
   * console.log(`${result.data.totalConnectedUsers} users online`);
   */
  async getConnectedUsers(): Promise<GetConnectedUsersResponse> {
    const response = await axiosInstance.get<GetConnectedUsersResponse>(
      `${this.baseURL}/connected-users`,
    );
    return response.data;
  }

  /**
   * Check user connection status
   * GET /api/notifications/status/:userId
   *
   * @param userId User ID to check
   * @returns Promise with connection status
   *
   * @example
   * const status = await notificationService.checkUserConnection("123");
   * console.log(`User is ${status.data.isConnected ? "online" : "offline"}`);
   */
  async checkUserConnection(
    userId: string,
  ): Promise<CheckUserConnectionResponse> {
    const response = await axiosInstance.get<CheckUserConnectionResponse>(
      `${this.baseURL}/status/${userId}`,
    );
    return response.data;
  }

  /**
   * Disconnect user
   * POST /api/notifications/disconnect/:userId
   *
   * @param userId User ID to disconnect
   * @returns Promise with disconnect result
   *
   * @example
   * await notificationService.disconnectUser("123");
   */
  async disconnectUser(userId: string): Promise<DisconnectUserResponse> {
    const response = await axiosInstance.post<DisconnectUserResponse>(
      `${this.baseURL}/disconnect/${userId}`,
    );
    return response.data;
  }

  /**
   * Get service status
   * GET /api/notifications/status
   *
   * @returns Promise with service status
   *
   * @example
   * const status = await notificationService.getServiceStatus();
   * console.log(`Service is ${status.status}, ${status.connectedUsers} users connected`);
   */
  async getServiceStatus(): Promise<GetServiceStatusResponse> {
    const response = await axiosInstance.get<GetServiceStatusResponse>(
      `${this.baseURL}/status`,
    );
    return response.data;
  }
}

// Export singleton instance
export default new NotificationService();
