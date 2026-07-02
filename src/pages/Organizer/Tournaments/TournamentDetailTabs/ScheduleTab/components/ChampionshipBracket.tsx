import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MatchDetailModal } from "@/components/custom/MatchDetailModal";
import { useMatch } from "@/hooks/queries/useMatchQueries";
import { useDateFormat } from "@/hooks/useDateFormat";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface TreeNode {
  match: any;
  children: TreeNode[];
}

function buildSubTree(match: any, roundIndex: number, rounds: any[]): TreeNode {
  const node: TreeNode = { match, children: [] };
  if (roundIndex > 0) {
    const prevRound = rounds[roundIndex - 1];
    const matchIndex = rounds[roundIndex].brackets.findIndex((m: any) => m.id === match.id);
    if (matchIndex !== -1) {
      const c1 = prevRound.brackets[matchIndex * 2];
      const c2 = prevRound.brackets[matchIndex * 2 + 1];
      if (c1) node.children.push(buildSubTree(c1, roundIndex - 1, rounds));
      if (c2) node.children.push(buildSubTree(c2, roundIndex - 1, rounds));
    }
  }
  return node;
}

const BracketTree = ({ 
  node, side, isRoot, onEntryClick, onClickMatch 
}: { 
  node: TreeNode, side: "left" | "right", isRoot?: boolean, onEntryClick?: (id: number) => void, onClickMatch: (id: number) => void 
}) => {
  const isLeft = side === "left";
  
  return (
    <div className={`flex items-center gap-12 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col gap-6 relative">
          {node.children.map((child, idx) => {
            const isTop = idx === 0;
            return (
              <div key={child.match.id} className="relative flex items-center">
                <BracketTree node={child} side={side} onEntryClick={onEntryClick} onClickMatch={onClickMatch} />
                {isTop && node.children.length === 2 && (
                  <div className={`absolute ${isLeft ? "-right-6" : "-left-6"} top-1/2 h-[calc(100%+24px)] w-[2px] bg-border z-0`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative flex flex-col justify-center z-10 shrink-0">
        {node.children && node.children.length > 0 && (
          <div className={`absolute top-1/2 ${isLeft ? "-left-6" : "-right-6"} w-6 h-[2px] bg-border`} />
        )}
        {!isRoot && (
          <div className={`absolute top-1/2 ${isLeft ? "-right-6" : "-left-6"} w-6 h-[2px] bg-border`} />
        )}
        
        <BracketMatchCard bracket={node.match} onEntryClick={onEntryClick} onClick={() => onClickMatch(node.match.id)} />
      </div>
    </div>
  );
};

export function ChampionshipBracket({ matches, rounds, onEntryClick }: ChampionshipBracketProps) {
  const { t } = useTranslation();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const getRoundNameTranslation = (roundName: string) => {
    switch (roundName) {
      case "Round of 128": return t('tournamentManager.scheduleTab.rounds.roundOf128', "Round of 128");
      case "Round of 64": return t('tournamentManager.scheduleTab.rounds.roundOf64', "Round of 64");
      case "Round of 32": return t('tournamentManager.scheduleTab.rounds.roundOf32', "Round of 32");
      case "Round of 16": return t('tournamentManager.scheduleTab.rounds.roundOf16', "Round of 16");
      case "Quarter-final": return t('tournamentManager.scheduleTab.rounds.quarterFinal', "Quarter-final");
      case "Semi-final": return t('tournamentManager.scheduleTab.rounds.semiFinal', "Semi-final");
      case "Final": return t('tournamentManager.scheduleTab.rounds.final', "Final");
      default: return roundName;
    }
  };

  const renderContent = () => {
    if (rounds && rounds.length > 0) {
      const finalRoundIndex = rounds.length - 1;
      const finalRound = rounds[finalRoundIndex];
      const finalMatch = finalRound.brackets[0];
  
      let leftRoot = null;
      let rightRoot = null;
  
      if (finalRoundIndex > 0) {
        const semiRound = rounds[finalRoundIndex - 1];
        if (semiRound.brackets.length >= 1) {
          leftRoot = buildSubTree(semiRound.brackets[0], finalRoundIndex - 1, rounds);
        }
        if (semiRound.brackets.length >= 2) {
          rightRoot = buildSubTree(semiRound.brackets[1], finalRoundIndex - 1, rounds);
        }
      }
  
      const leftRounds = finalRoundIndex > 0 ? rounds.slice(0, finalRoundIndex) : [];
      const rightRounds = finalRoundIndex > 0 ? [...rounds].slice(0, finalRoundIndex).reverse() : [];
  
      return (
        <div className="flex flex-col items-center min-w-max px-4">
          <div className="flex gap-12 mb-8 justify-center items-end">
            {leftRounds.map((r: any, idx: number) => (
              <div key={`l-hdr-${idx}`} className="w-64 shrink-0 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {getRoundNameTranslation(r.roundName)}
              </div>
            ))}
            <div className="w-64 shrink-0 text-center text-sm font-bold text-chart-4 uppercase tracking-widest px-4 py-1 bg-chart-4/10 rounded-full border border-chart-4/20 shadow-[0_0_15px_rgba(255,165,0,0.15)] mx-auto">
              {getRoundNameTranslation(finalRound.roundName)}
            </div>
            {rightRounds.map((r: any, idx: number) => (
              <div key={`r-hdr-${idx}`} className="w-64 shrink-0 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {getRoundNameTranslation(r.roundName)}
              </div>
            ))}
          </div>
  
          <div className="flex justify-center items-center gap-12">
            {leftRoot && <BracketTree node={leftRoot} side="left" isRoot={true} onEntryClick={onEntryClick} onClickMatch={setSelectedMatchId} />}
            
            <div className="relative z-10 flex flex-col items-center shrink-0">
              <div className="relative w-full">
                {leftRoot && <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-border" />}
                {rightRoot && <div className="absolute top-1/2 -right-6 w-6 h-[2px] bg-border" />}
                <BracketMatchCard bracket={finalMatch} onEntryClick={onEntryClick} onClick={() => setSelectedMatchId(finalMatch.id)} />
              </div>
            </div>
  
            {rightRoot && <BracketTree node={rightRoot} side="right" isRoot={true} onEntryClick={onEntryClick} onClickMatch={setSelectedMatchId} />}
          </div>
        </div>
      );
    }
  
    // Mock data fallback
    const quarterFinals = (matches || []).filter((m) => m.round === "Quarter-Finals");
    const semiFinals = (matches || []).filter((m) => m.round === "Semi-Finals");
  
    return (
      <div className="flex flex-col items-center min-w-max px-4">
        <div className="flex gap-12 mb-8 justify-center items-end">
           <div className="w-64 shrink-0 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleTab.quarterFinals', 'Quarter-Finals')}</div>
           <div className="w-64 shrink-0 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleTab.semiFinals', 'Semi-Finals')}</div>
           <div className="w-64 shrink-0 text-center text-sm font-bold text-chart-4 uppercase tracking-widest px-4 py-1 bg-chart-4/10 rounded-full border border-chart-4/20 shadow-[0_0_15px_rgba(255,165,0,0.15)] mx-auto">{t('tournamentManager.scheduleTab.grandFinal', 'Grand Final')}</div>
           <div className="w-64 shrink-0 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleTab.semiFinals', 'Semi-Finals')}</div>
           <div className="w-64 shrink-0 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleTab.quarterFinals', 'Quarter-Finals')}</div>
        </div>
  
        <div className="flex gap-12 justify-center items-center">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-6 relative">
              {quarterFinals.slice(0, 2).map((match, idx) => (
                <div key={idx} className="relative flex items-center">
                  <div className="relative shrink-0"><MatchCard match={match} /><div className="absolute top-1/2 -right-6 w-6 h-[2px] bg-border" /></div>
                  {idx === 0 && <div className="absolute -right-6 top-1/2 h-[calc(100%+24px)] w-[2px] bg-border z-0" />}
                </div>
              ))}
            </div>
            <div className="relative shrink-0 flex items-center">
              <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-border" />
              <div className="absolute top-1/2 -right-6 w-6 h-[2px] bg-border" />
              <MatchCard match={semiFinals[0]} />
            </div>
          </div>
  
          <div className="relative z-10 flex flex-col items-center shrink-0">
            <div className="bg-background border border-border rounded-lg p-3 relative opacity-50 border-dashed w-64">
              <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-border" />
              <div className="absolute top-1/2 -right-6 w-6 h-[2px] bg-border" />
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
  
          <div className="flex items-center gap-12 flex-row-reverse">
            <div className="flex flex-col gap-6 relative">
              {quarterFinals.slice(2, 4).map((match, idx) => (
                <div key={idx} className="relative flex items-center">
                  <div className="relative shrink-0"><MatchCard match={match} /><div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-border" /></div>
                  {idx === 0 && <div className="absolute -left-6 top-1/2 h-[calc(100%+24px)] w-[2px] bg-border z-0" />}
                </div>
              ))}
            </div>
            <div className="relative shrink-0 flex items-center">
              <div className="absolute top-1/2 -right-6 w-6 h-[2px] bg-border" />
              <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-border" />
              <MatchCard match={semiFinals[1]} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 relative w-full overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-4 right-4 z-20 shadow-sm" title={t('common.fullScreen', 'Full Screen')}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[100vw] !w-screen !h-screen !max-h-[100vh] !p-0 !m-0 !border-0 !rounded-none flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
              <h2 className="font-bold text-lg">{t('tournamentManager.scheduleTab.championshipBracket', 'Championship Bracket')}</h2>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-background cursor-grab active:cursor-grabbing pb-16">
              {renderContent()}
            </div>
          </DialogContent>
        </Dialog>

        <div className="overflow-auto w-full max-h-[600px] cursor-grab active:cursor-grabbing pb-8">
          {renderContent()}
        </div>
      </div>
      
      <MatchDetailModal matchId={selectedMatchId} onClose={() => setSelectedMatchId(null)} />
    </>
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
      className={`bg-background border border-border rounded-lg p-3 relative overflow-hidden transition-all cursor-pointer hover:border-primary/50 w-64
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
              className={`font-medium truncate pr-2 ${winnerA ? 'text-foreground' : 'text-muted-foreground'} ${bracket.entryA?.entryId ? 'cursor-pointer hover:underline hover:text-primary transition-colors' : ''}`}
              onClick={(e) => { e.stopPropagation(); bracket.entryA?.entryId && onEntryClick?.(bracket.entryA.entryId); }}
            >
              {playerA}
            </span>
            <span className={`font-bold shrink-0 ${winnerA ? 'text-primary' : 'text-foreground'}`}>
              {finalScoreA}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span 
              className={`font-medium truncate pr-2 ${winnerB ? 'text-foreground' : 'text-muted-foreground'} ${bracket.entryB?.entryId ? 'cursor-pointer hover:underline hover:text-primary transition-colors' : ''}`}
              onClick={(e) => { e.stopPropagation(); bracket.entryB?.entryId && onEntryClick?.(bracket.entryB.entryId); }}
            >
              {playerB}
            </span>
            <span className={`font-bold shrink-0 ${winnerB ? 'text-primary' : 'text-foreground'}`}>
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
  const isLive = match?.status === "LIVE";
  
  if (!match) return null;

  return (
    <div className={`bg-background border border-border rounded-lg p-3 relative overflow-hidden transition-all w-64
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
            <span className={`font-medium truncate pr-2 ${match.scoreA !== null && match.scoreB !== null && match.scoreA > match.scoreB ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span className="text-xs text-muted-foreground mr-2 font-mono">1</span>
              {match.playerA}
            </span>
            <span className={`font-bold shrink-0 ${match.scoreA !== null && match.scoreB !== null && match.scoreA > match.scoreB ? 'text-primary' : 'text-foreground'}`}>
              {match.scoreA ?? '-'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className={`font-medium truncate pr-2 ${match.scoreB !== null && match.scoreA !== null && match.scoreB > match.scoreA ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span className="text-xs text-muted-foreground mr-2 font-mono">8</span>
              {match.playerB}
            </span>
            <span className={`font-bold shrink-0 ${match.scoreB !== null && match.scoreA !== null && match.scoreB > match.scoreA ? 'text-primary' : 'text-foreground'}`}>
              {match.scoreB ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
