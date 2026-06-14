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
  matches: KnockoutMatch[];
}
import { useTranslation } from "react-i18next";

export function ChampionshipBracket({ matches }: ChampionshipBracketProps) {
  const { t } = useTranslation();
  const quarterFinals = matches.filter((m) => m.round === "Quarter-Finals");
  const semiFinals = matches.filter((m) => m.round === "Semi-Finals");

  return (
    <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto">
      <div className="flex gap-12 min-w-[800px]">
        <div className="flex-1 space-y-8">
          <h4 className="text-sm font-bold text-muted-foreground mb-6 text-center">{t('tournamentManager.scheduleTab.quarterFinals', 'Quarter-Finals')}</h4>
          {quarterFinals.map((match, idx) => (
            <MatchCard key={idx} match={match} />
          ))}
        </div>

        <div className="flex-1 space-y-8 flex flex-col justify-around">
          <div>
            <h4 className="text-sm font-bold text-muted-foreground mb-6 text-center">{t('tournamentManager.scheduleTab.semiFinals', 'Semi-Finals')}</h4>
            {semiFinals.map((match, idx) => (
              <MatchCard key={idx} match={match} />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-8 flex flex-col justify-center">
          <div>
            <h4 className="text-sm font-bold text-chart-4 mb-6 text-center">{t('tournamentManager.scheduleTab.grandFinal', 'Grand Final')}</h4>
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
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: KnockoutMatch }) {
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
            {match.status}
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