import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import type { NotificationPayload } from "@/types/notification.types";
import { showToast } from "@/utils/toast.utils";
import {
  NotificationContext,
  type NotificationContextValue,
} from "./notificationContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const connect = useCallback((userId: string) => {
    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create socket connection with auth
    const socket = io(SOCKET_URL, {
      auth: {
        userId,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Notification events
    socket.on("notification", (payload: NotificationPayload) => {
      console.log("Received notification:", payload);
      setNotifications((prev) => [payload, ...prev]);
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

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_room", { roomId });
      console.log("Joined room:", roomId);
    }
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave_room", { roomId });
      console.log("Left room:", roomId);
    }
  }, []);

  const markAsRead = useCallback((index?: number) => {
    if (index !== undefined) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else {
      setUnreadCount(0);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value: NotificationContextValue = useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      notifications,
      unreadCount,
      connect,
      disconnect,
      joinRoom,
      leaveRoom,
      markAsRead,
      clearNotifications,
    }),
    [
      isConnected,
      notifications,
      unreadCount,
      connect,
      disconnect,
      joinRoom,
      leaveRoom,
      markAsRead,
      clearNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
