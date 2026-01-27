import { useEffect } from "react";
import { useNotification } from "@/store";
import { useAuth } from "@/store/useAuth";

/**
 * Hook to automatically connect/disconnect Socket.IO based on auth state
 * Include this hook in your main layout component to enable real-time notifications
 */
export function useNotificationConnection() {
  const { connect, disconnect, isConnected } = useNotification();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Connect when user is authenticated
      connect(String(user.id));
    } else {
      // Disconnect when user logs out
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [isAuthenticated, user?.id]);

  return { isConnected };
}

export default useNotificationConnection;
