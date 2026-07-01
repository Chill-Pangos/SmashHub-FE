export interface KnockoutMatch {
  round: string;
  time: string;
  status: string;
  playerA: string;
  scoreA: number | null;
  playerB: string;
  scoreB: number | null;
  isLive?: boolean;
}

interface ChampionshipBracketProps {
  matches?: KnockoutMatch[];
  rounds?: any[];
  onEntryClick?: (entryId: number) => void;
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MatchDetailModal } from "@/components/custom/MatchDetailModal";
import { useMatch } from "@/hooks/queries/useMatchQueries";
import { useDateFormat } from "@/hooks/useDateFormat";

export function ChampionshipBracket({ matches, rounds, onEntryClick }: ChampionshipBracketProps) {
  const { t } = useTranslation();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  if (rounds && rounds.length > 0) {
    const isFinalOnly = rounds.length === 1;
    const finalRound = rounds[rounds.length - 1];

    const leftRounds = isFinalOnly ? [] : rounds.slice(0, -1).map((r: any) => ({
      ...r,
      brackets: r.brackets.slice(0, Math.ceil(r.brackets.length / 2))
    }));

    const rightRounds = isFinalOnly ? [] : [...rounds].slice(0, -1).reverse().map((r: any) => ({
      ...r,
      brackets: r.brackets.slice(Math.ceil(r.brackets.length / 2))
    }));

    return (
      <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto">
        <div className="flex gap-12 min-w-[800px] justify-center">
          
          {/* Left Rounds */}
          {leftRounds.map((round: any) => (
            <div key={`left-${round.roundNumber}`} className="flex-1 space-y-8 flex flex-col justify-around relative">
              <div>
                <h4 className="text-sm font-bold mb-6 text-center text-muted-foreground">
                  {round.roundName}
                </h4>
                <div className="space-y-8">
                  {round.brackets?.map((bracket: any) => (
                    <div key={bracket.id} className="relative">
                      <BracketMatchCard 
                        bracket={bracket} 
                        onEntryClick={onEntryClick} 
                        onClick={() => setSelectedMatchId(bracket.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Center (Final Round) */}
          <div className="flex-1 space-y-8 flex flex-col justify-center min-w-[250px] relative z-10">
            <div>
              <div className="flex items-center justify-center mb-6">
                <h4 className="text-sm font-bold text-chart-4 uppercase tracking-widest px-4 py-1 bg-chart-4/10 rounded-full border border-chart-4/20 shadow-[0_0_15px_rgba(255,165,0,0.15)]">
                  {finalRound.roundName}
                </h4>
              </div>
              <div className="space-y-8">
                {finalRound.brackets?.map((bracket: any) => (
                  <BracketMatchCard 
                    key={bracket.id} 
                    bracket={bracket} 
                    onEntryClick={onEntryClick} 
                    onClick={() => setSelectedMatchId(bracket.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Rounds */}
          {rightRounds.map((round: any) => (
            <div key={`right-${round.roundNumber}`} className="flex-1 space-y-8 flex flex-col justify-around relative">
              <div>
                <h4 className="text-sm font-bold mb-6 text-center text-muted-foreground">
                  {round.roundName}
                </h4>
                <div className="space-y-8">
                  {round.brackets?.map((bracket: any) => (
                    <div key={bracket.id} className="relative">
                      <BracketMatchCard 
                        bracket={bracket} 
                        onEntryClick={onEntryClick} 
                        onClick={() => setSelectedMatchId(bracket.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>
        <MatchDetailModal matchId={selectedMatchId} onClose={() => setSelectedMatchId(null)} />
      </div>
    );
  }

  const quarterFinals = (matches || []).filter((m) => m.round === "Quarter-Finals");
  const semiFinals = (matches || []).filter((m) => m.round === "Semi-Finals");

  return (
    <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto">
      <div className="flex gap-12 min-w-[800px] justify-center">
        {/* Left Side: Quarter Final 1, 2 -> Semi Final 1 */}
        <div className="flex-1 space-y-8 flex flex-col justify-around">
          <div>
            <h4 className="text-sm font-bold text-muted-foreground mb-6 text-center">{t('tournamentManager.scheduleTab.quarterFinals', 'Quarter-Finals')}</h4>
            <div className="space-y-8">
              {quarterFinals.slice(0, 2).map((match, idx) => (
                <MatchCard key={idx} match={match} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 flex flex-col justify-around">
          <div>
            <h4 className="text-sm font-bold text-muted-foreground mb-6 text-center">{t('tournamentManager.scheduleTab.semiFinals', 'Semi-Finals')}</h4>
            <div className="space-y-8">
              {semiFinals.slice(0, 1).map((match, idx) => (
                <MatchCard key={idx} match={match} />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Grand Final */}
        <div className="flex-1 space-y-8 flex flex-col justify-center min-w-[250px] relative z-10">
          <div>
            <div className="flex items-center justify-center mb-6">
              <h4 className="text-sm font-bold text-chart-4 uppercase tracking-widest px-4 py-1 bg-chart-4/10 rounded-full border border-chart-4/20 shadow-[0_0_15px_rgba(255,165,0,0.15)]">
                {t('tournamentManager.scheduleTab.grandFinal', 'Grand Final')}
              </h4>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 relative opacity-50 border-dashed">
              <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span className="font-mono">TBD</span>
                <span className="font-bold uppercase">{t('tournamentManager.scheduleTab.upcoming', 'UPCOMING')}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{t('tournamentManager.scheduleTab.winnerSF1', 'Winner SF 1')}</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{t('tournamentManager.scheduleTab.winnerSF2', 'Winner SF 2')}</span>
                  <span>-</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Semi Final 2 <- Quarter Final 3, 4 */}
        <div className="flex-1 space-y-8 flex flex-col justify-around">
          <div>
            <h4 className="text-sm font-bold text-muted-foreground mb-6 text-center">{t('tournamentManager.scheduleTab.semiFinals', 'Semi-Finals')}</h4>
            <div className="space-y-8">
              {semiFinals.slice(1, 2).map((match, idx) => (
                <MatchCard key={idx} match={match} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 flex flex-col justify-around">
          <div>
            <h4 className="text-sm font-bold text-muted-foreground mb-6 text-center">{t('tournamentManager.scheduleTab.quarterFinals', 'Quarter-Finals')}</h4>
            <div className="space-y-8">
              {quarterFinals.slice(2, 4).map((match, idx) => (
                <MatchCard key={idx} match={match} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BracketMatchCard({ bracket, onEntryClick, onClick }: { bracket: any, onEntryClick?: (entryId: number) => void, onClick?: () => void }) {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  const isLive = bracket.status === "in_progress";
  
  const { data: matchDetail } = useMatch(bracket.id, { 
    enabled: bracket.status === 'completed' || bracket.status === 'in_progress'
  });

  const playerA = bracket.entryA?.entryName || t("match.details.tbd", "TBD");
  const playerB = bracket.entryB?.entryName || t("match.details.tbd", "TBD");
  
  let finalScoreA: number | string = bracket.setsWonA ?? "-";
  let finalScoreB: number | string = bracket.setsWonB ?? "-";

  const showPoints = bracket.status === 'in_progress' || (bracket.status === 'completed' && bracket.resultStatus === 'approved');

  if (showPoints && matchDetail && matchDetail.subMatches) {
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
  } else if (!showPoints) {
    finalScoreA = "-";
    finalScoreB = "-";
  }

  const winnerA = bracket.winnerEntryId && bracket.winnerEntryId === bracket.entryA?.entryId;
  const winnerB = bracket.winnerEntryId && bracket.winnerEntryId === bracket.entryB?.entryId;

  return (
    <div 
      className={`bg-background border border-border rounded-lg p-3 relative overflow-hidden transition-all cursor-pointer hover:border-primary/50
      ${isLive ? 'border-primary shadow-[0_0_15px_rgba(0,242,255,0.1)]' : ''}`}
      onClick={onClick}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isLive || bracket.status === "completed" ? 'bg-primary' : 'bg-muted'}`} />
      
      <div className="pl-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
          <span className="font-mono">{bracket.scheduledAt ? formatDateTime(bracket.scheduledAt) : t("match.details.tbd", "TBD")}</span>
          <span className={`font-bold uppercase tracking-wider text-[10px] 
            ${isLive ? 'text-destructive bg-destructive/10 px-2 py-0.5 rounded' : 
              bracket.status === 'completed' ? 'text-primary bg-primary/10 px-2 py-0.5 rounded' : ''}`}
          >
            {t(`constants.status.match.${bracket.status}`, bracket.status) as string}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span 
              className={`font-medium ${winnerA ? 'text-foreground' : 'text-muted-foreground'} ${bracket.entryA?.entryId ? 'cursor-pointer hover:underline hover:text-primary transition-colors' : ''}`}
              onClick={() => bracket.entryA?.entryId && onEntryClick?.(bracket.entryA.entryId)}
            >
              {playerA}
            </span>
            <span className={`font-bold ${winnerA ? 'text-primary' : 'text-foreground'}`}>
              {finalScoreA}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span 
              className={`font-medium ${winnerB ? 'text-foreground' : 'text-muted-foreground'} ${bracket.entryB?.entryId ? 'cursor-pointer hover:underline hover:text-primary transition-colors' : ''}`}
              onClick={() => bracket.entryB?.entryId && onEntryClick?.(bracket.entryB.entryId)}
            >
              {playerB}
            </span>
            <span className={`font-bold ${winnerB ? 'text-primary' : 'text-foreground'}`}>
              {finalScoreB}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: KnockoutMatch }) {
  const { t } = useTranslation();
  const isLive = match.status === "LIVE";
  
  return (
    <div className={`bg-background border border-border rounded-lg p-3 relative overflow-hidden transition-all
      ${isLive ? 'border-primary shadow-[0_0_15px_rgba(0,242,255,0.1)]' : ''}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isLive || match.status === "COMPLETED" ? 'bg-primary' : 'bg-muted'}`} />
      
      <div className="pl-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
          <span className="font-mono">{match.time}</span>
          <span className={`font-bold uppercase tracking-wider text-[10px] 
            ${isLive ? 'text-destructive bg-destructive/10 px-2 py-0.5 rounded' : 
              match.status === 'COMPLETED' ? 'text-primary bg-primary/10 px-2 py-0.5 rounded' : ''}`}
          >
            {t(`constants.status.match.${match.status}`, match.status) as string}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className={`font-medium ${match.scoreA !== null && match.scoreB !== null && match.scoreA > match.scoreB ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span className="text-xs text-muted-foreground mr-2 font-mono">1</span>
              {match.playerA}
            </span>
            <span className={`font-bold ${match.scoreA !== null && match.scoreB !== null && match.scoreA > match.scoreB ? 'text-primary' : 'text-foreground'}`}>
              {match.scoreA ?? '-'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className={`font-medium ${match.scoreB !== null && match.scoreA !== null && match.scoreB > match.scoreA ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span className="text-xs text-muted-foreground mr-2 font-mono">8</span>
              {match.playerB}
            </span>
            <span className={`font-bold ${match.scoreB !== null && match.scoreA !== null && match.scoreB > match.scoreA ? 'text-primary' : 'text-foreground'}`}>
              {match.scoreB ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}