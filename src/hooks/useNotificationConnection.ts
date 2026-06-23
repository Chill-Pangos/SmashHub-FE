import { useEffect } from "react";
import { useNotification } from "@/store";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";
import { useNotificationInbox } from "@/hooks/queries/useNotificationQueries";

/**
 * Hook to automatically connect/disconnect Socket.IO based on auth state
 * Include this hook in your main layout component to enable real-time notifications
 */
export function useNotificationConnection() {
  const {
    connect,
    disconnect,
    isConnected,
    hydrateInbox,
    clearNotifications,
  } = useNotification();
  const { isAuthenticated, user, accessToken } = useAuth();
  const { getRoleNames } = useRole();
  const roleNames = getRoleNames(user?.roles ?? []);
  const isAdmin = roleNames.includes("admin");
  const inboxQuery = useNotificationInbox(
    { offset: 0, limit: 20 },
    { enabled: isAuthenticated && !!user?.id && !!accessToken },
  );

  useEffect(() => {
    if (inboxQuery.data?.data) {
      hydrateInbox(
        inboxQuery.data.data.rows,
        inboxQuery.data.data.unreadCount,
      );
    }
  }, [hydrateInbox, inboxQuery.data]);

  useEffect(() => {
    if (isAuthenticated && user?.id && accessToken) {
      // Connect when user is authenticated
      connect({
        userId: String(user.id),
        accessToken,
        isAdmin,
      });
    } else {
      // Disconnect when user logs out
      disconnect();
      clearNotifications();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [
    accessToken,
    clearNotifications,
    connect,
    disconnect,
    isAdmin,
    isAuthenticated,
    user?.id,
  ]);

  return { isConnected };
}

export default useNotificationConnection;
