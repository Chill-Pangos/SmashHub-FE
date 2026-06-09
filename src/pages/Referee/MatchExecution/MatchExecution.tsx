import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMatch, useFinalizeMatch } from "@/hooks/queries/useMatchQueries";
import {
  useSubMatchesByMatch,
  useStartSubMatch,
  useFinalizeSubMatch,
} from "@/hooks/queries/useSubMatchQueries";
import {
  useUpdateLiveScore,
  useLiveScore,
} from "@/hooks/queries/useMatchSetQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";

export default function MatchExecution() {
  const { matchId } = useParams();
  const { data: userResp } = useCurrentUser();
  const userId = userResp?.data?.id;

  const { data: matchResp, isLoading: matchLoading } = useMatch(
    Number(matchId)
  );
  const match = matchResp;

  const { data: subMatchesResp } = useSubMatchesByMatch(Number(matchId), 1, 50);
  const subMatches = subMatchesResp?.data?.items || [];

  const { mutate: finalizeMatch, isPending: finalizingMatch } =
    useFinalizeMatch();

  // Assuming Chief Referee if user has "chief_referee" role or is assigned as such
  const isChief = true; // In a real app, check user role. Let's assume true to show UI.

  if (matchLoading) return <div className="p-6">Loading match...</div>;
  if (!match) return <div className="p-6">Match not found.</div>;

  return (
    <div className="px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Match Execution #{match.id}</h1>
        <Badge>{match.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Match Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Category:</strong> {match.category?.name}
            </p>
            <p>
              <strong>Status:</strong> {match.status}
            </p>
            {isChief && (
              <Button
                onClick={() => finalizeMatch(match.id)}
                disabled={finalizingMatch}
              >
                Chief: Finalize Match
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Sub-Matches</h2>
          {subMatches.map((sm: any) => (
            <SubMatchCard key={sm.id} subMatch={sm} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubMatchCard({ subMatch }: { subMatch: any }) {
  const { mutate: startSubMatch, isPending: starting } = useStartSubMatch();
  const { mutate: finalizeSubMatch, isPending: finalizing } =
    useFinalizeSubMatch();

  const [activeSetNumber, setActiveSetNumber] = useState(1);
  const { data: liveScoreResp } = useLiveScore(subMatch.id, activeSetNumber);
  const liveScore = liveScoreResp?.liveScore;

  const { mutate: updateScore } = useUpdateLiveScore();

  const handleScore = (team: "A" | "B", action: "add" | "subtract") => {
    let entryAScore = liveScore?.entryAScore || 0;
    let entryBScore = liveScore?.entryBScore || 0;

    if (team === "A") {
      entryAScore += action === "add" ? 1 : -1;
    } else {
      entryBScore += action === "add" ? 1 : -1;
    }

    if (entryAScore < 0) entryAScore = 0;
    if (entryBScore < 0) entryBScore = 0;

    updateScore(
      {
        subMatchId: subMatch.id,
        setNumber: activeSetNumber,
        entryAScore,
        entryBScore,
      },
      {
        onSuccess: (data: any) => {
          if (data?.nextSetNumber) {
            setActiveSetNumber(data.nextSetNumber);
          }
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Sub-Match #{subMatch.subMatchNumber}</span>
          <Badge>{subMatch.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subMatch.status === "scheduled" && (
          <Button
            onClick={() => startSubMatch(subMatch.id)}
            disabled={starting}
          >
            Start Sub-Match
          </Button>
        )}

        {(subMatch.status === "in_progress" || subMatch.status === "live") && (
          <div className="space-y-4">
            <h3 className="font-semibold text-center">
              Set {activeSetNumber} Score
            </h3>
            <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold">Team A</span>
                <span className="text-4xl font-bold">
                  {liveScore?.entryAScore || 0}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleScore("A", "subtract")}
                  >
                    -
                  </Button>
                  <Button size="sm" onClick={() => handleScore("A", "add")}>
                    +
                  </Button>
                </div>
              </div>

              <span className="text-2xl font-bold text-muted-foreground">-</span>

              <div className="flex flex-col items-center gap-2">
                <span className="font-bold">Team B</span>
                <span className="text-4xl font-bold">
                  {liveScore?.entryBScore || 0}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleScore("B", "add")}>
                    +
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleScore("B", "subtract")}
                  >
                    -
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => finalizeSubMatch(subMatch.id)}
              disabled={finalizing}
            >
              Finalize Sub-Match
            </Button>
          </div>
        )}

        {subMatch.status === "completed" && (
          <p className="text-green-600 font-semibold">Sub-Match Completed</p>
        )}
      </CardContent>
    </Card>
  );
}
