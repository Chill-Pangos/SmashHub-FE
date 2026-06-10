import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import {
  useAthleteMatchHistory,
  useAthleteUpcomingMatches,
} from "@/hooks/queries/useMatchQueries";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import { useRejectedLineups } from "@/hooks/queries/useSubMatchPlayerQueries";
import MatchCenterLineupModal from "./MatchCenterLineupModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MatchCenter() {
  const navigate = useNavigate();
  const { data: userResp } = useCurrentUser();
  const userId = userResp?.id || 0;

  const { data: historyResp, isLoading: historyLoading } =
    useAthleteMatchHistory(userId, 1, 50);
  const { data: upcomingResp, isLoading: upcomingLoading } =
    useAthleteUpcomingMatches(userId, 1, 50);
  const { data: rejectedLineupsResp } = useRejectedLineups();

  const matchHistory = historyResp?.matches || [];
  const upcomingMatches = upcomingResp?.matches || [];
  const rejectedLineups = rejectedLineupsResp?.rejected || [];

  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            PLAYER PORTAL
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Competitive History
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Total Matches
            </span>
            <span className="text-2xl font-bold">{matchHistory.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Upcoming Matches */}
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming & Live Matches</h2>
          <div className="space-y-3">
            {upcomingLoading ? (
              <p>Loading...</p>
            ) : upcomingMatches.length > 0 ? (
              upcomingMatches.map((match: any) => {
                // Determine if this match has a rejected lineup
                const isRejected = rejectedLineups.some(
                  (rl: any) => rl.matchId === match.id
                );

                return (
                  <div
                    key={match.id}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-xl border border-border bg-card shadow-sm"
                  >
                    <div>
                      <span className="font-semibold">Match #{match.id}</span>
                      <div className="text-sm text-muted-foreground">
                        {match.scheduledStartTime
                          ? format(new Date(match.scheduledStartTime), "PPp")
                          : "TBD"}
                      </div>
                    </div>
                    <div>
                      <Badge>{match.status}</Badge>
                      {isRejected && (
                        <Badge variant="destructive" className="ml-2">
                          Lineup Rejected
                        </Badge>
                      )}
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedMatchId(match.id)}
                      >
                        {isRejected ? "Resubmit Lineup" : "Submit Lineup"}
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">No upcoming matches.</p>
            )}
          </div>
        </div>

        {/* Match History */}
        <div>
          <h2 className="text-xl font-bold mb-4">Match History</h2>
          <div className="space-y-3">
            {historyLoading ? (
              <p>Loading...</p>
            ) : matchHistory.length > 0 ? (
              matchHistory.map((match: any) => (
                <div
                  key={match.id}
                  className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-xl border border-border bg-card shadow-sm"
                >
                  <div className="flex flex-col w-48 shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      {match.actualStartTime
                        ? format(new Date(match.actualStartTime), "MMM d, yyyy")
                        : "Unknown Date"}
                    </span>
                    <span className="font-semibold text-foreground">
                      Match #{match.id}
                    </span>
                  </div>

                  <div className="flex flex-col items-center w-24 shrink-0">
                    <span className="text-xl font-bold text-foreground">
                      {match.resultStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-10 shrink-0 ml-auto">
                    <div
                      onClick={() => navigate(`/elo/history`)}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors cursor-pointer"
                      title="View Elo Details"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No match history.</p>
            )}
          </div>
        </div>
      </div>

      {selectedMatchId && (
        <MatchCenterLineupModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </div>
  );
}
