import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMatch, useFinalizeMatch, useApproveMatch } from "@/hooks/queries/useMatchQueries";
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
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
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
  AlertDialogTrigger,
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

  const { data: userResp } = useCurrentUser();

  const roleItem = userResp?.roles?.[0];
  const roleName = typeof roleItem === 'object' ? (roleItem as any)?.name : undefined;
  const isChiefReferee = roleName === "chief_referee" || roleName === "CHIEF_REFEREE";

  const isAssignedReferee = match?.matchReferees?.some(
    (mr: { refereeId: number }) => mr.refereeId === userResp?.id
  );

  const { data: subMatchesResp } = useSubMatchesByMatch(Number(matchId), 1, 50);
  const subMatches = subMatchesResp?.subMatches || [];

  const { mutate: finalizeMatch, isPending: finalizingMatch } =
    useFinalizeMatch();

  const { mutate: approveMatch, isPending: approvingMatch } = useApproveMatch();

  const [matchReadyToFinalize, setMatchReadyToFinalize] = useState(false);

  if (matchLoading) return <div className="p-6">{t("matchExecution.loading", "Loading match...")}</div>;
  if (!match) return <div className="p-6">{t("matchExecution.notFound", "Match not found.")}</div>;

  return (
    <div className="px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("matchExecution.title", "Match Execution #")}{match.id}</h1>
        <Badge>{t(`constants.status.match.${match.status}`, match.status) as string}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={matchReadyToFinalize ? "border-green-500 shadow-lg" : ""}>
          <CardHeader>
            <CardTitle>{t("matchExecution.overview", "Match Overview")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>{t("matchExecution.category", "Category:")}</strong> {(match.schedule as any)?.tournamentCategory?.name || match.schedule?.tournamentContent?.name || "Category"}
            </p>
            <p>
              <strong>{t("matchExecution.status", "Status:")}</strong> {t(`constants.status.match.${match.status}`, match.status) as string}
            </p>
            <div className="flex justify-between items-center py-4 border-y border-border my-4">
              <div className="flex flex-col items-center gap-1 w-1/3">
                <span className="font-bold text-center line-clamp-2">{(match.entryA as any)?.name || t("matchExecution.teamA", "Team A")}</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-1/3">
                <span className="text-sm font-bold text-muted-foreground">{t("matchExecution.totalScore", "Total Score")}</span>
                <span className="text-2xl font-black">{match.setsWonA || 0} - {match.setsWonB || 0}</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-1/3">
                <span className="font-bold text-center line-clamp-2">{(match.entryB as any)?.name || t("matchExecution.teamB", "Team B")}</span>
              </div>
            </div>
            {isAssignedReferee && match.status === "in_progress" && (
              <Button
                variant={matchReadyToFinalize ? "default" : "outline"}
                onClick={() => finalizeMatch(match.id, {
                  onSuccess: () => {
                    showToast.success(t("matchExecution.finalizeSuccess", "Match finalized successfully"));
                    setMatchReadyToFinalize(false);
                  },
                  onError: (err: any) => showApiError(err, t("matchExecution.finalizeError", "Failed to finalize match")),
                })}
                disabled={finalizingMatch}
              >
                {t("matchExecution.refereeFinalize", "Referee: Finalize Match")}
              </Button>
            )}
            {matchReadyToFinalize && !isAssignedReferee && (
              <p className="text-amber-600 font-semibold text-sm">
                {t("matchExecution.matchReadyForReferee", "Match is completed. Waiting for assigned referee to finalize.")}
              </p>
            )}
            {match.resultStatus === "pending" && !isChiefReferee && (
              <p className="text-amber-600 font-semibold text-sm">
                {t("matchExecution.matchPendingApproval", "Match finalized. Waiting for Chief Referee approval.")}
              </p>
            )}
            {isChiefReferee && match.status === "completed" && match.resultStatus === "pending" && (
              <Button
                onClick={() => approveMatch({ id: match.id }, {
                  onSuccess: () => {
                    showToast.success(t("matchExecution.approveSuccess", "Match approved successfully"));
                  },
                  onError: (err: any) => showApiError(err, t("matchExecution.approveError", "Failed to approve match")),
                })}
                disabled={approvingMatch}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {t("matchExecution.chiefFinalize", "Chief: Finalize Match")}
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">{t("matchExecution.subMatches", "Sub-Matches")}</h2>
          {subMatches.map((sm: any) => (
            <SubMatchCard 
              key={sm.id} 
              subMatch={sm} 
              match={match}
              onMatchReady={() => setMatchReadyToFinalize(true)} 
              isUmpire={sm.umpireId === userResp?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubMatchCard({ subMatch, match, onMatchReady, isUmpire }: { subMatch: any; match: any; onMatchReady: () => void; isUmpire: boolean }) {
  const { t } = useTranslation();
  const { mutate: startSubMatch, isPending: starting } = useStartSubMatch();
  const { mutate: finalizeSubMatch, isPending: finalizing } =
    useFinalizeSubMatch();

  const [activeSetNumber, setActiveSetNumber] = useState(1);
  const { data: liveScoreResp } = useLiveScore(subMatch.id, activeSetNumber);
  const liveScore = liveScoreResp?.liveScore;

  const { mutate: updateScore, isPending: updatingScore } = useUpdateLiveScore();
  const [scoreStatus, setScoreStatus] = useState<any>(null);
  const [scoreHistory, setScoreHistory] = useState<{a: number, b: number}[]>([]);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [actionType, setActionType] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer]);

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
    let currentA = liveScore?.entryAScore || 0;
    let currentB = liveScore?.entryBScore || 0;

    let newA = currentA;
    let newB = currentB;

    if (team === "A") {
      newA += action === "add" ? 1 : -1;
    } else {
      newB += action === "add" ? 1 : -1;
    }

    if (newA < 0) newA = 0;
    if (newB < 0) newB = 0;

    setActionType(team);

    // push to history
    setScoreHistory(prev => [...prev, { a: currentA, b: currentB }]);

    updateScore(
      {
        subMatchId: subMatch.id,
        setNumber: activeSetNumber,
        entryAScore: newA,
        entryBScore: newB,
      },
      {
        onSuccess: (data: any) => {
          setScoreStatus(data);
          if (data?.message) {
            showToast.success(t("matchExecution.scoreUpdated", "Score updated successfully"), data.message);
          }
          if (data?.nextSetNumber) {
            setActiveSetNumber(data.nextSetNumber);
            setScoreHistory([]); // clear history on new set
          }
          setCooldownTimer(3);
        },
        onError: (err: any) => {
          showApiError(err, t("matchExecution.updateScoreError", "Failed to update score"));
          // revert history
          setScoreHistory(prev => prev.slice(0, -1));
        },
      }
    );
  };

  const handleUndoScore = () => {
    if (scoreHistory.length === 0) return;
    const prev = scoreHistory[scoreHistory.length - 1];
    setScoreHistory(curr => curr.slice(0, -1));
    updateScore({
      subMatchId: subMatch.id,
      setNumber: activeSetNumber,
      entryAScore: prev.a,
      entryBScore: prev.b,
    });
  };

  const isSubMatchReady = scoreStatus?.subMatchReadyToFinalize;

  const isTeamCategory = (match?.schedule as any)?.tournamentCategory?.type === "team";
  const cardTitleText = isTeamCategory 
    ? `${t("matchExecution.subMatchTitle", "Sub-Match #")}${subMatch.subMatchNumber}`
    : `${t("matchExecution.setNumber", "Set #")}${activeSetNumber}`;

  const teamAName = (match?.entryA as any)?.name || t("matchExecution.teamA", "Team A");
  const teamBName = (match?.entryB as any)?.name || t("matchExecution.teamB", "Team B");

  const completedSets = (subMatch.matchSets || []).filter((s: any) => s.status === "completed" || (s.entryAScore !== undefined && s.entryBScore !== undefined));

  return (
    <Card className={isSubMatchReady ? "border-amber-500 shadow-md" : ""}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{cardTitleText}</span>
          <Badge>{t(`constants.status.match.${subMatch.status}`, subMatch.status) as string}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subMatch.status === "scheduled" && (
          <div className="flex flex-col gap-3">
            {hasPendingLineup && isUmpire && (
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
            {hasPendingLineup && isUmpire && (
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
            {isUmpire ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={starting || hasPendingLineup}>
                    {t("matchExecution.startSubMatch", "Start Sub-Match")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("matchExecution.startConfirmTitle", "Start Sub-Match?")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("matchExecution.startConfirmDesc", "Are you sure you want to start this sub-match? Make sure players are ready.")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => startSubMatch(subMatch.id, {
                        onSuccess: () => showToast.success(t("matchExecution.startSubMatchSuccess", "Sub-match started successfully")),
                        onError: (err: any) => showApiError(err, t("matchExecution.startSubMatchError", "Failed to start sub-match")),
                      })}
                      disabled={starting}
                    >
                      {starting ? t("common.starting", "Starting...") : t("common.start", "Start")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <p className="text-sm text-muted-foreground text-center italic py-2">
                {t("matchExecution.waitingForUmpireToStart", "Waiting for Umpire to start the match...")}
              </p>
            )}
          </div>
        )}

        {(subMatch.status === "in_progress" || subMatch.status === "live") && (
          <div className="space-y-4">
            <h3 className="font-semibold text-center">
              {t("matchExecution.setScore", { setNumber: activeSetNumber, defaultValue: `Set ${activeSetNumber} Score` })}
            </h3>
            
            {scoreStatus?.isCompleted && (
              <div className="text-center text-sm text-green-600 font-medium">
                {t("matchExecution.setCompleted", "Set {{num}} Completed!").replace("{{num}}", (activeSetNumber - (scoreStatus?.nextSetNumber ? 1 : 0)).toString())}
              </div>
            )}

            <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg">
              <div className="flex flex-col items-center gap-2 flex-1 text-center">
                <span className="font-bold text-sm line-clamp-2">{teamAName}</span>
                <span className="text-4xl font-bold">
                  {liveScore?.entryAScore || 0}
                </span>
                {isUmpire && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScore("A", "subtract")}
                      disabled={updatingScore || cooldownTimer > 0}
                    >
                      -
                    </Button>
                    <Button size="sm" onClick={() => handleScore("A", "add")} disabled={updatingScore || cooldownTimer > 0}>
                      {cooldownTimer > 0 && actionType === 'A' ? cooldownTimer : '+'} 
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-muted-foreground">-</span>
                {isUmpire && scoreHistory.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={handleUndoScore} disabled={updatingScore} className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground">
                    {t("matchExecution.undo", "Undo")}
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 text-center">
                <span className="font-bold text-sm line-clamp-2">{teamBName}</span>
                <span className="text-4xl font-bold">
                  {liveScore?.entryBScore || 0}
                </span>
                {isUmpire && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleScore("B", "add")} disabled={updatingScore || cooldownTimer > 0}>
                      {cooldownTimer > 0 && actionType === 'B' ? cooldownTimer : '+'} 
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScore("B", "subtract")}
                      disabled={updatingScore || cooldownTimer > 0}
                    >
                      -
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {isUmpire && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant={isSubMatchReady ? "default" : "secondary"}
                    disabled={finalizing}
                  >
                    {t("matchExecution.finalizeSubMatch", "Finalize Sub-Match")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("matchExecution.finalizeConfirmTitle", "Finalize Sub-Match?")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("matchExecution.finalizeConfirmDesc", "Are you sure you want to finalize this sub-match? You won't be able to change the score afterwards.")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => finalizeSubMatch(subMatch.id, {
                        onSuccess: (data: any) => {
                          showToast.success(t("matchExecution.finalizeSubMatchSuccess", "Sub-match finalized successfully"));
                          if (data?.matchReadyToFinalize) {
                            onMatchReady();
                          }
                        },
                        onError: (err: any) => showApiError(err, t("matchExecution.finalizeSubMatchError", "Failed to finalize sub-match")),
                      })}
                      disabled={finalizing}
                    >
                      {finalizing ? t("common.finalizing", "Finalizing...") : t("common.finalize", "Finalize")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}

        {subMatch.status === "completed" && (
          <p className="text-green-600 font-semibold">{t("matchExecution.subMatchCompleted", "Sub-Match Completed")}</p>
        )}

        {completedSets.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <h4 className="text-sm font-semibold mb-2">{t("matchExecution.scoreHistory", "Score History")}</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {completedSets.map((s: any) => (
                <div key={s.id} className="flex flex-col items-center bg-muted px-3 py-1.5 rounded text-xs">
                  <span className="font-bold text-muted-foreground">{t("matchExecution.setNumber", "Set #")}{s.setNumber}</span>
                  <span className="font-black text-sm">{s.entryAScore} - {s.entryBScore}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
