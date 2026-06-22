import { useState, useEffect } from "react";
import { Filter, CheckCircle, X, Swords } from "lucide-react";
import { usePendingMatches, useApproveMatch, useRejectMatch, useMatch } from "@/hooks/queries";
import type { Match, SubMatch, MatchSet, Entry, EntryMember } from "@/types";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const getEntryDisplayName = (entry: Entry | undefined | null | any, type: string | undefined) => {
  if (!entry) return "Unknown";
  
  if (type === "single") {
    if (entry.members && entry.members.length > 0) {
      const user = entry.members[0].user;
      if (user) {
        return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || entry.name;
      }
    }
    return entry.name || entry.team?.name || `Entry ${entry.id}`;
  } else {
    let memberNames = "";
    if (entry.members && entry.members.length > 0) {
      memberNames = " (" + entry.members.map((m: EntryMember) => {
        const u = m.user;
        return u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username : "";
      }).filter(Boolean).join(", ") + ")";
    }
    return `${entry.name || entry.team?.name || `Entry ${entry.id}`}${memberNames}`;
  }
};

export default function MatchResultsReviewTab() {
  const { t } = useTranslation();
  const { tournamentId } = useParams();
  
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<string>("10");

  const { data: pendingData, isLoading } = usePendingMatches(Number(tournamentId), page, Number(limit));
  const pendingMatches = pendingData?.matches || [];

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  useEffect(() => {
    if (pendingMatches.length > 0 && !selectedMatch) {
      setSelectedMatch(pendingMatches[0]);
    } else if (pendingMatches.length === 0) {
      setSelectedMatch(null);
    }
  }, [pendingMatches, selectedMatch]);

  const { data: fullSelectedMatch } = useMatch(selectedMatch?.id || 0, {
    enabled: !!selectedMatch?.id
  });

  const approveMatchMutation = useApproveMatch();
  const rejectMatchMutation = useRejectMatch();

  const handleApprove = () => {
    if (selectedMatch) {
      approveMatchMutation.mutate({ id: selectedMatch.id }, {
        onSuccess: () => showToast.success(t("referee.matchResultsReview.approveSuccess", "Match approved successfully")),
        onError: (err: any) => showApiError(err, t("referee.matchResultsReview.approveError", "Failed to approve match")),
      });
    }
  };

  const handleReject = () => {
    if (selectedMatch) {
      rejectMatchMutation.mutate({ id: selectedMatch.id, data: { reviewNotes: "Rejected by Chief Referee" } }, {
        onSuccess: () => {
          setIsRejectOpen(false);
          showToast.success(t("referee.matchResultsReview.rejectSuccess", "Match rejected successfully"));
        },
        onError: (err: any) => showApiError(err, t("referee.matchResultsReview.rejectError", "Failed to reject match")),
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">{t("referee.matchResultsReview.loading", "Loading pending matches...")}</div>;
  }

  if (pendingMatches.length === 0 || !selectedMatch) {
    return <div className="p-4 text-muted-foreground">{t("referee.matchResultsReview.noMatches", "No pending matches to review.")}</div>;
  }

  const currentMatch = fullSelectedMatch || selectedMatch;
  const categoryType = currentMatch.schedule?.tournamentContent?.type;

  const p1Name = getEntryDisplayName(currentMatch.entryA, categoryType);
  const p2Name = getEntryDisplayName(currentMatch.entryB, categoryType);
  let setsWonA = currentMatch.setsWonA || 0;
  let setsWonB = currentMatch.setsWonB || 0;
  
  if (!currentMatch.setsWonA && !currentMatch.setsWonB && currentMatch.subMatches) {
    if (currentMatch.subMatches.length === 1) {
      const sm = currentMatch.subMatches[0];
      sm.matchSets?.forEach((set: MatchSet) => {
        if (set.entryAScore > set.entryBScore) setsWonA++;
        else if (set.entryBScore > set.entryAScore) setsWonB++;
      });
    } else {
      currentMatch.subMatches.forEach((sm: SubMatch) => {
        if (sm.winnerTeam === "A") setsWonA++;
        else if (sm.winnerTeam === "B") setsWonB++;
      });
    }
  }

  const scoreStr = `${setsWonA} - ${setsWonB}`;
  
  const p1Wins = setsWonA > setsWonB;
  const p2Wins = setsWonB > setsWonA;

  const detailContent = (
    <>
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-foreground">
            {t("referee.matchResultsReview.matchDetails", "Match Details")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("referee.matchResultsReview.reviewDesc", "Review completed match before finalizing verification.")}
          </p>
        </div>
        <div className="text-right">
          <span className="bg-chart-4/20 text-chart-4 text-xs font-bold px-3 py-1 rounded-full block mb-1">
            {t("referee.matchResultsReview.matchId", "Match ID:")} #{currentMatch.id}
          </span>
          <p className="text-xs text-muted-foreground font-semibold mt-2">
            {t("matchExecution.scheduledAt", "Scheduled:")}{" "}
            {currentMatch.schedule?.scheduledAt ? new Date(currentMatch.schedule.scheduledAt).toLocaleString() : t("referee.matchResultsReview.na", "N/A")}
          </p>
          {currentMatch.matchReferees && currentMatch.matchReferees.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground text-right">
              <p className="font-semibold">{t("referee.matchResultsReview.referees", "Referees:")}</p>
              {currentMatch.matchReferees.map((mr) => (
                <div key={mr.id}>{mr.referee?.firstName} {mr.referee?.lastName}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Avatar & Score */}
      <div className="bg-background rounded-xl p-6 border border-border mb-6 flex justify-between items-center shrink-0">
        <div className={`flex flex-col items-center w-1/3 ${p2Wins ? 'opacity-50' : ''}`}>
          <div className={`w-16 h-16 rounded-full bg-secondary mb-2 ${p1Wins ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}></div>
          <p className="font-bold">{p1Name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {p1Wins && <span className="text-[10px] text-primary font-bold uppercase">{t("referee.matchResultsReview.winner", "Winner")}</span>}
          </div>
        </div>
        
        <div className="text-5xl font-black font-mono w-1/3 text-center">
          {scoreStr}
        </div>

        <div className={`flex flex-col items-center w-1/3 ${p1Wins ? 'opacity-50' : ''}`}>
          <div className={`w-16 h-16 rounded-full bg-secondary mb-2 ${p2Wins ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}></div>
          <p className="font-bold">{p2Name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {p2Wins && <span className="text-[10px] text-primary font-bold uppercase">{t("referee.matchResultsReview.winner", "Winner")}</span>}
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 mb-6 shrink-0">
        <h3 className="font-bold flex items-center gap-2 mb-6">
          {t("referee.matchResultsReview.setBreakdown", "Set Breakdown")}
        </h3>
        {currentMatch.subMatches && currentMatch.subMatches.length === 1 ? (
          <div className="flex flex-col gap-3">
            {currentMatch.subMatches[0].matchSets?.map((set: MatchSet) => (
              <div key={set.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-secondary/20">
                <span className="text-sm font-semibold text-muted-foreground w-12">{t("matchExecution.setNum", "Set {{num}}").replace("{{num}}", set.setNumber.toString())}</span>
                <div className="flex gap-4 items-center">
                  <span className={`text-lg font-black ${set.entryAScore > set.entryBScore ? "text-primary" : "text-muted-foreground"}`}>{set.entryAScore}</span>
                  <span className="text-sm text-muted-foreground">-</span>
                  <span className={`text-lg font-black ${set.entryBScore > set.entryAScore ? "text-primary" : "text-muted-foreground"}`}>{set.entryBScore}</span>
                </div>
              </div>
            ))}
          </div>
        ) : currentMatch.subMatches && currentMatch.subMatches.length > 1 ? (
          <div className="flex flex-col gap-3">
            {currentMatch.subMatches.map((sm: SubMatch) => (
              <div key={sm.id} className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-secondary/20">
                <span className="text-sm font-semibold">{t("matchExecution.subMatchNum", "Sub-Match {{num}}").replace("{{num}}", sm.subMatchNumber?.toString() || "")}</span>
                <div className="flex gap-2 flex-wrap">
                  {sm.matchSets?.map((set: MatchSet) => (
                    <div key={set.id} className="px-3 py-1 bg-background rounded-md text-xs font-bold border border-border">
                      {set.entryAScore} - {set.entryBScore}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("referee.matchResultsReview.setPointsUnmapped", "Detailed set points are not yet mapped from API.")}</p>
        )}
      </div>

      <h3 className="font-bold text-sm mb-3 flex items-center gap-2 shrink-0">
        {t("referee.matchResultsReview.eloImpactPreview", "ELO Impact Preview")}
      </h3>
      {/* INCOMPLETE MAPPING: We need usePendingMatchWithElo here to get real Elo Impact */}
      <div className="flex gap-4 mb-8 shrink-0">
        <p className="text-sm text-muted-foreground">{t("referee.matchResultsReview.eloPreviewUnmapped", "Elo preview not mapped yet.")}</p>
      </div>

      <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-border shrink-0">
        <Button onClick={() => setIsRejectOpen(true)} disabled={rejectMatchMutation.isPending} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white px-6">
          {t("referee.matchResultsReview.reject", "Reject")}
        </Button>
        <Button onClick={handleApprove} disabled={approveMatchMutation.isPending} className="shadow-[var(--auth-primary-glow)] px-8">
          <CheckCircle className="w-4 h-4 mr-2" /> {t("referee.matchResultsReview.approve", "Approve")}
        </Button>
      </div>

      <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("referee.matchResultsReview.rejectTitle", "Reject Match Result?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("referee.matchResultsReview.rejectDesc", "Are you sure you want to reject this match result? This action cannot be undone.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectMatchMutation.isPending}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={rejectMatchMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectMatchMutation.isPending ? t("common.rejecting", "Rejecting...") : t("common.reject", "Reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] lg:overflow-hidden">
      {/* Left Sidebar: List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">
            {t("referee.matchResultsReview.pendingVerification", "Pending Verification")}
          </h2>
          <div className="flex gap-2">
            <button className="bg-secondary p-1.5 rounded">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-10">
          {pendingMatches.map((match) => (
            <MatchListItem 
              key={match.id} 
              match={match} 
              selectedMatch={selectedMatch} 
              setSelectedMatch={setSelectedMatch} 
              setIsDetailOpen={setIsDetailOpen} 
            />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-auto pt-2 px-2 border-t border-border shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled={!pendingData?.pagination?.hasPrevPage} onClick={() => setPage(p => Math.max(1, p - 1))}>
              {t("common.prev", "Prev")}
            </Button>
            <span className="text-sm font-semibold">
              {pendingData?.pagination ? `${pendingData.pagination.page} / ${pendingData.pagination.totalPages}` : page}
            </span>
            <Button variant="secondary" size="sm" disabled={!pendingData?.pagination?.hasNextPage} onClick={() => setPage(p => p + 1)}>
              {t("common.next", "Next")}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={limit} onValueChange={(val) => { setLimit(val); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-8 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right Area: Detail & Actions */}
      <div className="hidden lg:flex w-2/3 bg-card border border-border rounded-xl p-6 flex-col h-full overflow-y-auto">
        {detailContent}
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity ${isDetailOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsDetailOpen(false)}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] bg-card border-t border-border rounded-t-2xl overflow-y-auto transition-transform duration-300 ${isDetailOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between sticky top-0 bg-card p-4 z-30 border-b border-border mb-4">
            <p className="text-sm font-bold text-foreground">{t("referee.matchResultsReview.matchDetail", "Match Detail")}</p>
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              className="p-2 rounded-md hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 pt-0">
            {detailContent}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchListItem({ match, selectedMatch, setSelectedMatch, setIsDetailOpen }: { match: Match; selectedMatch: Match | null; setSelectedMatch: (m: Match) => void; setIsDetailOpen: (open: boolean) => void; }) {
  const { t } = useTranslation();
  const { data: fullMatch } = useMatch(match.id, { enabled: !!match.id });
  const displayMatch = fullMatch || match;
  const categoryType = displayMatch.schedule?.tournamentContent?.type;

  const mP1 = getEntryDisplayName(displayMatch.entryA, categoryType) || `Entry ${displayMatch.entryAId || "A"}`;
  const mP2 = getEntryDisplayName(displayMatch.entryB, categoryType) || `Entry ${displayMatch.entryBId || "B"}`;
  
  let mSetsA = displayMatch.setsWonA || 0;
  let mSetsB = displayMatch.setsWonB || 0;
  if (!displayMatch.setsWonA && !displayMatch.setsWonB && displayMatch.subMatches) {
    if (displayMatch.subMatches.length === 1) {
      displayMatch.subMatches[0].matchSets?.forEach((s: MatchSet) => {
        if (s.entryAScore > s.entryBScore) mSetsA++;
        else if (s.entryBScore > s.entryAScore) mSetsB++;
      });
    } else {
      displayMatch.subMatches.forEach((sm: SubMatch) => {
        if (sm.winnerTeam === "A") mSetsA++;
        else if (sm.winnerTeam === "B") mSetsB++;
      });
    }
  }
  const mScore = `${mSetsA} - ${mSetsB}`;
  const mTime = displayMatch.schedule?.scheduledAt ? new Date(displayMatch.schedule.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : t("referee.matchResultsReview.na", "N/A");
  const mCourt = displayMatch.schedule?.tableNumber ? `Court ${displayMatch.schedule.tableNumber}` : t("referee.matchResultsReview.tbd", "TBD");

  return (
    <div
      onClick={() => {
        setSelectedMatch(match);
        setIsDetailOpen(true);
      }}
      className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 flex justify-between items-center ${selectedMatch?.id === match.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/50"}`}
    >
      <div className="flex gap-4">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-muted-foreground font-bold">{t("referee.matchResultsReview.id", "ID")}</span>
          <span className="text-sm font-bold text-primary">#{match.id}</span>
        </div>
        <div>
          <p className="font-semibold text-sm flex items-center gap-1.5">
            <span className="truncate max-w-[120px]" title={mP1}>{mP1}</span>
            <Swords className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[120px]" title={mP2}>{mP2}</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${match.status === "completed" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}
            >
              {match.status}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {mCourt} • {mTime}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-black">{mScore}</p>
        <p className="text-[10px] text-muted-foreground">{t("referee.matchResultsReview.finalScore", "Final Score")}</p>
      </div>
    </div>
  );
}