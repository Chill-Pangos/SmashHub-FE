import {
  Search,
  Filter,
  CalendarDays,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const matchHistory = [
  {
    id: 1,
    date: "Oct 24, 2026",
    tournament: "Genesis 9 Pools",
    opponent: "Mango",
    opponentRank: "RANK 4",
    result: "WIN",
    score: "3-1",
    eloChange: "+14",
    isWin: true,
  },
  {
    id: 2,
    date: "Oct 23, 2026",
    tournament: "Weekly Locals #42",
    opponent: "Zain",
    opponentRank: "RANK 1",
    result: "LOSS",
    score: "2-3",
    eloChange: "-8",
    isWin: false,
  },
  {
    id: 3,
    date: "Oct 20, 2026",
    tournament: "Ranked Ladder",
    opponent: "CodySchwab",
    opponentRank: "RANK 12",
    result: "WIN",
    score: "3-0",
    eloChange: "+11",
    isWin: true,
  },
];

export default function MatchCenter() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            PLAYER PORTAL
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Competitive History
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Total Matches
            </span>
            <span className="text-2xl font-bold">428</span>
          </div>
          <div className="h-10 w-px bg-border"></div>
          <div className="flex flex-col items-center px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Win Rate
            </span>
            <span className="text-2xl font-bold text-cyan-400">68.4%</span>
          </div>
          <div className="h-10 w-px bg-border"></div>
          <div className="flex items-center gap-6 px-4">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                W
              </span>
              <span className="text-2xl font-bold">293</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                L
              </span>
              <span className="text-2xl font-bold">135</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Opponent Name"
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
          />
        </div>
        <select className="bg-secondary/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
          <option>Result: All</option>
          <option>Win</option>
          <option>Loss</option>
        </select>
        <select className="bg-secondary/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
          <option>Type: All</option>
          <option>Tournament</option>
          <option>Ranked</option>
        </select>
        <button className="flex items-center gap-2 bg-secondary/50 border border-border rounded-lg px-4 py-2 text-sm hover:bg-secondary transition-colors">
          <CalendarDays className="h-4 w-4" />
          <span>Date Range</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Filter className="h-4 w-4" />
          RESET FILTERS
        </button>
      </div>

      {/* Match List */}
      <div className="space-y-3">
        {matchHistory.map((match) => (
          <div
            key={match.id}
            className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-cyan-500/50 transition-colors group cursor-pointer"
          >
            <div className="flex flex-col w-48 shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {match.date}
              </span>
              <span className="font-semibold text-foreground">
                {match.tournament}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.opponent}`}
                  alt={match.opponent}
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-lg">
                  {match.opponent}
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  {match.opponentRank}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center w-24 shrink-0">
              <span
                className={`text-sm font-bold tracking-wider ${
                  match.isWin ? "text-emerald-500" : "text-destructive"
                }`}
              >
                {match.result}
              </span>
              <span className="text-xl font-bold text-foreground">
                {match.score}
              </span>
            </div>

            <div className="flex flex-col items-end w-32 shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Elo Change
              </span>
              <div
                className={`flex items-center gap-1 font-bold text-lg ${
                  match.isWin ? "text-cyan-400" : "text-destructive"
                }`}
              >
                {match.isWin ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {match.eloChange}
              </div>
            </div>

            <div className="flex items-center justify-center w-10 shrink-0">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button className="px-6 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors">
          LOAD MORE MATCHES
        </button>
      </div>
    </div>
  );
}
