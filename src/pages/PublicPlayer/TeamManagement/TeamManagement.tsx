import {
  useMyEntries,
  useEntryJoinRequests,
  useRespondJoinRequest,
  useTransferCaptaincy,
  useSetRequiredMembers,
  useUpdateEntry,
  useDeleteEntry,
  useConfirmLineup,
  useEntryMembers,
  useEntry,
} from "@/hooks/queries/useEntryQueries";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/api.utils";
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
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function TeamManagement() {
  const { t } = useTranslation();
  const { data: userResp } = useCurrentUser();
  const userId = userResp?.id;

  const { data: entriesResp, isLoading } = useMyEntries();
  const entries = entriesResp?.rows || [];

  return (
    <div className="px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">{t("publicPlayer.teamManagement.title")}</h1>
      <p className="text-muted-foreground">{t("publicPlayer.teamManagement.subtitle")}</p>

      {isLoading ? (
        <p>{t("publicPlayer.teamManagement.loading")}</p>
      ) : entries.length > 0 ? (
        <div className="space-y-6">
          {entries.map((row: any) => {
            const entryData = row.entry ? row.entry : row;
            const roleData = row.role || "member";
            return (
              <TeamCard
                key={entryData.id}
                entry={entryData}
                role={roleData}
                userId={userId}
              />
            );
          })}
        </div>
      ) : (
        <p>{t("publicPlayer.teamManagement.noEntries")}</p>
      )}
    </div>
  );
}

