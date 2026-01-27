import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchService } from "@/services";
import { showToast } from "@/utils";
import type { Match } from "@/types";

export default function LiveMatches() {
  const [isLoading, setIsLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);

  const fetchLiveMatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await matchService.getMatchesByStatus(
        "in_progress",
        0,
        50,
      );
      const matches = Array.isArray(response) ? response : response.data || [];
      setLiveMatches(matches);
    } catch (error) {
      console.error("Error fetching live matches:", error);
      showToast.error("Không thể tải trận đấu trực tiếp");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMatches();

    // Auto refresh every 30 seconds
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveMatches]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Radio className="h-8 w-8 text-orange-600" />
            Trận đấu trực tiếp
          </h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi các trận đấu đang diễn ra
          </p>
        </div>
        <Button variant="outline" onClick={fetchLiveMatches}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Live Matches Grid */}
      {liveMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Không có trận đấu nào đang diễn ra
            </h3>
            <p className="text-muted-foreground">
              Các trận đấu sẽ hiển thị khi bắt đầu
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liveMatches.map((match) => (
            <Card
              key={match.id}
              className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-white"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge className="bg-orange-600 animate-pulse">🔴 LIVE</Badge>
                  <span className="text-sm text-muted-foreground">
                    Trận #{match.id}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Player A */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="font-medium">Entry {match.entryAId}</span>
                    <span className="text-2xl font-bold text-primary">
                      {match.winnerEntryId === match.entryAId ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>

                  <div className="text-center text-muted-foreground text-sm">
                    vs
                  </div>

                  {/* Player B */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="font-medium">Entry {match.entryBId}</span>
                    <span className="text-2xl font-bold text-primary">
                      {match.winnerEntryId === match.entryBId ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>

                  {/* Match Info */}
                  <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                    <p>
                      Trạng thái:{" "}
                      {match.status === "in_progress"
                        ? "Đang diễn ra"
                        : match.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Auto refresh notice */}
      <p className="text-center text-sm text-muted-foreground">
        Tự động cập nhật mỗi 30 giây
      </p>
    </div>
  );
}
