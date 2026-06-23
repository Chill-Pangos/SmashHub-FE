import { useState } from "react";
import { format } from "date-fns";
import { Clock, Hash, Users, Trophy, Calendar } from "lucide-react";
import { MatchDetailModal } from "@/components/custom/MatchDetailModal";
import { useTranslation } from "react-i18next";
import { useMatch } from "@/hooks/queries/useMatchQueries";

interface MatchListViewProps {
  schedules: any[];
}

export default function MatchListView({ schedules }: MatchListViewProps) {
  const { t } = useTranslation();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-card/50">
        <Calendar className="w-8 h-8 mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">{t("publicPlayer.tournamentDetail.scheduleTab.noMatches", "No matches found.")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {schedules.map((schedule) => {
        const match = schedule.scheduledMatches?.[0];
        if (!match) return null;
        return (
          <MatchListCard 
            key={schedule.id} 
            schedule={schedule} 
            match={match} 
            onClick={() => setSelectedMatchId(match.id)} 
          />
        );
      })}
      
      <MatchDetailModal 
        matchId={selectedMatchId} 
        onClose={() => setSelectedMatchId(null)} 
      />
    </div>
  );
}

function MatchListCard({ schedule, match, onClick }: { schedule: any, match: any, onClick: () => void }) {
  const { t } = useTranslation();
  const entryA = match.entryA?.name || "TBD";
  const entryB = match.entryB?.name || "TBD";
  const isCompleted = match.status === "completed";
  const isInProgress = match.status === "in_progress";
  const timeFormatted = schedule.scheduledAt 
      ? format(new Date(schedule.scheduledAt), "MMM dd, yyyy - HH:mm") 
      : "TBD";

  let badgeClass = "bg-secondary text-secondary-foreground";
  if (isCompleted) badgeClass = "bg-primary/20 text-primary";
  if (isInProgress) badgeClass = "bg-chart-2/20 text-chart-2";

  const { data: matchDetail } = useMatch(match.id, { 
    enabled: isCompleted || isInProgress
  });

  let finalScoreA: number | string = match.setsWonA ?? "-";
  let finalScoreB: number | string = match.setsWonB ?? "-";

  if (matchDetail && matchDetail.subMatches) {
    const isTeam = (matchDetail.schedule as any)?.tournamentCategory?.type === 'team';
    if (isTeam) {
      finalScoreA = matchDetail.subMatches.filter((sm: any) => sm.winnerTeam === 'A').length || 0;
      finalScoreB = matchDetail.subMatches.filter((sm: any) => sm.winnerTeam === 'B').length || 0;
    } else {
      const mainSubMatch = matchDetail.subMatches[0];
      if (mainSubMatch && mainSubMatch.matchSets) {
        let a = 0;
        let b = 0;
        mainSubMatch.matchSets.forEach((set: any) => {
          if (set.entryAScore > set.entryBScore) a++;
          else if (set.entryBScore > set.entryAScore) b++;
        });
        finalScoreA = a;
        finalScoreB = b;
      }
    }
  }

  return (
          <div 
            className="flex flex-col p-5 border shadow-sm rounded-xl border-border bg-card hover:border-primary/50 transition-colors cursor-pointer"
            onClick={onClick}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeClass}`}>
                {t(`constants.status.match.${match.status}`, match.status) as string}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                <Hash className="w-3.5 h-3.5" />
                <span>Table {schedule.tableNumber || "TBD"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
              <span className="capitalize">{schedule.stage}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{schedule.groupName || schedule.knockoutRound || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between flex-1 p-4 mb-4 border rounded-lg bg-secondary/20 border-border/50">
              <div className="flex flex-col items-center flex-1 text-center">
                <div className={`flex items-center justify-center w-10 h-10 mb-2 rounded-full ${match.winnerEntryId === match.entryAId ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/10 text-primary'}`}>
                  {match.winnerEntryId === match.entryAId ? <Trophy className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <span className={`font-semibold line-clamp-2 ${match.winnerEntryId === match.entryAId ? 'text-yellow-500' : 'text-foreground'}`}>
                  {entryA}
                </span>
                {(match.status === "completed" || match.status === "in_progress") && finalScoreA !== "-" && (
                  <span className="mt-1 text-2xl font-black text-foreground">{finalScoreA}</span>
                )}
              </div>
              
              <div className="px-4 text-xs font-bold text-muted-foreground/50">VS</div>
              
              <div className="flex flex-col items-center flex-1 text-center">
                <div className={`flex items-center justify-center w-10 h-10 mb-2 rounded-full ${match.winnerEntryId === match.entryBId ? 'bg-yellow-500/20 text-yellow-500' : 'bg-chart-3/10 text-chart-3'}`}>
                  {match.winnerEntryId === match.entryBId ? <Trophy className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <span className={`font-semibold line-clamp-2 ${match.winnerEntryId === match.entryBId ? 'text-yellow-500' : 'text-foreground'}`}>
                  {entryB}
                </span>
                {(match.status === "completed" || match.status === "in_progress") && finalScoreB !== "-" && (
                  <span className="mt-1 text-2xl font-black text-foreground">{finalScoreB}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 mt-auto text-xs font-medium border-t text-muted-foreground border-border/50">
              <Clock className="w-3.5 h-3.5 text-primary/70" />
              <span>{timeFormatted}</span>
            </div>
          </div>
  );
}
