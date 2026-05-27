import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  DisconnectUserRequest,
  SendEventRequest,
  SendNotificationRequest,
} from "@/types/notification.types";

export const useConnectedUsers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.notifications.connectedUsers(),
    queryFn: () => notificationService.getConnectedUsers(),
    enabled: options?.enabled ?? true,
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
