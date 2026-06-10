import {
  useMyRefereeInvitations,
  useAcceptRefereeInvitation,
  useRejectRefereeInvitation,
} from "@/hooks/queries/useTournamentRefereeQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PendingInvitations() {
  const { data: invitationsResp, isLoading } = useMyRefereeInvitations(
    1,
    50,
    "pending"
  );
  const invitations = invitationsResp?.invitations || [];

  const { mutate: acceptInvite, isPending: accepting } =
    useAcceptRefereeInvitation();
  const { mutate: rejectInvite, isPending: rejecting } =
    useRejectRefereeInvitation();

  const handleAccept = (invitationId: number) => {
    acceptInvite({ invitationId });
  };

  const handleReject = (invitationId: number) => {
    rejectInvite({ invitationId });
  };

  return (
    <div className="px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Pending Invitations</h1>
      <p className="text-muted-foreground">
        Review your tournament referee invitations.
      </p>

      {isLoading ? (
        <p>Loading...</p>
      ) : invitations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((inv: any) => (
            <Card key={inv.id}>
              <CardHeader>
                <CardTitle>{inv.tournament?.name || "Tournament"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm">
                    <strong>Role:</strong> {inv.role}
                  </p>
                  <p className="text-sm">
                    <strong>Status:</strong> {inv.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => handleAccept(inv.id)}
                    disabled={accepting || rejecting}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleReject(inv.id)}
                    disabled={accepting || rejecting}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No pending invitations.</p>
      )}
    </div>
  );
}
