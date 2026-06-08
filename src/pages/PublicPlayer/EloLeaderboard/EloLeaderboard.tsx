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

const performanceData = [
  { date: "SEP 01", elo: 2100 },
  { date: "SEP 15", elo: 2150 },
  { date: "OCT 01", elo: 2300 },
  { date: "OCT 15", elo: 2350 },
  { date: "NOV 01", elo: 2450 },
];

const eloLog = [
  {
    id: 1,
    match: "Pro-Circuit Qualifier Q3",
    date: "Today, 14:30 EST",
    opponent: "ToxicBlade",
    result: "WIN (3-1)",
    change: "+12",
    isWin: true,
  },
  {
    id: 2,
    match: "Ranked Matchmaking",
    date: "Yesterday, 21:00 EST",
    opponent: "ShadowNinja",
    result: "WIN (2-0)",
    change: "+8",
    isWin: true,
  },
  {
    id: 3,
    match: "Weekly Invitational",
    date: "Nov 02, 18:00 EST",
    opponent: "Valkyrie_X",
    result: "LOSS (2-3)",
    change: "-15",
    isWin: false,
  },
  {
    id: 4,
    match: "Ranked Matchmaking",
    date: "Nov 01, 14:20 EST",
    opponent: "Grizzly_99",
    result: "WIN (2-2)",
    change: "+9",
    isWin: true,
  },
];

export default function EloLeaderboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Performance Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Live Elo rating and historical match analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
          <Circle className="h-2 w-2 fill-current" />
          LIVE DATA
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CURRENT RATING
            </span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-foreground">2,450</span>
            <span className="text-sm font-medium text-cyan-400 mt-2">
              +14 this week
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              GLOBAL RANK
            </span>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-foreground">#42</span>
            <div className="w-full bg-secondary h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-cyan-400 h-full w-[99.5%]"></div>
            </div>
            <span className="text-xs text-muted-foreground mt-2">
              Top 0.5% of all active players
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SEASON WIN RATE
            </span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-foreground">68%</span>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium text-emerald-400">
                • 142 W
              </span>
              <span className="text-sm font-medium text-destructive">
                • 67 L
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Performance Curve
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
                domain={[2000, 2600]}
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

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Elo Change Log
          </h3>
          <Link
            to="/history"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
          >
            View Full History
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Match / Event</th>
                <th className="px-6 py-4 font-semibold">Opponent</th>
                <th className="px-6 py-4 font-semibold">Result</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Elo Change
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
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.opponent}`}
                          alt={log.opponent}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="font-medium text-foreground">
                        {log.opponent}
                      </span>
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
    </div>
  );
}
