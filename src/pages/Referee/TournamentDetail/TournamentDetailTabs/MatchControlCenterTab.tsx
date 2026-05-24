import { Filter,User } from 'lucide-react';

// MOCK DATA
const MOCK_MATCHES = [
  { id: '#1042', category: "MEN'S PRO SINGLES", court: "CENTER COURT", player1: "J. Smith", seed1: 1, player2: "M. Johnson", seed2: 4, ref: "S. Williams", status: "READY" },
  { id: '#1043', category: "WOMEN'S PRO SINGLES", court: "COURT 1", player1: "A. Chen", seed1: 2, player2: "E. Davis", seed2: 7, ref: "D. Lee", status: "SCHEDULED" },
];

export default function MatchControlCenterTab() {
  // 🟢 REACT QUERY: 
  // const { data: matches, isLoading } = useQuery({ queryKey: ['scheduledMatches', filters], queryFn: fetchMatches })
  // const startMatchMutation = useMutation({ mutationFn: startMatch, onSuccess: () => queryClient.invalidateQueries(['scheduledMatches']) })

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end justify-between bg-card p-4 rounded-xl border border-border shadow-auth-surface-shadow">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Category</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option>All Categories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Court</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option>All Courts</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option>Scheduled</option>
            </select>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors border border-border text-sm font-medium">
          <Filter className="w-4 h-4" /> More Filters
        </button>
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_MATCHES.map(match => (
          <div key={match.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground tracking-wider">
              <span>MATCH {match.id} • {match.category} • {match.court}</span>
              <span className={`px-2 py-1 rounded text-[10px] ${match.status === 'READY' ? 'bg-chart-4/20 text-chart-4' : 'bg-secondary text-secondary-foreground'}`}>
                {match.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-bold">{match.player1.charAt(0)}</div>
                <div className="text-center">
                  <p className="font-bold text-sm truncate w-full">{match.player1}</p>
                  <p className="text-xs text-muted-foreground">Seed {match.seed1}</p>
                </div>
              </div>
              <div className="text-xl font-black text-muted-foreground w-1/3 text-center">VS</div>
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-bold">{match.player2.charAt(0)}</div>
                <div className="text-center">
                  <p className="font-bold text-sm truncate w-full">{match.player2}</p>
                  <p className="text-xs text-muted-foreground">Seed {match.seed2}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" /> Ref: {match.ref}
              </p>
              <button 
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${match.status === 'READY' ? 'bg-primary text-primary-foreground shadow-[var(--auth-primary-glow)]' : 'bg-secondary text-secondary-foreground border border-border'}`}
              >
                {match.status === 'READY' ? 'Start Match' : 'Prep Match'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}