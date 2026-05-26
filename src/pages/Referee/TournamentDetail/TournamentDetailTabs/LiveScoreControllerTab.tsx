import { useState } from 'react';

// MOCK DATA
const MATCH = {
  p1: 'Alex Mercer', seed1: 1, p1Score: 40, p1Sets: 1, p1Games: 4,
  p2: 'Julian Thorne', seed2: 4, p2Score: 30, p2Sets: 0, p2Games: 3,
  time: '00:45:12', currentSet: 2, p1Serving: true
};

export default function LiveScoreControllerTab() {
  // 🟢 REACT QUERY:
  // const { data: activeMatch } = useQuery({ queryKey: ['activeMatch', refId] })
  // const updateScoreMutation = useMutation({ mutationFn: updateScore })

  // Mock UI state (để demo thao tác click hiện list bên trên hoặc vào thẳng score)
  const [showActiveMatch] = useState(true); 

  if (!showActiveMatch) {
    return <div className="text-muted-foreground p-10 text-center border border-dashed border-border rounded-xl">No active matches to track. Select a match from schedule to start.</div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Score Boards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
        {/* Player 1 */}
        <div className="bg-card border border-primary/30 rounded-2xl p-6 relative overflow-hidden shadow-[var(--auth-primary-glow)]">
           <div className="absolute top-4 left-4 text-xs font-bold text-muted-foreground">SEED {MATCH.seed1}</div>
           {MATCH.p1Serving && <div className="absolute top-4 right-4 bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold flex items-center gap-1">🎾 SERVING</div>}
           <div className="flex flex-col items-center mt-6">
             <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary mb-3"></div>
             <h3 className="text-xl font-bold mb-4">{MATCH.p1}</h3>
             <div className="flex items-center gap-6">
               <button className="w-10 h-10 rounded-full bg-secondary text-xl font-bold hover:bg-muted">-</button>
               <span className="text-5xl font-black text-primary font-mono">{MATCH.p1Score}</span>
               <button className="w-10 h-10 rounded-full bg-primary/20 text-primary text-xl font-bold hover:bg-primary/40">+</button>
             </div>
             <p className="text-xs text-muted-foreground mt-4 font-semibold">Sets: {MATCH.p1Sets} • Games: {MATCH.p1Games}</p>
           </div>
        </div>

        {/* Center Panel */}
        <div className="bg-secondary/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between">
           <div className="w-full flex justify-between items-center text-xs font-bold text-muted-foreground">
             <span>CURRENT SET ({MATCH.currentSet})</span>
             <span className="font-mono text-foreground">{MATCH.time}</span>
           </div>
           
           <div className="flex items-center gap-6 my-6">
             <div className="text-center">
                <span className="text-3xl font-bold">4</span>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">MERCER</p>
             </div>
             <span className="text-2xl font-black text-muted-foreground">-</span>
             <div className="text-center">
                <span className="text-3xl font-bold">3</span>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">THORNE</p>
             </div>
           </div>
        </div>

        {/* Player 2 */}
        <div className="bg-card border border-border rounded-2xl p-6 relative">
           <div className="absolute top-4 left-4 text-xs font-bold text-muted-foreground">SEED {MATCH.seed2}</div>
           <div className="flex flex-col items-center mt-6">
             <div className="w-20 h-20 rounded-full bg-secondary border border-border mb-3 opacity-80"></div>
             <h3 className="text-xl font-bold mb-4 opacity-80">{MATCH.p2}</h3>
             <div className="flex items-center gap-6 opacity-80">
               <button className="w-10 h-10 rounded-full bg-secondary text-xl font-bold hover:bg-muted">-</button>
               <span className="text-5xl font-black font-mono">{MATCH.p2Score}</span>
               <button className="w-10 h-10 rounded-full bg-secondary text-foreground text-xl font-bold hover:bg-muted">+</button>
             </div>
             <p className="text-xs text-muted-foreground mt-4 font-semibold opacity-80">Sets: {MATCH.p2Sets} • Games: {MATCH.p2Games}</p>
           </div>
        </div>
      </div>

      

      <div className="bg-card border border-border rounded-xl p-5">
         <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Match Overview</h3>
          <span className="text-xs text-muted-foreground font-semibold">Best of 3 Sets</span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground font-bold border-b border-border">
            <tr>
              <th className="pb-3">Player</th>
              <th className="pb-3 text-center">Set 1</th>
              <th className="pb-3 text-center text-primary">Set 2 (Live)</th>
              <th className="pb-3 text-center">Set 3</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span> Alex Mercer</td>
              <td className="py-3 text-center font-mono text-lg">6</td>
              <td className="py-3 text-center font-mono text-lg font-bold text-primary">4</td>
              <td className="py-3 text-center text-muted-foreground">-</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold opacity-80">Julian Thorne</td>
              <td className="py-3 text-center font-mono text-lg opacity-80">4</td>
              <td className="py-3 text-center font-mono text-lg opacity-80">3</td>
              <td className="py-3 text-center text-muted-foreground">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}