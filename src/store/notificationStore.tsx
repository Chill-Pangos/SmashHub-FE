import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import type {
  AdminMetricsEvent,
  AdminSystemHealthChangedEvent,
  AdminSystemSummary,
  NotificationInboxItem,
  NotificationPayload,
  RealtimeNotification,
} from "@/types/notification.types";
import { showToast } from "@/utils/toast.utils";
import {
  NotificationContext,
  type ConnectNotificationOptions,
  type NotificationContextValue,
} from "./notificationContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

interface NotificationProviderProps {
  children: ReactNode;
}

const getNotificationIdentity = (notification: NotificationPayload) =>
  notification.id ?? (notification.data?.notificationId as number | undefined);

const normalizeInboxItem = (item: NotificationInboxItem): NotificationPayload => ({
  id: item.id,
  type: item.type,
  title: item.title,
  message: item.message,
  data: {
    ...(item.data ?? {}),
    notificationId: item.id,
    referenceId: item.referenceId,
    referenceType: item.referenceType,
  },
  timestamp: item.createdAt,
  isRead: item.isRead,
  readAt: item.readAt,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  source: "inbox",
});

const normalizeRealtimeNotification = (
  payload: RealtimeNotification,
): NotificationPayload => ({
  id: payload.data?.notificationId,
  type: payload.type,
  title: payload.title,
  message: payload.message,
  data: payload.data,
  timestamp: payload.timestamp ?? new Date().toISOString(),
  isRead: false,
  source: "realtime",
});

