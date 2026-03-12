import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

export default function EloStats() {
  const { t } = useTranslation();
  useAuth(); // Keep hook call for potential future use
  const currentElo = 1500; // Default ELO, should be fetched from user profile API

  // Mock ELO history data
  const eloHistory = [
    { date: "2026-01-01", elo: 1500, change: 0 },
    { date: "2026-01-10", elo: 1520, change: 20 },
    { date: "2026-01-15", elo: 1490, change: -30 },
    { date: "2026-01-20", elo: 1530, change: 40 },
    { date: "2026-01-25", elo: 1550, change: 20 },
    { date: "2026-01-28", elo: currentElo, change: currentElo - 1550 },
  ];

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeBadge = (change: number) => {
    if (change > 0)
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          +{change}
        </Badge>
      );
    if (change < 0)
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          {change}
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-muted-foreground">
        0
      </Badge>
    );
  };

  const getRankFromElo = (elo: number) => {
    if (elo >= 2000)
      return { rank: t("athlete.masterRank"), color: "text-purple-600" };
    if (elo >= 1800)
      return { rank: t("athlete.professionalRank"), color: "text-blue-600" };
    if (elo >= 1600)
      return { rank: t("athlete.advancedRank"), color: "text-green-600" };
    if (elo >= 1400)
      return { rank: t("athlete.intermediateRank"), color: "text-yellow-600" };
    return { rank: t("athlete.beginnerRank"), color: "text-gray-600" };
  };

  const rankInfo = getRankFromElo(currentElo);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("athlete.eloStats")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("athlete.trackYourEloAndRanking")}
        </p>
      </div>

      {/* Current ELO Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t("athlete.currentElo")}
            </p>
            <p className="text-5xl font-bold text-primary">{currentElo}</p>
            <Badge className={`mt-3 ${rankInfo.color}`}>{rankInfo.rank}</Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("athlete.eloRankingTable")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50">
                <span className="font-medium">{t("athlete.masterRank")}</span>
                <span className="text-muted-foreground">2000+</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50">
                <span className="font-medium">
                  {t("athlete.professionalRank")}
                </span>
                <span className="text-muted-foreground">1800 - 1999</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-green-50">
                <span className="font-medium">{t("athlete.advancedRank")}</span>
                <span className="text-muted-foreground">1600 - 1799</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-yellow-50">
                <span className="font-medium">
                  {t("athlete.intermediateRank")}
                </span>
                <span className="text-muted-foreground">1400 - 1599</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                <span className="font-medium">{t("athlete.beginnerRank")}</span>
                <span className="text-muted-foreground">&lt; 1400</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ELO History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("athlete.eloHistoryChange")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eloHistory
              .slice()
              .reverse()
              .map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getChangeIcon(record.change)}
                    <div>
                      <p className="font-medium">ELO: {record.elo}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  {getChangeBadge(record.change)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
