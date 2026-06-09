import { Filter, User } from 'lucide-react';
import { useMatches, useStartMatch } from '@/hooks/queries';

export default function MatchControlCenterTab() {
  const { data, isLoading } = useMatches(1, 100);
  const matches = data?.rows || [];
  
  const startMatchMutation = useStartMatch();

  const handleStartMatch = (id: number) => {
    startMatchMutation.mutate(id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end justify-between bg-card p-4 rounded-xl border border-border shadow-auth-surface-shadow">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Category</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option value="">All Categories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Court</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option value="">All Courts</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option value="">Scheduled</option>
            </select>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors border border-border text-sm font-medium">
          <Filter className="w-4 h-4" /> More Filters
        </button>
      </div>

      {isLoading && <div className="p-4 text-muted-foreground">Loading matches...</div>}
      {!isLoading && matches.length === 0 && <div className="p-4 text-muted-foreground">No matches found.</div>}

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map(match => {
          const player1 = match.entryA?.team?.name || "Player 1";
          const player2 = match.entryB?.team?.name || "Player 2";
          const category = match.schedule?.tournamentContent?.name || "Unknown Category";
          const court = match.schedule?.tableNumber ? `Court ${match.schedule.tableNumber}` : "TBD";
          const isReady = match.status === 'scheduled';

          return (
            <div key={match.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground tracking-wider">
                <span>MATCH #{match.id} • {category} • {court}</span>
                <span className={`px-2 py-1 rounded text-[10px] ${isReady ? 'bg-chart-4/20 text-chart-4' : 'bg-secondary text-secondary-foreground'}`}>
                  {match.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-bold">{player1.charAt(0)}</div>
                  <div className="text-center">
                    <p className="font-bold text-sm truncate w-full">{player1}</p>
                  </div>
                </div>
                <div className="text-xl font-black text-muted-foreground w-1/3 text-center">VS</div>
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-bold">{player2.charAt(0)}</div>
                  <div className="text-center">
                    <p className="font-bold text-sm truncate w-full">{player2}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> Ref: {match.umpire ? `Ref ${match.umpire}` : "TBD"}
                </p>
                <button 
                  onClick={() => handleStartMatch(match.id)}
                  disabled={startMatchMutation.isPending || !isReady}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${isReady ? 'bg-primary text-primary-foreground shadow-[var(--auth-primary-glow)] hover:opacity-90' : 'bg-secondary text-secondary-foreground border border-border opacity-50'}`}
                >
                  {isReady ? 'Start Match' : 'Prep Match'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}