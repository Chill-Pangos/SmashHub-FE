import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { GroupStageBoard, type Group } from "./GroupStageBoard";
import { ChampionshipBracket,type KnockoutMatch } from "./ChampionshipBracket";

interface TournamentScheduleViewerProps {
  contentId: number;
  tournamentId?: number; // Nhận tournamentId từ Tab
  schedulesOverride?: unknown;
}

// --- MOCK DATA ---
const MOCK_GROUPS: Group[] = [
  {
    name: "Group A",
    standings: [
      { rank: 1, player: "Fan Zhendong", p: 3, w: 3, l: 0, pts: 6 },
      { rank: 2, player: "Hugo Calderano", p: 3, w: 2, l: 1, pts: 5 },
      { rank: 3, player: "Truls Moregard", p: 3, w: 1, l: 2, pts: 4 },
    ],
    matches: [
      { time: "10:00", playerA: "Fan Zhendong", playerB: "Hugo Calderano", status: "COMPLETED", scoreA: 3, scoreB: 2 },
      { time: "11:30", playerA: "Fan Zhendong", playerB: "Truls Moregard", status: "COMPLETED", scoreA: 3, scoreB: 1 },
      { time: "13:00", playerA: "Hugo Calderano", playerB: "Truls Moregard", status: "COMPLETED", scoreA: 3, scoreB: 0 },
    ]
  },
  {
    name: "Group B",
    standings: [
      { rank: 1, player: "Ma Long", p: 3, w: 3, l: 0, pts: 6 },
      { rank: 2, player: "Tomokazu Harimoto", p: 3, w: 2, l: 1, pts: 5 },
      { rank: 3, player: "Lin Yun-Ju", p: 3, w: 1, l: 2, pts: 4 },
    ],
    matches: [
      { time: "10:00", playerA: "Ma Long", playerB: "Tomokazu Harimoto", status: "COMPLETED", scoreA: 3, scoreB: 1 },
      { time: "11:30", playerA: "Ma Long", playerB: "Lin Yun-Ju", status: "COMPLETED", scoreA: 3, scoreB: 0 },
      { time: "13:00", playerA: "Tomokazu Harimoto", playerB: "Lin Yun-Ju", status: "COMPLETED", scoreA: 3, scoreB: 2 },
    ]
  }
];

const MOCK_KNOCKOUT_MATCHES: KnockoutMatch[] = [
  { round: "Quarter-Finals", time: "14:00", status: "COMPLETED", playerA: "Fan Zhendong", scoreA: 3, playerB: "Darko Jorgic", scoreB: 1, isLive: false },
  { round: "Quarter-Finals", time: "15:00", status: "LIVE", playerA: "Hugo Calderano", scoreA: 2, playerB: "Felix Lebrun", scoreB: 2, isLive: true },
  { round: "Semi-Finals", time: "18:00", status: "UPCOMING", playerA: "Fan Zhendong", scoreA: null, playerB: "TBD", scoreB: null, isLive: false }
];

export default function TournamentScheduleViewer({
  contentId,
  tournamentId,
  // schedulesOverride, // Map real data sau này
}: TournamentScheduleViewerProps) {
  
  const isMockMode = tournamentId === 1;

  // Nếu là mock thì dùng MOCK DATA, nếu không thì dùng data thật (hiện tại để [] trống chờ ghép api)
  const groups = isMockMode ? MOCK_GROUPS : []; 
  const knockoutMatches = isMockMode ? MOCK_KNOCKOUT_MATCHES : [];

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
          <Button onClick={handleGenerateKnockout} className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-auth-primary-glow">
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