import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Match } from "@/types";

interface MatchHistoryProps {
  matches: Match[];
  isLoading?: boolean;
}

export default function MatchHistory({
  matches,
  isLoading,
}: MatchHistoryProps) {
  const getStatusBadge = (match: Match) => {
    if (match.resultStatus === "approved") {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Đã duyệt
        </Badge>
      );
    }
    if (match.resultStatus === "rejected") {
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Bị từ chối
        </Badge>
      );
    }
    if (match.resultStatus === "pending") {
      return (
        <Badge variant="secondary">
          <Clock className="mr-1 h-3 w-3" />
          Chờ duyệt
        </Badge>
      );
    }
    return <Badge variant="outline">{match.status}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử trận đấu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Lịch sử trận đấu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có trận đấu nào hoàn thành
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    Entry {match.entryAId} vs Entry {match.entryBId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {match.winnerEntryId
                      ? `Người thắng: Entry ${match.winnerEntryId}`
                      : "Chưa xác định người thắng"}
                  </p>
                </div>
                {getStatusBadge(match)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
