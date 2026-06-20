import { useState, useEffect } from "react";
import { Filter, CheckCircle, X } from "lucide-react";
import { usePendingMatches, useApproveMatch, useRejectMatch } from "@/hooks/queries";
import type { Match } from "@/types";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";
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
export default function MatchResultsReviewTab() {
  const { t } = useTranslation();
  const { data: pendingData, isLoading } = usePendingMatches(1, 100);
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

  const p1Name = selectedMatch.entryA?.team?.name || "Player A";
  const p2Name = selectedMatch.entryB?.team?.name || "Player B";
  const setsWonA = selectedMatch.setsWonA || 0;
  const setsWonB = selectedMatch.setsWonB || 0;
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
            {t("referee.matchResultsReview.matchId", "Match ID:")} #{selectedMatch.id}
          </span>
          {/* Missing true duration from API, stubbing it */}
          <p className="text-xs text-muted-foreground font-semibold mt-2">{t("referee.matchResultsReview.duration", "Duration:")} {t("referee.matchResultsReview.na", "N/A")}</p>
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
        {/* INCOMPLETE MAPPING: We need to map selectedMatch.matchSets when available. Currently stubbed visual. */}
        <p className="text-sm text-muted-foreground">{t("referee.matchResultsReview.setPointsUnmapped", "Detailed set points are not yet mapped from API.")}</p>
      </div>

      <h3 className="font-bold text-sm mb-3 flex items-center gap-2 shrink-0">
        {t("referee.matchResultsReview.eloImpactPreview", "ELO Impact Preview")}
      </h3>
      {/* INCOMPLETE MAPPING: We need usePendingMatchWithElo here to get real Elo Impact */}
      <div className="flex gap-4 mb-8 shrink-0">
        <p className="text-sm text-muted-foreground">{t("referee.matchResultsReview.eloPreviewUnmapped", "Elo preview not mapped yet.")}</p>
      </div>

      <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-border shrink-0">
        <button onClick={() => setIsRejectOpen(true)} disabled={rejectMatchMutation.isPending} className="px-6 py-2 rounded-md font-semibold text-destructive border border-destructive/50 hover:bg-destructive/10 transition-colors disabled:opacity-50">
          {t("referee.matchResultsReview.reject", "Reject")}
        </button>
        <button onClick={handleApprove} disabled={approveMatchMutation.isPending} className="px-8 py-2 rounded-md font-semibold bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2 shadow-[var(--auth-primary-glow)] disabled:opacity-50">
          <CheckCircle className="w-4 h-4" /> {t("referee.matchResultsReview.approve", "Approve")}
        </button>
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
          {pendingMatches.map((match) => {
             const mP1 = match.entryA?.team?.name || "Player A";
             const mP2 = match.entryB?.team?.name || "Player B";
             const mScore = `${match.setsWonA || 0} - ${match.setsWonB || 0}`;
             const mTime = match.schedule?.scheduledAt ? new Date(match.schedule.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : t("referee.matchResultsReview.na", "N/A");
             const mCourt = match.schedule?.tableNumber ? `Court ${match.schedule.tableNumber}` : t("referee.matchResultsReview.tbd", "TBD");
             return (
            <div
              key={match.id}
              onClick={() => {
                setSelectedMatch(match);
                setIsDetailOpen(true);
              }}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 flex justify-between items-center ${selectedMatch.id === match.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/50"}`}
            >
              <div className="flex gap-4">
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-muted-foreground font-bold">{t("referee.matchResultsReview.id", "ID")}</span>
                  <span className="text-sm font-bold text-primary">#{match.id}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {mP1} <span className="text-muted-foreground mx-1">⚔</span> {mP2}
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
          )})}
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