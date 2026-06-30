// ==================== Notification Types ====================

/**
 * Common notification types
 */
export type NotificationType =
  // Entry / Team
  | "join_request"
  | "join_request_approved"
  | "join_request_rejected"
  // Payment
  | "payment_confirmed"
  | "payment_rejected"
  | "payment_refunded"
  // Match
  | "match_scheduled"
  | "match_starting_soon"
  | "match_result"
  // Tournament
  | "tournament_announcement"
  | "referee_invitation"
  | "tournament_status_changed";

/**
 * Service status
 */
export type ServiceStatus = "healthy" | "degraded" | "down";

// ==================== Notification Payload ====================

/**
 * Notification payload (received by client)
 */
export interface NotificationPayload {
  id?: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
  isRead?: boolean;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  source?: "inbox" | "realtime";
}

export interface RealtimeNotification {
  type: string;
  title: string;
  message: string;
  data?: {
    notificationId?: number;
    notificationIds?: number[];
    referenceId?: number;
    referenceType?: string;
    payload?: unknown;
    [key: string]: unknown;
  };
  timestamp?: string;
}

export interface NotificationInboxItem {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  referenceId?: number | null;
  referenceType?: string | null;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

export interface NotificationInboxResponse {
  success: boolean;
  data: {
    rows: NotificationInboxItem[];
    count: number;
    unreadCount: number;
  };
}

export interface MarkNotificationReadResponse {
  success: boolean;
  data?: NotificationInboxItem;
  message?: string;
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  data?: {
    updatedCount?: number;
  };
  message?: string;
}

// ==================== Admin System Types ====================

export type AdminSystemStatus = "ok" | "warning" | "critical";
export type AdminServiceStatus = "up" | "down" | "degraded";
export type AdminTrafficWindow = "1m" | "5m" | "15m";

export interface AdminSystemSummary {
  status: AdminSystemStatus;
  uptimeSeconds: number;
  resources: {
    cpu: {
      percent: number;
      status: AdminSystemStatus;
      label: string;
    };
    ram: {
      percent: number;
      status: AdminSystemStatus;
      label: string;
      usedGb: number;
      totalGb: number;
    };
    disk: {
      percent: number | null;
      status: AdminSystemStatus;
      label: string;
      path: string | null;
      usedGb: number | null;
      totalGb: number | null;
    };
  };
  services: {
    db: AdminServiceStatus;
    redis: AdminServiceStatus;
    socket: AdminServiceStatus;
    cron: AdminServiceStatus;
  };
  traffic: {
    window: AdminTrafficWindow;
    requestCount: number;
    errorPercent: number;
    p95LatencyMs: number;
  };
  realtime: {
    connectedUsers: number;
    roomCount: number;
  };
  alerts: {
    total: number;
    critical: number;
    warning: number;
    items?: Array<{
      key: string;
      severity: "critical" | "warning" | "info";
      message: string;
      createdAt: string;
      data?: Record<string, unknown>;
    }>;
  };
  generatedAt: string;
}

export interface AdminSystemSummaryResponse {
  success: boolean;
  data: AdminSystemSummary;
}

export interface AuditLogItem {
  id: number;
  actorUserId: number;
  action: string;
  resourceType: string;
  resourceId: number | null;
  method: string;
  path: string;
  statusCode: number;
  ip: string;
  userAgent: string;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemAuditLogDetail extends AuditLogItem {
  actor?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SystemAuditLogDetailResponse {
  success: boolean;
  data: SystemAuditLogDetail;
}

export interface AuditLogFilters {
  action?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogsResponse {
  success: boolean;
  data: {
    rows: AuditLogItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export type AdminSystemHealthChangedEvent = Pick<
  AdminSystemSummary,
  "status" | "services" | "resources" | "alerts" | "generatedAt"
>;

export interface AdminMetricsEvent {
  type: "overview" | "cron";
  data: AdminSystemSummary | Record<string, unknown>;
  generatedAt?: string;
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
