import { useNotificationConnection } from "@/hooks/useNotificationConnection";

export default function RealtimeConnectionGate() {
  useNotificationConnection();
  return null;
}
