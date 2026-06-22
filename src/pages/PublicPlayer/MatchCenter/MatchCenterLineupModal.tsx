import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitLineup } from "@/hooks/queries/useSubMatchPlayerQueries";
import { useSubMatchesByMatch } from "@/hooks/queries/useSubMatchQueries";
import { useMatch } from "@/hooks/queries/useMatchQueries";
import { useMyEntries, useEntryMembers } from "@/hooks/queries/useEntryQueries";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";

export default function MatchCenterLineupModal({
  matchId,
  onClose,
}: {
  matchId: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { data: matchResp } = useMatch(matchId);
  const match = matchResp;

  const { data: myEntriesResp } = useMyEntries();
  const myEntries = myEntriesResp?.rows || [];

  const userEntryId = match
    ? myEntries.find(
        (e: any) =>
          e.entry.id === match.entryAId || e.entry.id === match.entryBId
      )?.entry.id
    : null;

  const { data: membersResp } = useEntryMembers(userEntryId || 0, 1, 100, {
    enabled: !!userEntryId,
  });
  const entryMembers = membersResp?.members || [];

  const { data: subMatchesResp } = useSubMatchesByMatch(matchId, 1, 50);
  const subMatches = subMatchesResp?.subMatches || [];
  const { mutate: submitLineup, isPending } = useSubmitLineup();

  // lineupData maps subMatchId to an array of selected member user IDs
  const [lineupData, setLineupData] = useState<Record<number, number[]>>({});

  const toggleMemberSelection = (subMatchId: number, memberUserId: number) => {
    setLineupData((prev) => {
      const current = prev[subMatchId] || [];
      if (current.includes(memberUserId)) {
        return { ...prev, [subMatchId]: current.filter((id) => id !== memberUserId) };
      } else {
        return { ...prev, [subMatchId]: [...current, memberUserId] };
      }
    });
  };

  const handleSubmit = () => {
    const lineups = subMatches.map((sm: any) => ({
      subMatchId: sm.id,
      entryMemberIds: lineupData[sm.id] || [],
    }));

    submitLineup(
      { matchId, data: { lineups } },
      {
        onSuccess: () => {
          showToast.success(t("publicPlayer.matchCenter.lineupSubmitted", "Lineup submitted successfully"));
          onClose();
        },
        onError: (err: any) => {
          showApiError(err, t("publicPlayer.matchCenter.lineupSubmitError", "Failed to submit lineup"));
        }
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("publicPlayer.matchCenter.submitLineup", "Submit Lineup")} (Match #{matchId})</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6 overflow-y-auto flex-1 pr-2">
          <p className="text-sm text-muted-foreground">
            {t("publicPlayer.matchCenter.selectMembersForSubmatch", "Select the players for each submatch below.")}
          </p>
          {subMatches.length > 0 ? (
            subMatches.map((sm: any) => (
              <div key={sm.id} className="space-y-3 p-4 border rounded-lg bg-card/50">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold">
                    {t("publicPlayer.matchCenter.submatch", "Submatch #{{num}}").replace("{{num}}", sm.subMatchNumber)}
                  </label>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{sm.matchType}</span>
                </div>
                
                {entryMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {entryMembers.map((member: any) => {
                      const isSelected = (lineupData[sm.id] || []).includes(member.user.id);
                      return (
                        <div 
                          key={member.id} 
                          className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}
                          onClick={() => toggleMemberSelection(sm.id, member.user.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleMemberSelection(sm.id, member.user.id)}
                          />
                          <div className="flex flex-col leading-none">
                            <span className="text-sm font-medium">{member.user.firstName} {member.user.lastName}</span>
                            <span className="text-xs text-muted-foreground">@{member.user.username}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">{t("publicPlayer.matchCenter.noMembersFound", "No members found in your entry.")}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm">{t("publicPlayer.matchCenter.noSubmatchesFound", "No submatches found.")}</p>
          )}
        </div>
        <DialogFooter className="mt-4 pt-4 border-t shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? t("common.submitting", "Submitting...") : t("publicPlayer.matchCenter.submitLineupBtn", "Submit Lineup")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
