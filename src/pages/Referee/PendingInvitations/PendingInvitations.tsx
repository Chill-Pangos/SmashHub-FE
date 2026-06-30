import {
  useMyRefereeInvitations,
  useAcceptRefereeInvitation,
  useRejectRefereeInvitation,
} from "@/hooks/queries/useTournamentRefereeQueries";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDateFormat } from "@/hooks/useDateFormat";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MapPin, User, Clock, Trophy, Shield, Calendar } from "lucide-react";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";

export default function PendingInvitations() {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
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
  const [rejectionReason, setRejectionReason] = useState("");

  const handleAccept = (invitationId: number) => {
    acceptInvite({ invitationId }, {
      onSuccess: () => showToast.success(t("pendingInvitations.acceptSuccess", "Invitation accepted successfully")),
      onError: (err: any) => showApiError(err, t("pendingInvitations.acceptError", "Failed to accept invitation")),
    });
  };

  const handleRejectWithReason = () => {
    if (rejectModal.invitationId) {
      rejectInvite({ invitationId: rejectModal.invitationId, rejectionReason: rejectionReason.trim() || undefined }, {
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
    return formatDateTime(dateStr);
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

                  {inv.tournament?.scheduleConfig && (
                    <div className="p-3 bg-secondary/20 rounded-lg text-xs space-y-2 mt-4 border border-border/40">
                      <div className="font-medium text-foreground/80 mb-1 flex items-center gap-1.5 pb-1 border-b border-border/50">
                        <Calendar className="w-3.5 h-3.5" />
                        {t("pendingInvitations.tournamentSchedule", "Tournament Schedule")}
                      </div>
                      {inv.tournament.scheduleConfig.startDate && (
                        <div className="flex justify-between items-start text-muted-foreground gap-2">
                          <span className="shrink-0">{t("pendingInvitations.eventDate", "Event:")}</span>
                          <span className="font-medium text-foreground text-right">{formatDate(inv.tournament.scheduleConfig.startDate)}</span>
                        </div>
                      )}
                      {inv.tournament.scheduleConfig.registrationStartDate && (
                        <div className="flex justify-between items-start text-muted-foreground gap-2">
                          <span className="shrink-0">{t("pendingInvitations.regOpen", "Reg. Open:")}</span>
                          <span className="font-medium text-foreground text-right">{formatDate(inv.tournament.scheduleConfig.registrationStartDate)}</span>
                        </div>
                      )}
                      {inv.tournament.scheduleConfig.registrationEndDate && (
                        <div className="flex justify-between items-start text-muted-foreground gap-2">
                          <span className="shrink-0">{t("pendingInvitations.regClose", "Reg. Close:")}</span>
                          <span className="font-medium text-foreground text-right">{formatDate(inv.tournament.scheduleConfig.registrationEndDate)}</span>
                        </div>
                      )}
                      {inv.tournament.scheduleConfig.bracketGenerationDate && (
                        <div className="flex justify-between items-start text-muted-foreground gap-2">
                          <span className="shrink-0">{t("pendingInvitations.bracketDate", "Bracket:")}</span>
                          <span className="font-medium text-foreground text-right">{formatDate(inv.tournament.scheduleConfig.bracketGenerationDate)}</span>
                        </div>
                      )}
                    </div>
                  )}

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
                  <Button
                    variant="outline"
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setRejectModal({ isOpen: true, invitationId: inv.id })}
                    disabled={accepting || rejecting}
                  >
                    {t("pendingInvitations.decline", "Decline")}
                  </Button>
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
            <DialogTitle>{t("pendingInvitations.declineConfirmTitle", "Decline Invitation?")}</DialogTitle>
            <DialogDescription>
              {t("pendingInvitations.declineConfirmDescReason", "Are you sure you want to decline this referee invitation? You can optionally provide a reason.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t("pendingInvitations.reasonOptionalPlaceholder", "Enter reason (optional)")}
              className="bg-input border-border"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectModal({ isOpen: false, invitationId: null })}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleRejectWithReason} disabled={rejecting}>
              {rejecting ? t("common.declining", "Declining...") : t("common.decline", "Decline")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
