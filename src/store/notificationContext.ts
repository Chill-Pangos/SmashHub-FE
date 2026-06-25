import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type {
  AdminSystemSummary,
  NotificationInboxItem,
  NotificationPayload,
} from "@/types/notification.types";

export interface ConnectNotificationOptions {
  userId: string;
  accessToken: string;
  isAdmin?: boolean;
}

export interface NotificationContextValue {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationPayload[];
  unreadCount: number;
  systemSummary: AdminSystemSummary | null;
  connect: (options: ConnectNotificationOptions) => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  hydrateInbox: (rows: NotificationInboxItem[], unreadCount: number) => void;
  markAsRead: (index?: number) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  hydrateAdminSystem: (summary: AdminSystemSummary) => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
