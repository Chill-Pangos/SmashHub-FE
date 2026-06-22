import {
  useMyRefereeInvitations,
  useAcceptRefereeInvitation,
  useRejectRefereeInvitation,
} from "@/hooks/queries/useTournamentRefereeQueries";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MapPin, User, Clock, Trophy, Shield, Calendar } from "lucide-react";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";

export default function PendingInvitations() {
  const { t } = useTranslation();
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

  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; invitationId: number | null }>({
    isOpen: false,
    invitationId: null,
  });
  const [declineOpenId, setDeclineOpenId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleAccept = (invitationId: number) => {
    acceptInvite({ invitationId }, {
      onSuccess: () => showToast.success(t("pendingInvitations.acceptSuccess", "Invitation accepted successfully")),
      onError: (err: any) => showApiError(err, t("pendingInvitations.acceptError", "Failed to accept invitation")),
    });
  };

  const handleReject = (invitationId: number) => {
    rejectInvite({ invitationId }, {
      onSuccess: () => showToast.success(t("pendingInvitations.rejectSuccess", "Invitation declined successfully")),
      onError: (err: any) => showApiError(err, t("pendingInvitations.rejectError", "Failed to decline invitation")),
    });
  };

  const handleRejectWithReason = () => {
    if (rejectModal.invitationId) {
      rejectInvite({ invitationId: rejectModal.invitationId, rejectionReason }, {
        onSuccess: () => {
          showToast.success(t("pendingInvitations.rejectSuccess", "Invitation declined successfully"));
          setRejectModal({ isOpen: false, invitationId: null });
          setRejectionReason("");
        },
        onError: (err: any) => showApiError(err, t("pendingInvitations.rejectError", "Failed to decline invitation")),
      });
    }
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
          <h1 className="text-3xl font-bold tracking-tight">{t("pendingInvitations.title", "Pending Invitations")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("pendingInvitations.description", "Review and respond to your tournament referee invitations.")}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground animate-pulse">{t("pendingInvitations.loading", "Loading invitations...")}</p>
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
                      {inv.tournament?.name || t("pendingInvitations.unknownTournament", "Unknown Tournament")}
                    </CardTitle>
                    <Badge variant={isChief ? "default" : "secondary"} className="shrink-0 uppercase text-[10px]">
                      {isChief ? t("pendingInvitations.chiefReferee", "Chief Referee") : t("pendingInvitations.referee", "Referee")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-5 flex-1">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4 shrink-0" />
                      <span>{t("pendingInvitations.tierTournament", { tier: inv.tournament?.tier || "-", defaultValue: `Tier ${inv.tournament?.tier || "-"} Tournament` })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{inv.tournament?.location || t("pendingInvitations.tba", "TBA")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {t("pendingInvitations.invitedBy", "Invited by:")} {inv.inviter?.firstName} {inv.inviter?.lastName}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{t("pendingInvitations.created", "Created:")}</span>
                      </div>
                      <span className="font-medium text-foreground">{formatDate(inv.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-amber-500/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t("pendingInvitations.expires", "Expires:")}</span>
                      </div>
                      <span className="font-medium text-amber-500/90">{formatDate(inv.expiresAt)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-5 flex-col gap-2 border-t border-border/50">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleAccept(inv.id)}
                    disabled={accepting || rejecting}
                  >
                    {t("pendingInvitations.accept", "Accept")}
                  </Button>
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground text-[11px]"
                      onClick={() => setDeclineOpenId(inv.id)}
                      disabled={accepting || rejecting}
                    >
                      {t("pendingInvitations.decline", "Decline")}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground text-[11px]"
                      onClick={() => setRejectModal({ isOpen: true, invitationId: inv.id })}
                      disabled={accepting || rejecting}
                    >
                      {t("pendingInvitations.declineWithReason", "Decline w/ Reason")}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/50 text-center">
          <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground">{t("pendingInvitations.noPending", "No Pending Invitations")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("pendingInvitations.noPendingDesc", "You don't have any pending referee invitations right now.")}
          </p>
        </div>
      )}
      <Dialog open={rejectModal.isOpen} onOpenChange={(open) => !open && setRejectModal({ isOpen: false, invitationId: null })}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>{t("pendingInvitations.declineReasonTitle", "Decline Invitation")}</DialogTitle>
            <DialogDescription>
              {t("pendingInvitations.declineReasonDesc", "Please provide a reason for declining this invitation. This will be visible to the tournament organizers.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t("pendingInvitations.reasonPlaceholder", "Enter reason (e.g., Schedule conflict)")}
              className="bg-input border-border"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectModal({ isOpen: false, invitationId: null })}>
              {t("pendingInvitations.cancel", "Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleRejectWithReason} disabled={!rejectionReason.trim() || rejecting}>
              {rejecting ? t("pendingInvitations.declining", "Declining...") : t("pendingInvitations.confirmDecline", "Confirm Decline")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={declineOpenId !== null} onOpenChange={(open) => !open && setDeclineOpenId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("pendingInvitations.declineConfirmTitle", "Decline Invitation?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("pendingInvitations.declineConfirmDesc", "Are you sure you want to decline this referee invitation?")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejecting}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (declineOpenId !== null) {
                  handleReject(declineOpenId);
                  setDeclineOpenId(null);
                }
              }}
              disabled={rejecting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejecting ? t("common.declining", "Declining...") : t("common.decline", "Decline")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