const mergeNotifications = (
  incoming: NotificationPayload[],
  current: NotificationPayload[],
) => {
  const seen = new Set<number>();
  const merged: NotificationPayload[] = [];

  for (const notification of [...incoming, ...current]) {
    const id = getNotificationIdentity(notification);
    if (id !== undefined) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    merged.push(notification);
  }

  return merged;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const registeredUserIdRef = useRef<string | null>(null);
  const notificationsRef = useRef<NotificationPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [systemSummary, setSystemSummary] = useState<AdminSystemSummary | null>(
    null,
  );

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const disconnectSocket = useCallback(() => {
    if (!socketRef.current) return;

    if (registeredUserIdRef.current) {
      socketRef.current.emit("unregister", registeredUserIdRef.current);
    }

    socketRef.current.disconnect();
    socketRef.current = null;
    registeredUserIdRef.current = null;
    setIsConnected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const connect = useCallback((options: ConnectNotificationOptions) => {
    const { userId, accessToken, isAdmin = false } = options;
    if (!accessToken) return;

    if (socketRef.current?.connected) {
      if (registeredUserIdRef.current === userId) {
        console.log("Socket already connected");
        return;
      }
      disconnectSocket();
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      disconnectSocket();
    }

    // Create socket connection with auth
    const socket = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("register", String(userId));
    });

    socket.on("disconnect", (reason: string) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("registered", ({ userId: registeredUserId }: { userId?: string }) => {
      registeredUserIdRef.current = String(registeredUserId ?? userId);
      console.log("Socket registered:", registeredUserIdRef.current);

      if (isAdmin) {
        socket.emit("join-room", "admin:system");
      }
    });

    socket.on("registration_error", (error: unknown) => {
      console.error("Socket registration error:", error);
    });

    socket.on("room_join_error", (error: unknown) => {
      console.error("Socket room join error:", error);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Notification events
    socket.on("notification", (payload: RealtimeNotification) => {
      console.log("Received notification:", payload);
      const notification = normalizeRealtimeNotification(payload);
      setNotifications((prev) => mergeNotifications([notification], prev));
      setUnreadCount((prev) => prev + 1);
      showToast.info(payload.title, payload.message);
    });

    // Match events
    socket.on("match_update", (data: Record<string, unknown>) => {
      console.log("Match update:", data);
      const notification: NotificationPayload = {
        type: "match_update",
        title: "Cập nhật trận đấu",
        message: String(data.message || "Có cập nhật mới cho trận đấu"),
        data,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast.info(notification.title, notification.message);
    });

    // Score update events
    socket.on("score_update", (data: Record<string, unknown>) => {
      console.log("Score update:", data);
      const notification: NotificationPayload = {
        type: "match_update",
        title: "Cập nhật điểm số",
        message: `Set ${data.setNumber}: ${data.entryAScore} - ${data.entryBScore}`,
        data,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast.info(notification.title, notification.message);
    });

    // Referee assignment events
    socket.on("referee_assigned", (data: Record<string, unknown>) => {
      console.log("Referee assigned:", data);
      const notification: NotificationPayload = {
        type: "referee_assigned",
        title: "Phân công trọng tài",
        message: String(data.message || "Bạn đã được phân công làm trọng tài"),
        data,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast.success(notification.title, notification.message);
    });

    // Tournament events
    socket.on("tournament_start", (data: Record<string, unknown>) => {
      console.log("Tournament started:", data);
      const notification: NotificationPayload = {
        type: "tournament_start",
        title: "Giải đấu bắt đầu",
        message: String(data.message || "Giải đấu đã bắt đầu"),
        data,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast.info(notification.title, notification.message);
    });

    // Announcement events
    socket.on("announcement", (data: Record<string, unknown>) => {
      console.log("Announcement:", data);
      const notification: NotificationPayload = {
        type: "announcement",
        title: String(data.title || "Thông báo"),
        message: String(data.message || ""),
        data,
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast.info(notification.title, notification.message);
    });

    socket.on("admin_system_metrics_updated", (payload: AdminMetricsEvent) => {
      if (payload.type === "overview") {
        setSystemSummary(payload.data as AdminSystemSummary);
        return;
      }

      console.log("Admin system cron event:", payload.data);
    });

    socket.on("admin_system_health_changed", (payload: AdminSystemHealthChangedEvent) => {
      setSystemSummary((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          status: payload.status,
          services: payload.services,
          resources: payload.resources,
          alerts: payload.alerts,
          generatedAt: payload.generatedAt,
        };
      });
    });

    socket.on("admin_system_alert_created", (alert: Record<string, unknown>) => {
      console.log("Admin system alert event:", alert);
    });

    socket.on("admin_system_audit_created", (payload: Record<string, unknown>) => {
      console.log("Admin system audit event:", payload);
    });

    socketRef.current = socket;
  }, [disconnectSocket]);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, [disconnectSocket]);

  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join-room", roomId);
      console.log("Joined room:", roomId);
    }
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-room", roomId);
      console.log("Left room:", roomId);
    }
  }, []);

  const hydrateInbox = useCallback(
    (rows: NotificationInboxItem[], nextUnreadCount: number) => {
      const inboxNotifications = rows.map(normalizeInboxItem);
      const inboxIds = new Set(rows.map((row) => row.id));
      const realtimeUnreadMissingFromInbox = notificationsRef.current.filter(
        (notification) => {
          const id = getNotificationIdentity(notification);
          return !notification.isRead && (id === undefined || !inboxIds.has(id));
        },
      ).length;

      setNotifications((prev) => mergeNotifications(inboxNotifications, prev));
      setUnreadCount(nextUnreadCount + realtimeUnreadMissingFromInbox);
    },
    [],
  );

  const markAsRead = useCallback((index?: number) => {
    if (index !== undefined) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else {
      setUnreadCount(0);
    }
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        const notificationId = getNotificationIdentity(notification);
        if (notificationId !== id) return notification;

        return {
          ...notification,
          isRead: true,
          readAt: notification.readAt ?? new Date().toISOString(),
        };
      }),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt ?? now,
      })),
    );
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setSystemSummary(null);
  }, []);

  const hydrateAdminSystem = useCallback((summary: AdminSystemSummary) => {
    setSystemSummary(summary);
  }, []);

  const value: NotificationContextValue = useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      notifications,
      unreadCount,
      systemSummary,
      connect,
      disconnect,
      joinRoom,
      leaveRoom,
      hydrateInbox,
      markAsRead,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      hydrateAdminSystem,
    }),
    [
      isConnected,
      notifications,
      unreadCount,
      systemSummary,
      connect,
      disconnect,
      joinRoom,
      leaveRoom,
      hydrateInbox,
      markAsRead,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      hydrateAdminSystem,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
