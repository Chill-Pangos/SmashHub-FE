import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Medal, Trophy, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Rankings() {
  const { t } = useTranslation();
  // Mock rankings data
  const rankings = [
    {
      rank: 1,
      name: "Nguyễn Văn A",
      elo: 2150,
      wins: 45,
      losses: 8,
      winRate: 84.9,
    },
    {
      rank: 2,
      name: "Trần Thị B",
      elo: 2050,
      wins: 42,
      losses: 12,
      winRate: 77.8,
    },
    {
      rank: 3,
      name: "Lê Văn C",
      elo: 1980,
      wins: 38,
      losses: 15,
      winRate: 71.7,
    },
    {
      rank: 4,
      name: "Phạm Thị D",
      elo: 1920,
      wins: 35,
      losses: 18,
      winRate: 66.0,
    },
    {
      rank: 5,
      name: "Hoàng Văn E",
      elo: 1890,
      wins: 33,
      losses: 20,
      winRate: 62.3,
    },
    {
      rank: 6,
      name: "Vũ Thị F",
      elo: 1850,
      wins: 30,
      losses: 22,
      winRate: 57.7,
    },
    {
      rank: 7,
      name: "Đặng Văn G",
      elo: 1820,
      wins: 28,
      losses: 25,
      winRate: 52.8,
    },
    {
      rank: 8,
      name: "Bùi Thị H",
      elo: 1780,
      wins: 25,
      losses: 28,
      winRate: 47.2,
    },
    {
      rank: 9,
      name: "Ngô Văn I",
      elo: 1750,
      wins: 22,
      losses: 30,
      winRate: 42.3,
    },
    {
      rank: 10,
      name: "Dương Thị K",
      elo: 1720,
      wins: 20,
      losses: 32,
      winRate: 38.5,
    },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">🥇 {rank}</Badge>
      );
    if (rank === 2)
      return <Badge className="bg-gray-400 hover:bg-gray-500">🥈 {rank}</Badge>;
    if (rank === 3)
      return (
        <Badge className="bg-amber-600 hover:bg-amber-700">🥉 {rank}</Badge>
      );
    return <Badge variant="outline">{rank}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Medal className="h-8 w-8 text-primary" />
          {t("spectator.rankingsTitle")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("spectator.topAthletesWithHighestElo")}
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {rankings.slice(0, 3).map((player) => (
          <Card
            key={player.rank}
            className={`relative overflow-hidden ${
              player.rank === 1
                ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white"
                : player.rank === 2
                  ? "border-gray-300 bg-gradient-to-br from-gray-50 to-white"
                  : "border-amber-400 bg-gradient-to-br from-amber-50 to-white"
            }`}
          >
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                {player.rank === 1 && (
                  <Trophy className="h-12 w-12 mx-auto text-yellow-500" />
                )}
                {player.rank === 2 && (
                  <Trophy className="h-10 w-10 mx-auto text-gray-400" />
                )}
                {player.rank === 3 && (
                  <Trophy className="h-9 w-9 mx-auto text-amber-600" />
                )}
              </div>
              <h3 className="text-xl font-bold">{player.name}</h3>
              <p className="text-3xl font-bold text-primary mt-2">
                {player.elo}
              </p>
              <p className="text-sm text-muted-foreground">ELO</p>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <span className="text-green-600">{player.wins}W</span>
                <span className="text-red-600">{player.losses}L</span>
                <span className="text-muted-foreground">
                  {player.winRate.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("spectator.fullRankingsTable")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  {t("spectator.rankColumn")}
                </TableHead>
                <TableHead>{t("spectator.athleteColumn")}</TableHead>
                <TableHead className="text-center">ELO</TableHead>
                <TableHead className="text-center">
                  {t("spectator.winsColumn")}
                </TableHead>
                <TableHead className="text-center">
                  {t("spectator.lossesColumn")}
                </TableHead>
                <TableHead className="text-right">
                  {t("spectator.winRateColumn")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((player) => (
                <TableRow key={player.rank}>
                  <TableCell>{getRankBadge(player.rank)}</TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell className="text-center font-bold">
                    {player.elo}
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    {player.wins}
                  </TableCell>
                  <TableCell className="text-center text-red-600">
                    {player.losses}
                  </TableCell>
                  <TableCell className="text-right">
                    {player.winRate.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
