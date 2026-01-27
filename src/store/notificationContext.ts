import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type { NotificationPayload } from "@/types/notification.types";

export interface NotificationContextValue {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationPayload[];
  unreadCount: number;
  connect: (userId: string) => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  markAsRead: (index?: number) => void;
  clearNotifications: () => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
