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
import {
  usePendingLineups,
  useApproveLineups,
  useRejectLineups,
} from "@/hooks/queries/useSubMatchPlayerQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
                onClick={() => finalizeMatch(match.id, {
                  onSuccess: () => showToast.success(t("matchExecution.finalizeSuccess", "Match finalized successfully")),
                  onError: (err: any) => showApiError(err, t("matchExecution.finalizeError", "Failed to finalize match")),
                })}
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

  // Lineup Approval Logic
  const { data: pendingLineupsResp } = usePendingLineups();
  const pendingLineups = pendingLineupsResp?.lineups || [];
  const hasPendingLineup = pendingLineups.some((l: any) => l.matchId === subMatch.matchId);
  const { mutate: approveLineups, isPending: approvingLineup } = useApproveLineups();
  const { mutate: rejectLineups, isPending: rejectingLineup } = useRejectLineups();
  const [isLineupDialogOpen, setIsLineupDialogOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  const handleApproveLineup = () => {
    approveLineups(subMatch.matchId, {
      onSuccess: () => {
        setIsLineupDialogOpen(false);
        showToast.success(t("matchExecution.approveSuccess", "Lineup approved successfully"));
      },
      onError: (err: any) => showApiError(err, t("matchExecution.approveError", "Failed to approve lineup")),
    });
  };

  const handleRejectLineup = () => {
    rejectLineups(
      { matchId: subMatch.matchId, data: { reviewNotes: "Rejected by Umpire" } },
      {
        onSuccess: () => {
          setIsLineupDialogOpen(false);
          showToast.success(t("matchExecution.rejectSuccess", "Lineup rejected successfully"));
        },
        onError: (err: any) => showApiError(err, t("matchExecution.rejectError", "Failed to reject lineup")),
      }
    );
  };

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
        onError: (err: any) => showApiError(err, t("matchExecution.updateScoreError", "Failed to update score")),
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
          <div className="flex flex-col gap-3">
            {hasPendingLineup && (
              <Dialog open={isLineupDialogOpen} onOpenChange={setIsLineupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-amber-500 text-amber-600">
                    {t("matchExecution.reviewLineup", "Review Pending Lineup")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("matchExecution.lineupApproval", "Lineup Approval")}</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>{t("matchExecution.lineupPendingMessage", "There are pending lineup requests for this match. Please review and approve them before starting.")}</p>
                  </div>
                  <DialogFooter className="flex gap-2 justify-end">
                    <Button variant="destructive" onClick={() => setIsRejectConfirmOpen(true)} disabled={rejectingLineup || approvingLineup}>
                      {t("matchExecution.reject", "Reject")}
                    </Button>
                    <Button onClick={handleApproveLineup} disabled={rejectingLineup || approvingLineup}>
                      {t("matchExecution.approve", "Approve")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {hasPendingLineup && (
              <AlertDialog open={isRejectConfirmOpen} onOpenChange={setIsRejectConfirmOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("matchExecution.rejectConfirmTitle", "Reject Lineup?")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("matchExecution.rejectConfirmDesc", "Are you sure you want to reject this lineup? Players will have to submit a new one.")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={rejectingLineup}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleRejectLineup();
                        setIsRejectConfirmOpen(false);
                      }}
                      disabled={rejectingLineup}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {rejectingLineup ? t("common.rejecting", "Rejecting...") : t("common.reject", "Reject")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button
              onClick={() => startSubMatch(subMatch.id, {
                onSuccess: () => showToast.success(t("matchExecution.startSubMatchSuccess", "Sub-match started successfully")),
                onError: (err: any) => showApiError(err, t("matchExecution.startSubMatchError", "Failed to start sub-match")),
              })}
              disabled={starting || hasPendingLineup}
            >
              {t("matchExecution.startSubMatch", "Start Sub-Match")}
            </Button>
          </div>
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
              onClick={() => finalizeSubMatch(subMatch.id, {
                onSuccess: () => showToast.success(t("matchExecution.finalizeSubMatchSuccess", "Sub-match finalized successfully")),
                onError: (err: any) => showApiError(err, t("matchExecution.finalizeSubMatchError", "Failed to finalize sub-match")),
              })}
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
