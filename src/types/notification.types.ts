// ==================== Notification Types ====================

/**
 * Common notification types
 */
export type NotificationType =
  | "match_update"
  | "tournament_start"
  | "tournament_end"
  | "schedule_change"
  | "bracket_update"
  | "reminder"
  | "announcement"
  | "referee_assigned";

/**
 * Service status
 */
export type ServiceStatus = "healthy" | "degraded" | "down";

// ==================== Notification Payload ====================

/**
 * Notification payload (received by client)
 */
export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

// ==================== Request Types ====================

/**
 * Send notification request
 */
export interface SendNotificationRequest {
  userId?: string;
  userIds?: string[];
  roomId?: string;
  broadcast?: boolean;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Send custom event request
 */
export interface SendEventRequest {
  userId?: string;
  roomId?: string;
  event: string;
  data: Record<string, unknown>;
}

/**
 * Disconnect user request
 */
export interface DisconnectUserRequest {
  userId: string;
}

// ==================== Response Types ====================

/**
 * Send notification response
 */
export interface SendNotificationResponse {
  success: boolean;
  message: string;
  data?: {
    recipients: number;
    type: string;
  };
}

/**
 * Send event response
 */
export interface SendEventResponse {
  success: boolean;
  message: string;
}

/**
 * Get connected users response
 */
export interface GetConnectedUsersResponse {
  success: boolean;
  data: {
    totalConnectedUsers: number;
    connectedUserIds: string[];
  };
}

/**
 * Check user connection status response
 */
export interface CheckUserConnectionResponse {
  success: boolean;
  data: {
    userId: string;
    isConnected: boolean;
  };
}

/**
 * Disconnect user response
 */
export interface DisconnectUserResponse {
  success: boolean;
  message: string;
}

/**
 * Get service status response
 */
export interface GetServiceStatusResponse {
  success: boolean;
  status: ServiceStatus;
  connectedUsers: number;
  timestamp: string;
}
