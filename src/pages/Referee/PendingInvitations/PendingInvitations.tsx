import {
  useMyRefereeInvitations,
  useAcceptRefereeInvitation,
  useRejectRefereeInvitation,
} from "@/hooks/queries/useTournamentRefereeQueries";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Clock, Trophy, Shield, Calendar } from "lucide-react";

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-6 py-10 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Invitations</h1>
          <p className="text-muted-foreground mt-2">
            Review and respond to your tournament referee invitations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground animate-pulse">Loading invitations...</p>
        </div>
      ) : invitations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((inv: any) => {
            const isChief = inv.role === "chief";
            return (
              <Card key={inv.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {inv.tournament?.name || "Unknown Tournament"}
                    </CardTitle>
                    <Badge variant={isChief ? "default" : "secondary"} className="shrink-0 uppercase text-[10px]">
                      {isChief ? "Chief Referee" : "Referee"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-5 flex-1">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4 shrink-0" />
                      <span>Tier {inv.tournament?.tier || "-"} Tournament</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{inv.tournament?.location || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        Invited by: {inv.inviter?.firstName} {inv.inviter?.lastName}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Created:</span>
                      </div>
                      <span className="font-medium text-foreground">{formatDate(inv.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-amber-500/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Expires:</span>
                      </div>
                      <span className="font-medium text-amber-500/90">{formatDate(inv.expiresAt)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-5 gap-3 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleReject(inv.id)}
                    disabled={accepting || rejecting}
                  >
                    Decline
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleAccept(inv.id)}
                    disabled={accepting || rejecting}
                  >
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/50 text-center">
          <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No Pending Invitations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You don't have any pending referee invitations right now.
          </p>
        </div>
      )}
    </div>
  );
}
