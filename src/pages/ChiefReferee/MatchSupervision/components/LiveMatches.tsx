import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Users, UserCheck } from "lucide-react";
import { useMatchesByStatus } from "@/hooks/queries";
import type { Match } from "@/types";

export default function LiveMatches() {
  // Fetch in_progress matches using React Query
  const {
    data: matchesResponse,
    isLoading,
    refetch: refetchMatches,
  } = useMatchesByStatus("in_progress", 0, 50);

  const matches: Match[] = Array.isArray(matchesResponse)
    ? matchesResponse
    : matchesResponse?.data || [];

  // Helper to calculate and format score from matchSets
  const formatScore = (match: Match): string => {
    // Try to calculate from matchSets if available
    if (match.matchSets && match.matchSets.length > 0) {
      let setsA = 0;
      let setsB = 0;
      match.matchSets.forEach((set) => {
        if (set.entryAScore > set.entryBScore) setsA++;
        else if (set.entryBScore > set.entryAScore) setsB++;
      });
      return `${setsA} - ${setsB}`;
    }
    // Fallback to setsWonA/B if matchSets not available
    const setsA = match.setsWonA ?? 0;
    const setsB = match.setsWonB ?? 0;
    return `${setsA} - ${setsB}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trận đấu đang diễn ra</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Trận đấu đang diễn ra
            </CardTitle>
            <CardDescription>
              {matches.length} trận đang được giám sát
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchMatches()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có trận đấu nào đang diễn ra
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="default">Trận #{match.id}</Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Đang thi đấu
                      </Badge>
                      {match.schedule?.tournamentContent && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {match.schedule.tournamentContent.name}
                        </Badge>
                      )}
                      {match.schedule?.stage === "group" &&
                        match.schedule.groupName && (
                          <Badge variant="outline">
                            {match.schedule.groupName}
                          </Badge>
                        )}
                      {match.schedule?.stage === "knockout" &&
                        match.schedule.knockoutRound && (
                          <Badge variant="outline">
                            {match.schedule.knockoutRound}
                          </Badge>
                        )}
                    </div>
                    {match.schedule && (
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        {match.schedule.tableNumber &&
                          `Bàn ${match.schedule.tableNumber}`}
                        {match.schedule.scheduledAt &&
                          ` • ${new Date(match.schedule.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`}
                      </h3>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    Chi tiết
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry A</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {match.entryA?.team?.name || `Entry #${match.entryAId}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entry B</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {match.entryB?.team?.name || `Entry #${match.entryBId}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      Trọng tài
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">
                        {match.umpire
                          ? `Chính: #${match.umpire}`
                          : "Chính: Chưa phân công"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.assistantUmpire
                          ? `Phụ: #${match.assistantUmpire}`
                          : "Phụ: Chưa phân công"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tỷ số (sets)
                    </p>
                    <p className="text-sm font-semibold">
                      {formatScore(match)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
