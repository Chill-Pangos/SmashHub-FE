import MatchResultsReviewTab from "./TournamentDetail/TournamentDetailTabs/MatchResultsReviewTab";

export default function PendingMatchesGlobal() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            CHIEF REFEREE PORTAL
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Pending Verification
          </h1>
        </div>
      </div>
      <MatchResultsReviewTab />
    </div>
  );
}
