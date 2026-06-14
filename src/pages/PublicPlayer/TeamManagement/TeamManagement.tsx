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
} from "@/hooks/queries/useEntryQueries";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

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
          {entries.map(({ entry, role }: any) => (
            <TeamCard
              key={entry.id}
              entry={entry}
              role={role}
              userId={userId}
            />
          ))}
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

  const { data: requestsResp } = useEntryJoinRequests(entryId, {
    enabled: role === "captain",
  });
  const joinRequests = requestsResp?.joinRequests || [];

  const { data: membersResp } = useEntryMembers(entryId);
  const members = membersResp?.members || [];

  const { mutate: respondJoin } = useRespondJoinRequest();
  const { mutate: transferCaptaincy } = useTransferCaptaincy();
  const { mutate: setRequired } = useSetRequiredMembers();
  const { mutate: updateEntry } = useUpdateEntry();
  const { mutate: deleteEntry } = useDeleteEntry();
  const { mutate: confirmLineup } = useConfirmLineup();

  const handleRespond = (joinRequestId: number, action: "approve" | "reject") => {
    respondJoin({ joinRequestId, entryId, data: { action } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{entry.name}</span>
          <Badge variant={role === "captain" ? "default" : "secondary"}>
            {role.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p>
            <strong>{t("publicPlayer.teamManagement.category")}</strong> {entry.category?.name}
          </p>
          <p>
            <strong>{t("publicPlayer.teamManagement.members")}</strong> {entry.currentMemberCount} /{" "}
            {entry.requiredMemberCount}
          </p>
          <p>
            <strong>{t("publicPlayer.teamManagement.confirmed")}</strong> {entry.isConfirmed ? "Yes" : "No"}
          </p>
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
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span>{req.user?.username || req.userId}</span>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleRespond(req.id, "approve")}
                      >
                        {t("publicPlayer.teamManagement.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRespond(req.id, "reject")}
                      >
                        {t("publicPlayer.teamManagement.reject")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Members */}
            <div className="space-y-2">
              <h5 className="font-medium">{t("publicPlayer.tournamentDetail.registrationTab.members").replace(":", "")}</h5>
              {members.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{member.user?.username || member.userId}</span>
                  {member.userId !== userId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        transferCaptaincy({
                          entryId,
                          newCaptainId: member.userId,
                        })
                      }
                    >
                      {t("publicPlayer.teamManagement.makeCaptain")}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setRequired({
                    entryId,
                    requiredMemberCount: entry.requiredMemberCount + 1,
                  })
                }
              >
                {t("publicPlayer.teamManagement.requiredMember")}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateEntry({
                    id: entryId,
                    data: {
                      isAcceptingMembers: !entry.isAcceptingMembers,
                    },
                  })
                }
              >
                {t("publicPlayer.teamManagement.toggleAccepting")}
              </Button>
              <Button
                disabled={entry.isConfirmed}
                onClick={() => confirmLineup(entryId)}
              >
                {t("publicPlayer.teamManagement.confirmLineup")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteEntry(entryId)}
              >
                {t("publicPlayer.teamManagement.deleteEntry")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
