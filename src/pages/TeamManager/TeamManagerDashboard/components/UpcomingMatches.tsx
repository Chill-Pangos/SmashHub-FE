import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { Match } from "@/types";

interface UpcomingMatchesProps {
  matches: Match[];
}

export function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trận đấu sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Không có trận đấu sắp tới
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Trận đấu sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  Entry {match.entryAId} vs Entry {match.entryBId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Schedule ID: {match.scheduleId || "N/A"}
                </p>
              </div>
              <Badge variant="outline">{match.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
