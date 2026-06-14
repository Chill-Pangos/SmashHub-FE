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
import { useTranslation } from "react-i18next";

export default function MatchExecution() {
  const { t } = useTranslation();
  const { matchId } = useParams();

  const { data: matchResp, isLoading: matchLoading } = useMatch(
    Number(matchId)
  );
  const match = matchResp;

  const { data: subMatchesResp } = useSubMatchesByMatch(Number(matchId), 1, 50);
  const subMatches = subMatchesResp?.subMatches || [];

  const { mutate: finalizeMatch, isPending: finalizingMatch } =
    useFinalizeMatch();

  // Assuming Chief Referee if user has "chief_referee" role or is assigned as such
  const isChief = true; // In a real app, check user role. Let's assume true to show UI.

  if (matchLoading) return <div className="p-6">{t("matchExecution.loading", "Loading match...")}</div>;
  if (!match) return <div className="p-6">{t("matchExecution.notFound", "Match not found.")}</div>;

  return (
    <div className="px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("matchExecution.title", "Match Execution #")}{match.id}</h1>
        <Badge>{match.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("matchExecution.overview", "Match Overview")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>{t("matchExecution.category", "Category:")}</strong> {match.schedule?.tournamentContent?.name || "Category"}
            </p>
            <p>
              <strong>{t("matchExecution.status", "Status:")}</strong> {match.status}
            </p>
            {isChief && (
              <Button
                onClick={() => finalizeMatch(match.id)}
                disabled={finalizingMatch}
              >
                {t("matchExecution.chiefFinalize", "Chief: Finalize Match")}
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">{t("matchExecution.subMatches", "Sub-Matches")}</h2>
          {subMatches.map((sm: any) => (
            <SubMatchCard key={sm.id} subMatch={sm} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubMatchCard({ subMatch }: { subMatch: any }) {
  const { t } = useTranslation();
  const { mutate: startSubMatch, isPending: starting } = useStartSubMatch();
  const { mutate: finalizeSubMatch, isPending: finalizing } =
    useFinalizeSubMatch();

  const [activeSetNumber, setActiveSetNumber] = useState(1);
  const { data: liveScoreResp } = useLiveScore(subMatch.id, activeSetNumber);
  const liveScore = liveScoreResp;

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
          <span>{t("matchExecution.subMatchTitle", "Sub-Match #")}{subMatch.subMatchNumber}</span>
          <Badge>{subMatch.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subMatch.status === "scheduled" && (
          <Button
            onClick={() => startSubMatch(subMatch.id)}
            disabled={starting}
          >
            {t("matchExecution.startSubMatch", "Start Sub-Match")}
          </Button>
        )}

        {(subMatch.status === "in_progress" || subMatch.status === "live") && (
          <div className="space-y-4">
            <h3 className="font-semibold text-center">
              {t("matchExecution.setScore", { setNumber: activeSetNumber, defaultValue: `Set ${activeSetNumber} Score` })}
            </h3>
            <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold">{t("matchExecution.teamA", "Team A")}</span>
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
                <span className="font-bold">{t("matchExecution.teamB", "Team B")}</span>
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
              {t("matchExecution.finalizeSubMatch", "Finalize Sub-Match")}
            </Button>
          </div>
        )}

        {subMatch.status === "completed" && (
          <p className="text-green-600 font-semibold">{t("matchExecution.subMatchCompleted", "Sub-Match Completed")}</p>
        )}
      </CardContent>
    </Card>
  );
}
