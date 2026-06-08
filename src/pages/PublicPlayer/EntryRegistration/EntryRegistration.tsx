import { ArrowLeft, Search, X, Check, Lock, Trophy } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function EntryRegistration() {
  const { tournamentId } = useParams();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" />
        <Link to={`/tournaments/${tournamentId}`}>Back to Categories</Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Doubles Registration
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/20">
                Step 2: Partner Selection
              </span>
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-cyan-400"></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-sm mb-4">Find Partner</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or player ID..."
                className="w-full pl-9 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-shadow"
              />
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Selected Partner</h3>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-xs font-semibold">
                <Check className="h-3 w-3" />
                Pending Confirmation
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden border border-border flex items-center justify-center">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
                    alt="Marcus Chen"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Marcus Chen</span>
                  <span className="text-sm text-muted-foreground">ID: SH-8821</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded text-foreground">
                      ELO 2140
                    </span>
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                      PRO
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-6">
              Registration Summary
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="w-12 h-12 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Trophy className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-cyan-400">
                    Tournament
                  </span>
                  <span className="font-bold text-foreground">
                    Genesis X Championship
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Oct 12-14 • Neo Tokyo Arena
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground">Men's Doubles</span>
              </div>
              
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="text-foreground">$45.00</span>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-sm font-semibold text-muted-foreground">Total Due</span>
                <span className="text-3xl font-bold text-cyan-400">$45.00</span>
              </div>

              <div className="pt-4">
                <button className="w-full bg-cyan-400 text-cyan-950 font-bold py-3 rounded-lg hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm Registration
                </button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Payment will be requested in the next step
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
