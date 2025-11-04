import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Award,
  Medal,
  Minus,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";

const topPlayers = [
  {
    id: 1,
    name: "Alex Chen",
    rank: 1,
    points: 2850,
    wins: 45,
    losses: 8,
    winRate: 84.9,
    change: "up",
    avatar: "/asian-male-table-tennis-player.jpg",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    rank: 2,
    points: 2720,
    wins: 42,
    losses: 12,
    winRate: 77.8,
    change: "down",
    avatar: "/latina-female-table-tennis-player.jpg",
  },
  {
    id: 3,
    name: "David Kim",
    rank: 3,
    points: 2680,
    wins: 38,
    losses: 10,
    winRate: 79.2,
    change: "up",
    avatar: "/korean-male-table-tennis-player.jpg",
  },
];

const allPlayers = [
  ...topPlayers,
  {
    id: 4,
    name: "Sarah Johnson",
    rank: 4,
    points: 2590,
    wins: 35,
    losses: 15,
    winRate: 70.0,
    change: "same",
    avatar: "/blonde-female-table-tennis-player.jpg",
  },
  {
    id: 5,
    name: "Michael Zhang",
    rank: 5,
    points: 2520,
    wins: 33,
    losses: 17,
    winRate: 66.0,
    change: "up",
    avatar: "/chinese-male-table-tennis-player.jpg",
  },
  {
    id: 6,
    name: "Emma Wilson",
    rank: 6,
    points: 2480,
    wins: 31,
    losses: 19,
    winRate: 62.0,
    change: "down",
    avatar: "/brunette-female-table-tennis-player.jpg",
  },
  {
    id: 7,
    name: "James Park",
    rank: 7,
    points: 2420,
    wins: 29,
    losses: 21,
    winRate: 58.0,
    change: "up",
    avatar: "/korean-male-table-tennis-player-glasses.jpg",
  },
  {
    id: 8,
    name: "Lisa Thompson",
    rank: 8,
    points: 2380,
    wins: 27,
    losses: 23,
    winRate: 54.0,
    change: "same",
    avatar: "/redhead-female-table-tennis-player.jpg",
  },
];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return (
        <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
      );
  }
}

function getChangeIcon(change: string) {
  switch (change) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
}

const Rankings = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            PLAYER RANKINGS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Current standings and performance statistics for all registered
            players
          </p>
        </div>

        {/* Top 3 Players */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            TOP PERFORMERS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPlayers.map((player, index) => (
              <Card
                key={player.id}
                className={`bg-card border-border ${
                  index === 0 ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {getRankIcon(player.rank)}
                  </div>
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage
                      src={player.avatar || "/placeholder.svg"}
                      alt={player.name}
                    />
                    <AvatarFallback className="text-lg">
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl text-card-foreground">
                    {player.name}
                  </CardTitle>
                  <CardDescription className="text-primary font-semibold text-lg">
                    {player.points} Points
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wins:</span>
                    <span className="text-card-foreground font-medium">
                      {player.wins}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Losses:</span>
                    <span className="text-card-foreground font-medium">
                      {player.losses}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className="text-card-foreground font-medium">
                      {player.winRate}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Full Rankings Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">
              FULL SEASON RANKINGS
            </CardTitle>
            <CardDescription>
              Complete leaderboard with detailed statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Player
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Points
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Wins
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Losses
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Win Rate
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {getRankIcon(player.rank)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={player.avatar || "/placeholder.svg"}
                              alt={player.name}
                            />
                            <AvatarFallback>
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-card-foreground">
                            {player.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {player.points}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center text-card-foreground font-medium">
                        {player.wins}
                      </td>
                      <td className="py-4 px-4 text-center text-card-foreground font-medium">
                        {player.losses}
                      </td>
                      <td className="py-4 px-4 text-center text-card-foreground font-medium">
                        {player.winRate}%
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getChangeIcon(player.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-card-foreground">
                Total Players
              </CardTitle>
              <div className="text-3xl font-bold text-primary">156</div>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-card-foreground">
                Matches Played
              </CardTitle>
              <div className="text-3xl font-bold text-primary">2,847</div>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-card-foreground">
                Active Tournaments
              </CardTitle>
              <div className="text-3xl font-bold text-primary">12</div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
