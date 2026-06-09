import { useMatchesByStatus } from '@/hooks/queries';

export default function LiveScoreControllerTab() {
  const { data: activeMatchesData, isLoading } = useMatchesByStatus('in_progress', 1, 1);
  const activeMatch = activeMatchesData?.rows?.[0];

  // INCOMPLETE MAPPING: We need specific API endpoints or WebSockets for detailed live scoring (points per game/set).
  // Currently we only have match-level status and setsWonA/setsWonB.

  if (isLoading) {
    return <div className="text-muted-foreground p-10 text-center border border-dashed border-border rounded-xl">Loading active match...</div>
  }

  if (!activeMatch) {
    return <div className="text-muted-foreground p-10 text-center border border-dashed border-border rounded-xl">No active matches to track. Select a match from schedule to start.</div>
  }

  const p1Name = activeMatch.entryA?.team?.name || "Player 1";
  const p2Name = activeMatch.entryB?.team?.name || "Player 2";
  const setsWonA = activeMatch.setsWonA || 0;
  const setsWonB = activeMatch.setsWonB || 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Score Boards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
        {/* Player 1 */}
        <div className="bg-card border border-primary/30 rounded-2xl p-6 relative overflow-hidden shadow-[var(--auth-primary-glow)]">
           <div className="flex flex-col items-center mt-6">
             <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary mb-3 flex items-center justify-center text-2xl font-bold">{p1Name.charAt(0)}</div>
             <h3 className="text-xl font-bold mb-4">{p1Name}</h3>
             <div className="flex items-center gap-6">
               <button className="w-10 h-10 rounded-full bg-secondary text-xl font-bold hover:bg-muted">-</button>
               <span className="text-5xl font-black text-primary font-mono">{setsWonA}</span>
               <button className="w-10 h-10 rounded-full bg-primary/20 text-primary text-xl font-bold hover:bg-primary/40">+</button>
             </div>
             <p className="text-xs text-muted-foreground mt-4 font-semibold">Match Sets Won</p>
           </div>
        </div>

        {/* Center Panel */}
        <div className="bg-secondary/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
           <div className="w-full flex justify-between items-center text-xs font-bold text-muted-foreground mb-4">
             <span>LIVE MATCH</span>
             <span className="font-mono text-foreground">#{activeMatch.id}</span>
           </div>
           
           <div className="flex items-center gap-6 my-6">
             <div className="text-center">
                <span className="text-3xl font-bold">{setsWonA}</span>
             </div>
             <span className="text-2xl font-black text-muted-foreground">-</span>
             <div className="text-center">
                <span className="text-3xl font-bold">{setsWonB}</span>
             </div>
           </div>
           <p className="text-xs text-muted-foreground mt-4 text-center">
             Detailed sub-match point tracking is currently pending API integration.
           </p>
        </div>

        {/* Player 2 */}
        <div className="bg-card border border-border rounded-2xl p-6 relative">
           <div className="flex flex-col items-center mt-6">
             <div className="w-20 h-20 rounded-full bg-secondary border border-border mb-3 opacity-80 flex items-center justify-center text-2xl font-bold">{p2Name.charAt(0)}</div>
             <h3 className="text-xl font-bold mb-4 opacity-80">{p2Name}</h3>
             <div className="flex items-center gap-6 opacity-80">
               <button className="w-10 h-10 rounded-full bg-secondary text-xl font-bold hover:bg-muted">-</button>
               <span className="text-5xl font-black font-mono">{setsWonB}</span>
               <button className="w-10 h-10 rounded-full bg-secondary text-foreground text-xl font-bold hover:bg-muted">+</button>
             </div>
             <p className="text-xs text-muted-foreground mt-4 font-semibold opacity-80">Match Sets Won</p>
           </div>
        </div>
      </div>
    </div>
  );
}