function TeamCard({ entry, role, userId }: any) {
  const { t } = useTranslation();
  const { id: entryId } = entry;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState<number | null>(null);

  const { data: requestsResp } = useEntryJoinRequests(entryId, {
    enabled: role === "captain",
  });
  const joinRequests = requestsResp?.joinRequests || [];

  const { data: membersResp } = useEntryMembers(entryId);
  const members = membersResp?.members || [];

  const { data: detailedEntry } = useEntry(entryId);
  const displayEntry = detailedEntry || entry;

  const { mutate: respondJoin } = useRespondJoinRequest();
  const { mutate: transferCaptaincy } = useTransferCaptaincy();
  const { mutate: setRequired } = useSetRequiredMembers();
  const { mutate: updateEntry } = useUpdateEntry();
  const { mutate: deleteEntry } = useDeleteEntry();
  const { mutate: confirmLineup } = useConfirmLineup();

  const handleRespond = (joinRequestId: number, action: "approve" | "reject") => {
    respondJoin(
      { joinRequestId, entryId, data: { action } },
      {
        onSuccess: () => showToast.success(t("publicPlayer.teamManagement.respondSuccess", "Request processed successfully")),
        onError: (err: any) => showApiError(err, t("publicPlayer.teamManagement.respondError", "Failed to process request"))
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {displayEntry.captain && displayEntry.category?.type !== "single" && (
              <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarImage src={getImageUrl(displayEntry.captain.avatarUrl)} alt={displayEntry.captain.firstName || "Captain"} />
                <AvatarFallback className="bg-secondary text-primary">
                  {(displayEntry.captain.firstName || "C").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <span className="text-xl">{displayEntry.name}</span>
              {displayEntry.captain && displayEntry.category?.type !== "single" && (
                <span className="text-sm font-normal text-muted-foreground mt-0.5">
                  {t("publicPlayer.teamManagement.captainControls").replace(" Controls", "").replace("Quyền đ", "Đ")} {displayEntry.captain.firstName} {displayEntry.captain.lastName}
                </span>
              )}
            </div>
          </div>
          <Badge variant={role === "captain" ? "default" : "secondary"} className="text-sm px-3 py-1 uppercase">
            {displayEntry.category?.type === "single" 
              ? t("publicPlayer.teamManagement.singleEntry", "Single Entry")
              : role === "captain" 
                ? t("publicPlayer.teamManagement.captainRole", "Captain")
                : t("publicPlayer.teamManagement.memberRole", "Member")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="space-y-3">
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-28">{t("publicPlayer.teamManagement.tournament", "Tournament")}</span>
                <span className="font-medium text-right sm:text-left">{displayEntry.category?.tournament?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-28">{t("publicPlayer.teamManagement.category", "Category")}</span>
                <span className="font-medium text-right sm:text-left">{displayEntry.category?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-28">{t("publicPlayer.teamManagement.type", "Type")}</span>
                <span className="font-medium capitalize text-right sm:text-left">
                  {displayEntry.category?.type 
                    ? (t(`constants.format.${displayEntry.category.type}`, displayEntry.category.type) as string) 
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-28">{t("publicPlayer.teamManagement.gender", "Gender")}</span>
                <span className="font-medium capitalize text-right sm:text-left">
                  {displayEntry.category?.gender 
                    ? (t(`constants.gender.${displayEntry.category.gender}`, displayEntry.category.gender) as string) 
                    : (t("constants.any", "Any") as string)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-32">{t("publicPlayer.teamManagement.members", "Members")}</span>
                <span className="font-medium text-right sm:text-left">{displayEntry.currentMemberCount} / {displayEntry.requiredMemberCount}</span>
              </div>
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-32">{t("publicPlayer.teamManagement.maxSets", "Max Sets")}</span>
                <span className="font-medium text-right sm:text-left">{displayEntry.category?.maxSets || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-32">{t("publicPlayer.teamManagement.entryFee", "Entry Fee")}</span>
                <span className="font-medium text-right sm:text-left">{displayEntry.category?.entryFee === "0.00" ? (t("constants.free", "Free") as string) : displayEntry.category?.entryFee || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center sm:justify-start">
                <span className="text-muted-foreground sm:w-32">{t("publicPlayer.teamManagement.confirmed", "Confirmed")}</span>
                <span className="text-right sm:text-left">
                  <Badge variant={displayEntry.isConfirmed ? "default" : "destructive"} className="h-5 px-2 rounded-sm text-[10px]">
                    {displayEntry.isConfirmed ? t("publicPlayer.teamManagement.yes", "Yes") : t("publicPlayer.teamManagement.no", "No")}
                  </Badge>
                </span>
              </div>
            </div>
          </div>

        {role === "captain" && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-lg">{t("publicPlayer.teamManagement.captainControls")}</h4>

            {/* Join Requests */}
            {joinRequests.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">{t("publicPlayer.teamManagement.pendingRequests")}</h5>
                  {joinRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/10 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-9 h-9 border border-border">
                          <AvatarImage src={getImageUrl(req.user?.avatarUrl)} alt={req.user?.firstName || "User"} />
                          <AvatarFallback className="bg-secondary text-primary">
                            {(req.user?.firstName || req.user?.username || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm truncate">
                            {req.user?.firstName} {req.user?.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {req.user?.email || req.user?.username || `ID: ${req.userId}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(req.id, "approve")}
                        >
                          {t("publicPlayer.teamManagement.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRejectRequestId(req.id)}
                        >
                          {t("publicPlayer.teamManagement.reject")}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Members */}
            {members.filter((m: any) => m.userId !== displayEntry.captainId).length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">{t("publicPlayer.tournamentDetail.registrationTab.members").replace(":", "")}</h5>
                {members.filter((m: any) => m.userId !== displayEntry.captainId).map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors bg-card"
                  >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src={getImageUrl(member.user?.avatarUrl)} alt={member.user?.firstName || "Member"} />
                      <AvatarFallback className="bg-secondary text-primary">
                        {(member.user?.firstName || member.user?.username || "M").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm truncate">
                        {member.user?.firstName} {member.user?.lastName} {member.userId === userId && "(You)"}
                      </span>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5">
                        <span className="truncate">{member.user?.email || member.user?.username || `ID: ${member.userId}`}</span>
                        {member.user?.gender && <span className="capitalize">• {member.user.gender}</span>}
                        {member.user?.dob && <span>• DOB: {member.user.dob}</span>}
                        {member.eloAtEntry !== undefined && <span className="text-cyan-500 font-medium">• ELO: {member.eloAtEntry}</span>}
                      </div>
                    </div>
                  </div>
                  {member.userId !== userId && role === "captain" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 flex-shrink-0"
                      onClick={() =>
                        transferCaptaincy(
                          {
                            entryId,
                            newCaptainId: member.userId,
                          },
                          {
                            onSuccess: () => showToast.success(t("publicPlayer.teamManagement.transferSuccess", "Captaincy transferred successfully")),
                            onError: (err: any) => showApiError(err, t("publicPlayer.teamManagement.transferError", "Failed to transfer captaincy")),
                          }
                        )
                      }
                    >
                      {t("publicPlayer.teamManagement.makeCaptain")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setRequired(
                    {
                      entryId,
                      requiredMemberCount: entry.requiredMemberCount + 1,
                    },
                    {
                      onSuccess: () => showToast.success(t("publicPlayer.teamManagement.setRequiredSuccess", "Required members updated")),
                      onError: (err: any) => showApiError(err, t("publicPlayer.teamManagement.setRequiredError", "Failed to update required members")),
                    }
                  )
                }
              >
                {t("publicPlayer.teamManagement.requiredMember")}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateEntry(
                    {
                      id: entryId,
                      data: {
                        isAcceptingMembers: !entry.isAcceptingMembers,
                      },
                    },
                    {
                      onSuccess: () => showToast.success(t("publicPlayer.teamManagement.updateEntrySuccess", "Entry updated successfully")),
                      onError: (err: any) => showApiError(err, t("publicPlayer.teamManagement.updateEntryError", "Failed to update entry")),
                    }
                  )
                }
              >
                {t("publicPlayer.teamManagement.toggleAccepting")}
              </Button>
              <Button
                disabled={entry.isConfirmed}
                onClick={() => confirmLineup(entryId, {
                  onSuccess: () => showToast.success(t("publicPlayer.teamManagement.confirmSuccess", "Lineup confirmed successfully")),
                  onError: (err: any) => showApiError(err, t("publicPlayer.teamManagement.confirmError", "Failed to confirm lineup")),
                })}
              >
                {t("publicPlayer.teamManagement.confirmLineup")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                {t("publicPlayer.teamManagement.deleteEntry")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("publicPlayer.teamManagement.deleteTitle", "Delete Team?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("publicPlayer.teamManagement.deleteDesc", "Are you sure you want to delete this team? This action cannot be undone.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteEntry(entryId, {
                  onSuccess: () => showToast.success(t("publicPlayer.teamManagement.deleteSuccess", "Team deleted successfully")),
                  onError: (err: any) => showApiError(err, t("publicPlayer.teamManagement.deleteError", "Failed to delete team")),
                });
                setIsDeleteOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectRequestId !== null} onOpenChange={(open) => !open && setRejectRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("publicPlayer.teamManagement.rejectJoinTitle", "Reject Join Request?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("publicPlayer.teamManagement.rejectJoinDesc", "Are you sure you want to reject this user's join request?")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (rejectRequestId !== null) {
                  handleRespond(rejectRequestId, "reject");
                  setRejectRequestId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.reject", "Reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
