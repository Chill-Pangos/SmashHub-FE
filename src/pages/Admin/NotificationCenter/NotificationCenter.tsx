import { useServiceStatus } from "@/hooks/queries/useNotificationQueries";
import SendNotificationForm from "./components/SendNotificationForm";
import ConnectedUsersList from "./components/ConnectedUsersList";
import { Activity, Clock, Server, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationCenter() {
  const { data: statusData } = useServiceStatus();

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
        <p className="text-muted-foreground mt-1">
          Monitor real-time connections and broadcast messages to users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {statusData?.status || "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statusData?.success ? (
                <span className="text-green-500">Operational</span>
              ) : (
                <span className="text-destructive">Service Unreachable</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusData?.connectedUsers ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active WebSocket connections
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protocol</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Socket.IO</div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time engine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Ping</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-base truncate pt-1">
              {statusData?.timestamp ? new Date(statusData.timestamp).toLocaleTimeString() : "--:--:--"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-refreshes every 30s
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full mt-4">
        <div className="lg:col-span-2">
          <SendNotificationForm />
        </div>
        <div className="lg:col-span-1 min-h-[400px]">
          <ConnectedUsersList />
        </div>
      </div>
    </div>
  );
}
