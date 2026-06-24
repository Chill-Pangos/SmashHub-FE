import { useState, useEffect } from "react";
import { GroupStageBoard, type Group } from "./GroupStageBoard";
import { ChampionshipBracket } from "./ChampionshipBracket";
import { Button } from "@/components/ui/button";

interface TournamentScheduleViewerProps {
  contentId: number;
  tournamentId?: number; // Nhận tournamentId từ Tab
  schedulesOverride?: unknown;
}

import { useGroupStandingsByCategory } from "@/hooks/queries";
import { useTranslation } from "react-i18next";

export default function TournamentScheduleViewer({
  contentId,
  schedulesOverride,
}: TournamentScheduleViewerProps) {
  const { t } = useTranslation();
  const [stageTab, setStageTab] = useState<"group" | "knockout">("group");
  
  // Fetch real group standings
  const { data: standingsData } = useGroupStandingsByCategory(contentId);
  const rawStandings = (standingsData as any)?.data || [];

  const rawSchedules = (schedulesOverride as any)?.schedules || [];
  
  const groupSchedules = rawSchedules.filter((s: any) => s.stage === "group" || s.stage === "group_stage");
  
  const groups: Group[] = Array.from(new Set(rawStandings.map((s: any) => s.groupName))).map((groupName: any) => {
    const groupMatches = groupSchedules
      .filter((s: any) => s.groupName === groupName)
      .flatMap((s: any) => {
        return (s.scheduledMatches || []).map((m: any) => {
          const showPoints = m.status === 'in_progress' || (m.status === 'completed' && m.resultStatus === 'approved');
          return {
            time: s.scheduledAt ? new Date(s.scheduledAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : "TBD",
            playerA: m.entryA?.name || "TBD",
            playerB: m.entryB?.name || "TBD",
            status: m.status,
            scoreA: showPoints ? (m.setsWonA ?? null) : null,
            scoreB: showPoints ? (m.setsWonB ?? null) : null,
          };
        });
      });

    return {
      name: groupName,
      standings: rawStandings
        .filter((s: any) => s.groupName === groupName)
        .map((s: any) => ({
          rank: s.position || 0,
          player: s.entryName || `Entry ${s.entryId}`, // Adjust based on your API
          entryId: s.entryId,
          p: s.matchesPlayed || 0,
          w: s.matchesWon || 0,
          l: s.matchesLost || 0,
          pts: s.points || 0,
        })),
      matches: groupMatches,
    };
  });

  const hasGroupStage = groups.length > 0;
  
  const knockoutSchedules = rawSchedules.filter((s: any) => s.stage === "knockout");
  
  const KNOCKOUT_ROUND_ORDER: Record<string, number> = {
    "Round of 128": 1,
    "Round of 64": 2,
    "Round of 32": 3,
    "Round of 16": 4,
    "Quarter-final": 5,
    "Semi-final": 6,
    "Final": 7,
  };

  const roundMap = new Map<string, any[]>();
  knockoutSchedules.forEach((s: any) => {
    const r = s.knockoutRound || "Unknown";
    if (!roundMap.has(r)) roundMap.set(r, []);
    
    (s.scheduledMatches || []).forEach((m: any) => {
      roundMap.get(r)!.push({
        ...m,
        scheduledAt: s.scheduledAt,
      });
    });
  });

  let knockoutRounds = Array.from(roundMap.keys())
    .sort((a, b) => (KNOCKOUT_ROUND_ORDER[a] || 99) - (KNOCKOUT_ROUND_ORDER[b] || 99))
    .map((roundName, index) => {
      return {
        roundNumber: index + 1,
        roundName: roundName,
        brackets: roundMap.get(roundName)!.map((m: any) => ({
          id: m.id,
          status: m.status,
          entryA: m.entryA ? { entryId: m.entryA.id, entryName: m.entryA.name } : null,
          entryB: m.entryB ? { entryId: m.entryB.id, entryName: m.entryB.name } : null,
          winnerEntryId: m.winnerEntryId,
          scheduledAt: m.scheduledAt,
          setsWonA: m.setsWonA ?? null,
          setsWonB: m.setsWonB ?? null,
        }))
      };
    });

  const hasKnockoutStage = knockoutRounds.length > 0;

  useEffect(() => {
    if (!hasGroupStage && hasKnockoutStage) {
      setStageTab("knockout");
    } else if (hasGroupStage && !hasKnockoutStage) {
      setStageTab("group");
    }
  }, [hasGroupStage, hasKnockoutStage]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {(hasGroupStage || hasKnockoutStage) && (
        <div className="flex gap-2 border-b border-border pb-4">
          {hasGroupStage && (
            <Button
              variant={stageTab === "group" ? "default" : "outline"}
              onClick={() => setStageTab("group")}
            >
              {t("tournamentManager.scheduleTab.groupStage", "Group Stage")}
            </Button>
          )}
          {hasKnockoutStage && (
            <Button
              variant={stageTab === "knockout" ? "default" : "outline"}
              onClick={() => setStageTab("knockout")}
            >
              {t("tournamentManager.scheduleTab.championshipBracket", "Championship Bracket")}
            </Button>
          )}
        </div>
      )}

      {stageTab === "group" && hasGroupStage && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {groups.map((group) => ( // Sửa MOCK_GROUPS thành groups
            <GroupStageBoard key={group.name} group={group} />
          ))}
        </div>
      )}

      {stageTab === "knockout" && hasKnockoutStage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('tournamentManager.scheduleTab.championshipBracket', 'Championship Bracket')}</h2>
          <ChampionshipBracket rounds={knockoutRounds} />
        </div>
      )}
    </div>
  );
}