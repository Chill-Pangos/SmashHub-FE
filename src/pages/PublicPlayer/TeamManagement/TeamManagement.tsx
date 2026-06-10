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

export default function TeamManagement() {
  const { data: userResp } = useCurrentUser();
  const userId = userResp?.id;

  const { data: entriesResp, isLoading } = useMyEntries();
  const entries = entriesResp?.rows || [];

  return (
    <div className="px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Team Management</h1>
      <p className="text-muted-foreground">Manage your teams and entries.</p>

      {isLoading ? (
        <p>Loading...</p>
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
        <p>No entries found.</p>
      )}
    </div>
  );
}

function TeamCard({ entry, role, userId }: any) {
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
            <strong>Category:</strong> {entry.category?.name}
          </p>
          <p>
            <strong>Members:</strong> {entry.currentMemberCount} /{" "}
            {entry.requiredMemberCount}
          </p>
          <p>
            <strong>Confirmed:</strong> {entry.isConfirmed ? "Yes" : "No"}
          </p>
        </div>

        {role === "captain" && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-lg">Captain Controls</h4>

            {/* Join Requests */}
            {joinRequests.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Pending Join Requests</h5>
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
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRespond(req.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Members */}
            <div className="space-y-2">
              <h5 className="font-medium">Members</h5>
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
                      Make Captain
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
                +1 Required Member
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
                Toggle Accepting Members
              </Button>
              <Button
                disabled={entry.isConfirmed}
                onClick={() => confirmLineup(entryId)}
              >
                Confirm Lineup
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteEntry(entryId)}
              >
                Delete Entry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
