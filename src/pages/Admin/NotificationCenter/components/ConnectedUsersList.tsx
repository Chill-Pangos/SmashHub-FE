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
import { Users, PowerOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ConnectedUsersList() {
  const { data, isLoading, refetch } = useConnectedUsers();
  const disconnectUser = useDisconnectUser();

  const handleDisconnect = (userId: string) => {
    disconnectUser.mutate(
      { userId },
      {
        onSuccess: () => {
          toast.success(`User ${userId} disconnected`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to disconnect user");
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
          Connected Users
          <Badge variant="secondary" className="ml-2">{total}</Badge>
        </h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    Fetching connections...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                  No active connections found.
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
                      <PowerOff className="h-4 w-4 mr-1" /> Disconnect
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
