import {
  TrendingUp,
  Globe,
  Activity,
  Circle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import { useEloHistoriesByUser, useEloLeaderboard } from "@/hooks/queries/useEloQueries";
import { format } from "date-fns";

export default function EloLeaderboard() {
  const { t } = useTranslation();
  const { data: userResp } = useCurrentUser();
  const user = userResp;
  const userId = user?.id || 0;

  const { data: historyResp } = useEloHistoriesByUser(userId, 1, 50);
  const histories = historyResp?.rows || [];
  
  const { data: leaderboardResp } = useEloLeaderboard(1, 100);
  const rawLeaderboardItems = leaderboardResp?.rows || [];
  
  // Compute ranks handling ties
  let currentRank = 1;
  let currentScore = -1;
  const leaderboardItems = rawLeaderboardItems.map((item: any, index: number) => {
    if (item.score !== currentScore) {
      currentRank = index + 1;
      currentScore = item.score;
    }
    return { ...item, rank: currentRank };
  });
  
  // Calculate Global Rank
  const rankItem = leaderboardItems.find((item: any) => item.userId === userId);
  const globalRank = rankItem ? `#${rankItem.rank}` : "N/A";

  // Calculate Win Rate
  const totalMatches = histories.length;
  const wins = histories.filter((h: any) => (h.eloDelta || 0) > 0).length;
  const losses = totalMatches - wins;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  // Prepare Chart Data
  const performanceData = [...histories].reverse().map((h: any) => ({
    date: h.createdAt ? format(new Date(h.createdAt), "MMM dd") : "",
    elo: h.newElo,
  }));
  
  // Elo Change Log (Limit to 5)
  const eloLog = histories.slice(0, 5).map((h: any, idx) => ({
    id: h.id || idx,
    match: `Match #${h.matchId || "?"}`,
    date: h.createdAt ? format(new Date(h.createdAt), "MMM dd, HH:mm") : "",
    result: (h.eloDelta || 0) > 0 ? "WIN" : "LOSS",
    change: (h.eloDelta || 0) > 0 ? `+${h.eloDelta}` : `${h.eloDelta}`,
    isWin: (h.eloDelta || 0) > 0,
  }));
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("publicPlayer.elo.performanceTracker", "Performance Tracker")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("publicPlayer.elo.liveEloRatingDesc", "Live Elo rating and historical match analytics.")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
          <Circle className="h-2 w-2 fill-current" />
          {t("publicPlayer.elo.liveData", "LIVE DATA")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.elo.currentRating", "CURRENT RATING")}
            </span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-foreground">{((user?.eloScore as any)?.score ?? user?.eloScore) || 0}</span>
          </div>
        </div>

        <div 
          className="rounded-xl border border-border bg-card p-6 shadow-sm cursor-pointer hover:border-cyan-500/50 transition-colors group"
          onClick={() => {
            const el = document.getElementById('user-leaderboard-row');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-cyan-400 transition-colors">
              {t("publicPlayer.elo.globalRank", "GLOBAL RANK")}
            </span>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-foreground">{globalRank}</span>
          </div>
        </div>

        {histories.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("publicPlayer.elo.seasonWinRate", "SEASON WIN RATE")}
              </span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-bold text-foreground">{winRate}%</span>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-medium text-emerald-400">
                  • {wins} W
                </span>
                <span className="text-sm font-medium text-destructive">
                  • {losses} L
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {histories.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {t("publicPlayer.elo.performanceCurve", "Performance Curve")}
            </h3>
            <div className="flex items-center gap-2">
              {["1M", "3M", "ALL"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    tab === "3M"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#22d3ee" }}
                />
                <Area
                  type="monotone"
                  dataKey="elo"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorElo)"
                  activeDot={{ r: 6, fill: "#22d3ee", stroke: "#083344", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {histories.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              {t("publicPlayer.elo.eloChangeLog", "Elo Change Log")}
            </h3>
            <Link
              to="/history"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
            >
              {t("publicPlayer.elo.viewFullHistory", "View Full History")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t("publicPlayer.elo.matchEvent", "Match / Event")}</th>
                  <th className="px-6 py-4 font-semibold">{t("publicPlayer.elo.result", "Result")}</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    {t("publicPlayer.elo.eloChange", "Elo Change")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {eloLog.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">
                        {log.match}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {log.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                          log.isWin
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {log.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold ${
                          log.isWin ? "text-cyan-400" : "text-destructive"
                        }`}
                      >
                        {log.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mt-6">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {t("publicPlayer.elo.topPlayers", "Global Leaderboard")}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold w-24">{t("publicPlayer.elo.leaderboardTable.rank", "Rank")}</th>
                <th className="px-6 py-4 font-semibold">{t("publicPlayer.elo.leaderboardTable.player", "Player")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("publicPlayer.elo.leaderboardTable.score", "Score")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaderboardItems.map((item: any) => (
                <tr
                  key={item.id}
                  id={item.userId === userId ? "user-leaderboard-row" : undefined}
                  className={`transition-colors ${
                    item.userId === userId 
                      ? "bg-cyan-500/10 hover:bg-cyan-500/20" 
                      : "hover:bg-secondary/20"
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`font-bold text-lg ${item.rank <= 3 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                      #{item.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                        <img
                          src={item.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${item.user?.firstName || 'User'}`}
                          alt={item.user?.firstName || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {item.user?.firstName} {item.user?.lastName}
                        </span>
                        {item.userId === userId && (
                          <span className="text-[10px] uppercase font-bold text-cyan-400">
                            {t("publicPlayer.elo.you", "You")}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-lg text-foreground">
                      {item.score}
                    </span>
                  </td>
                </tr>
              ))}
              {leaderboardItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No leaderboard data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
