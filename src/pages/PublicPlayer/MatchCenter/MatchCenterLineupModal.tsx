import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubmitLineup } from "@/hooks/queries/useSubMatchPlayerQueries";
import { useSubMatchesByMatch } from "@/hooks/queries/useSubMatchQueries";

export default function MatchCenterLineupModal({
  matchId,
  onClose,
}: {
  matchId: number;
  onClose: () => void;
}) {
  const { data: subMatchesResp } = useSubMatchesByMatch(matchId, 1, 50);
  const subMatches = subMatchesResp?.subMatches || [];
  const { mutate: submitLineup, isPending } = useSubmitLineup();

  // In a real scenario, we'd fetch entryMembers of the user's entry in this match.
  // For demo/mock purposes, we collect memberIds as string input per submatch.
  const [lineupData, setLineupData] = useState<Record<number, string>>({});

  const handleSubmit = () => {
    const lineups = subMatches.map((sm: any) => ({
      subMatchId: sm.id,
      entryMemberIds: lineupData[sm.id]
        ? lineupData[sm.id].split(",").map((s) => parseInt(s.trim()))
        : [],
    }));

    submitLineup(
      { matchId, data: { lineups } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Lineup (Match #{matchId})</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the member IDs (comma separated) for each submatch.
          </p>
          {subMatches.length > 0 ? (
            subMatches.map((sm: any) => (
              <div key={sm.id} className="space-y-2">
                <label className="text-sm font-medium">
                  Submatch #{sm.subMatchNumber} (Type: {sm.matchType})
                </label>
                <input
                  type="text"
                  placeholder="e.g. 101, 102"
                  className="w-full px-3 py-2 border rounded-md"
                  value={lineupData[sm.id] || ""}
                  onChange={(e) =>
                    setLineupData({ ...lineupData, [sm.id]: e.target.value })
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-sm">No submatches found.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            Submit Lineup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
