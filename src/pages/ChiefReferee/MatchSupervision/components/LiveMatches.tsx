import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Match {
  id: number;
  court: string;
  match: string;
  player1: string;
  player2: string;
  score: string;
  referee: string;
  status: string;
  time: string;
}

interface LiveMatchesProps {
  matches: Match[];
}

export default function LiveMatches({ matches }: LiveMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trận đấu đang diễn ra</CardTitle>
        <CardDescription>{matches.length} trận đang được giám sát</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{match.court}</Badge>
                    <Badge variant="outline">{match.status}</Badge>
                    <span className="text-xs text-muted-foreground">⏱️ {match.time}</span>
                  </div>
                  <h3 className="font-semibold">{match.match}</h3>
                </div>
                <Button size="sm" variant="outline">Chi tiết</Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Đấu thủ 1</p>
                  <p className="font-medium">{match.player1}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Đấu thủ 2</p>
                  <p className="font-medium">{match.player2}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Trọng tài</p>
                  <p className="text-sm font-medium">{match.referee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tỷ số</p>
                  <p className="text-sm font-semibold">{match.score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
