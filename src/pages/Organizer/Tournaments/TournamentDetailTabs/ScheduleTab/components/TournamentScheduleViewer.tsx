import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { GroupStageBoard, type Group } from "./GroupStageBoard";
import { ChampionshipBracket, type KnockoutMatch } from "./ChampionshipBracket";

interface TournamentScheduleViewerProps {
  contentId: number;
  tournamentId?: number; // Nhận tournamentId từ Tab
  schedulesOverride?: unknown;
}

import { useGroupStandingsByCategory, useMatchesByCategory } from "@/hooks/queries";

export default function TournamentScheduleViewer({
  contentId,
  // schedulesOverride, // Map real data sau này
}: TournamentScheduleViewerProps) {
  
  // Fetch real group standings
  const { data: standingsData } = useGroupStandingsByCategory(contentId);
  const rawStandings = (standingsData as any)?.data || [];

  // TODO: Map rawStandings to groups and fetch matches for each group
  // MAPPING INCOMPLETE: Backend API returns flat standings. Need an API or logic to group them and fetch matches per group.
  const groups: Group[] = Array.from(new Set(rawStandings.map((s: any) => s.groupName))).map((groupName: any) => {
    return {
      name: groupName,
      standings: rawStandings
        .filter((s: any) => s.groupName === groupName)
        .map((s: any) => ({
          rank: s.position || 0,
          player: s.entryId?.toString() || "Unknown", // Assuming entryId for now, ideally needs join with user data
          p: s.matchesPlayed || 0,
          w: s.matchesWon || 0,
          l: s.matchesLost || 0,
          pts: s.points || 0,
        })),
      matches: [], // Missing group matches API mapping
    };
  });

  // Fetch real knockout matches
  const { data: knockoutData } = useMatchesByCategory(contentId, { stage: "knockout" });
  const rawKnockout = (knockoutData as any)?.schedules || [];
  
  // TODO: MAPPING INCOMPLETE: Backend returns Match[], need to map to KnockoutMatch format
  const knockoutMatches: KnockoutMatch[] = rawKnockout.map((m: any) => ({
    round: m.roundName || `Round ${m.roundNumber}`,
    time: m.scheduledAt ? new Date(m.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "TBD",
    status: m.matches?.[0]?.status || "PENDING",
    playerA: m.matches?.[0]?.entryAId?.toString() || "TBD",
    scoreA: m.matches?.[0]?.setsWonA?.toString() || "-",
    playerB: m.matches?.[0]?.entryBId?.toString() || "TBD",
    scoreB: m.matches?.[0]?.setsWonB?.toString() || "-",
    isLive: m.matches?.[0]?.status === "in_progress"
  }));

  const hasGroupStage = groups.length > 0;
  const hasKnockoutStage = knockoutMatches.length > 0;
  const isGroupStageCompleted = true; // Chờ ghép API để tính logic thực tế

  const handleGenerateKnockout = () => {
    console.log("Call API Generate Knockout for Category:", contentId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {hasGroupStage && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {groups.map((group) => ( // Sửa MOCK_GROUPS thành groups
            <GroupStageBoard key={group.name} group={group} />
          ))}
        </div>
      )}

      {hasGroupStage && isGroupStageCompleted && !hasKnockoutStage && (
        <div className="flex flex-col items-center justify-center p-8 bg-card border-2 border-dashed border-border rounded-xl mt-8">
          <Wand2 className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold text-foreground">Group Stage Completed</h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md mt-2">
            All group stage matches are finished. You can now generate the Championship Bracket based on the final standings.
          </p>
          <Button onClick={handleGenerateKnockout} className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-[var(--auth-primary-glow)]">
            Generate Knockout Bracket
          </Button>
        </div>
      )}

      {hasKnockoutStage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Championship Bracket</h2>
          <ChampionshipBracket matches={knockoutMatches} /> {/* Sửa MOCK_KNOCKOUT_MATCHES thành knockoutMatches */}
        </div>
      )}
    </div>
  );
}