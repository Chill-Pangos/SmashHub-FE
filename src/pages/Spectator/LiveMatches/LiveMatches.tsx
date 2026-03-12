import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMatchesByStatus } from "@/hooks/queries";
import { useTranslation } from "@/hooks/useTranslation";
import type { Match } from "@/types";

export default function LiveMatches() {
  const { t } = useTranslation();

  // Fetch live matches using React Query with auto-refetch every 30 seconds
  const {
    data: liveMatchesData,
    isLoading,
    refetch,
    isFetching,
  } = useMatchesByStatus("in_progress", 0, 50, {
    refetchInterval: 30000, // Auto refresh every 30 seconds
  } as { enabled?: boolean; refetchInterval?: number });

  // Derive live matches from query data
  const liveMatches = useMemo(() => {
    if (!liveMatchesData) return [];
    return Array.isArray(liveMatchesData)
      ? liveMatchesData
      : (liveMatchesData as { data?: Match[] }).data || [];
  }, [liveMatchesData]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
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
            {t("spectator.liveMatches")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("spectator.watchLiveMatches")}
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isFetching}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          {t("common.refresh")}
        </Button>
      </div>

      {/* Live Matches Grid */}
      {liveMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("spectator.noLiveMatches")}
            </h3>
            <p className="text-muted-foreground">
              {t("spectator.matchesWillAppear")}
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
                    {t("spectator.matchNumber", { id: match.id })}
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
                      {t("spectator.matchStatus")}:{" "}
                      {match.status === "in_progress"
                        ? t("tournament.ongoing")
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
        {t("spectator.autoRefreshEvery30s")}
      </p>
    </div>
  );
}
