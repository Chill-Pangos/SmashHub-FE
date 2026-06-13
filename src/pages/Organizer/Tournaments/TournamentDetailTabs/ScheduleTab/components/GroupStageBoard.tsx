export interface Standing {
  rank: number;
  player: string;
  p: number;
  w: number;
  l: number;
  pts: number;
}

export interface GroupMatch {
  time: string;
  playerA: string;
  playerB: string;
  status: string;
  scoreA: number | null;
  scoreB: number | null;
}

export interface Group {
  name: string;
  standings: Standing[];
  matches: GroupMatch[];
}

interface GroupStageBoardProps {
  group: Group;
}
import { useTranslation } from "react-i18next";

export function GroupStageBoard({ group }: GroupStageBoardProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-primary mb-6">{group.name}</h3>

      {/* Standings Table */}
      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="text-muted-foreground border-b border-border text-left">
            <th className="pb-3 font-semibold w-8">{t('tournamentManager.scheduleTab.rank', 'Rk')}</th>
            <th className="pb-3 font-semibold">{t('tournamentManager.scheduleTab.player', 'Player')}</th>
            <th className="pb-3 font-semibold text-center w-8">{t('tournamentManager.scheduleTab.played', 'P')}</th>
            <th className="pb-3 font-semibold text-center w-8">{t('tournamentManager.scheduleTab.won', 'W')}</th>
            <th className="pb-3 font-semibold text-center w-8">{t('tournamentManager.scheduleTab.lost', 'L')}</th>
            <th className="pb-3 font-semibold text-center w-8">{t('tournamentManager.scheduleTab.points', 'Pts')}</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((row) => (
            <tr key={row.rank} className="border-b border-border/50 last:border-0">
              <td className={`py-3 font-bold ${row.rank <= 2 ? "text-primary" : "text-muted-foreground"}`}>
                {row.rank}
              </td>
              <td className="py-3 font-medium text-foreground flex items-center gap-2">
                {row.player}
                {row.rank <= 2 && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-auth-primary-glow" />}
              </td>
              <td className="py-3 text-center text-muted-foreground">{row.p}</td>
              <td className="py-3 text-center text-muted-foreground">{row.w}</td>
              <td className="py-3 text-center text-muted-foreground">{row.l}</td>
              <td className="py-3 text-center font-bold text-primary">{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Matches List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          {t('tournamentManager.scheduleTab.matches', '{{groupName}} Matches').replace('{{groupName}}', group.name)}
        </h4>
        {group.matches.map((match, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-4 w-[60%]">
              <span className="text-muted-foreground font-mono text-xs w-10">{match.time}</span>
              <span className="font-medium text-foreground truncate">
                {match.playerA} <span className="text-muted-foreground mx-1">vs</span> {match.playerB}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground tracking-wider uppercase">
                {match.status}
              </span>
              <span className="font-bold text-primary w-8 text-right tracking-widest">
                {match.scoreA}-{match.scoreB}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}