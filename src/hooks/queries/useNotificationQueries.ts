import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  DisconnectUserRequest,
  NotificationFilters,
  SendEventRequest,
  SendNotificationRequest,
} from "@/types/notification.types";

export const useNotificationInbox = (
  filters: NotificationFilters = { page: 1, limit: 20 },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: () => notificationService.getNotifications(filters),
    enabled: options?.enabled ?? true,
  });
};

export const useConnectedUsers = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.notifications.connectedUsers(),
    queryFn: () => notificationService.getConnectedUsers(),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
};

export const useServiceStatus = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.notifications.serviceStatus(),
    queryFn: () => notificationService.getServiceStatus(),
    enabled: options?.enabled ?? true,
  });
};

export const useUserConnectionStatus = (
  userId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.notifications.userStatus(userId),
    queryFn: () => notificationService.checkUserConnection(userId),
    enabled: (options?.enabled ?? true) && !!userId,
  });
};

export const useAdminSystemSummary = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.notifications.adminSystemSummary(),
    queryFn: () => notificationService.getAdminSystemSummary(),
    enabled: options?.enabled ?? true,
  });
};

export const useAdminSystemAuditLogs = (
  filters?: { action?: string; page?: number; limit?: number },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.notifications.adminSystemAuditLogs(filters),
    queryFn: () => notificationService.getAuditLogs(filters),
    enabled: options?.enabled ?? true,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      notificationService.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread(),
      });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread(),
      });
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendNotificationRequest) =>
      notificationService.sendNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};

export const useSendEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendEventRequest) => notificationService.sendEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};

export const useDisconnectUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: DisconnectUserRequest) =>
      notificationService.disconnectUser(userId),
    onSuccess: (_result, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.userStatus(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.connectedUsers(),
      });
    },
  });
};
