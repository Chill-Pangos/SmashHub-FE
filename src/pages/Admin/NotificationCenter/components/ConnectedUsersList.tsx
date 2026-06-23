import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useConnectedUsers, useDisconnectUser } from "@/hooks/queries/useNotificationQueries";
import { showToast, showApiError } from "@/utils/toast.utils";
import { Users, PowerOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function ConnectedUsersList() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useConnectedUsers({
    refetchInterval: 30000,
  });
  const disconnectUser = useDisconnectUser();

  const handleDisconnect = (userId: string) => {
    disconnectUser.mutate(
      { userId },
      {
        onSuccess: () => {
          showToast.success(t("adminNotifications.userDisconnected", { userId, defaultValue: `User ${userId} disconnected` }));
          refetch();
        },
        onError: (err: any) => {
          showApiError(err, t("adminNotifications.disconnectFailed", "Failed to disconnect user"));
        },
      }
    );
  };

  const users = data?.data?.connectedUserIds || [];
  const total = data?.data?.totalConnectedUsers || 0;

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <h2 className="font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          {t("adminNotifications.connectedUsers", "Connected Users")}
          <Badge variant="secondary" className="ml-2">{total}</Badge>
        </h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {t("adminNotifications.refresh", "Refresh")}
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead>{t("adminNotifications.userId", "User ID")}</TableHead>
              <TableHead className="text-right">{t("adminNotifications.action", "Action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    {t("adminNotifications.fetching", "Fetching connections...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center text-destructive">
                  {t("adminNotifications.fetchConnectionsFailed", "Failed to fetch active connections.")}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                  {t("adminNotifications.noConnections", "No active connections found.")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((userId: string) => (
                <TableRow key={userId}>
                  <TableCell className="font-mono text-sm">{userId}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDisconnect(userId)}
                      disabled={disconnectUser.isPending}
                    >
                      <PowerOff className="h-4 w-4 mr-1" /> {t("adminNotifications.disconnect", "Disconnect")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
