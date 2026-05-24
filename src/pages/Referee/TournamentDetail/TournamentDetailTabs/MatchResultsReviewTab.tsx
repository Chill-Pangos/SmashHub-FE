import { useState } from "react";
import { Filter, CheckCircle, X } from "lucide-react";

const MOCK_PENDING = [
  {
    id: "#4092",
    p1: "J. Doe",
    p2: "M. Smith",
    score: "3 - 1",
    status: "PENDING",
    time: "10m ago",
    court: "Court 4",
  },
  {
    id: "#4091",
    p1: "S. Williams",
    p2: "A. Chen",
    score: "-",
    status: "DISPUTED",
    time: "25m ago",
    court: "Court 1",
  },
];

export default function MatchResultsReviewTab() {
  const [selectedMatch, setSelectedMatch] = useState(MOCK_PENDING[0]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const detailContent = (
    <>
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <p className="text-sm text-muted-foreground font-bold">
            Match Details
          </p>
          <h2 className="text-2xl font-black text-foreground">
            Match {selectedMatch.id}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground font-bold">Duration</p>
          <p className="text-lg font-semibold">1h 14m</p>
        </div>
      </div>

      <div className="bg-background rounded-xl p-6 border border-border mb-6 flex justify-between items-center shrink-0">
        <div className="flex flex-col items-center w-1/3">
          <div className="w-16 h-16 rounded-full bg-secondary mb-2 ring-2 ring-primary ring-offset-2 ring-offset-background"></div>
          <p className="font-bold">{selectedMatch.p1}</p>
          <p className="text-xs text-primary font-bold">Winner</p>
        </div>
        <div className="text-5xl font-black font-mono w-1/3 text-center">
          {selectedMatch.score}
        </div>
        <div className="flex flex-col items-center w-1/3 opacity-50">
          <div className="w-16 h-16 rounded-full bg-secondary mb-2"></div>
          <p className="font-bold">{selectedMatch.p2}</p>
        </div>
      </div>

      <h3 className="font-bold text-sm mb-3 shrink-0">Set Breakdown</h3>
      <div className="grid grid-cols-4 gap-2 mb-6 shrink-0">
        {["11-8", "11-9", "6-11", "12-10"].map((score, i) => (
          <div
            key={i}
            className="bg-secondary/50 border border-border rounded-lg p-3 text-center"
          >
            <p className="text-[10px] text-muted-foreground font-bold mb-1">
              SET {i + 1}
            </p>
            <p className="font-bold text-lg">{score}</p>
          </div>
        ))}
      </div>

      <h3 className="font-bold text-sm mb-3 flex items-center gap-2 shrink-0">
        ELO Impact Preview
      </h3>
      <div className="flex gap-4 mb-8 shrink-0">
        <div className="flex-1 bg-background border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{selectedMatch.p1}</p>
            <p className="text-xs text-muted-foreground">
              1450 → <span className="text-foreground">1474</span>
            </p>
          </div>
          <span className="text-chart-3 font-bold">+24</span>
        </div>
        <div className="flex-1 bg-background border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{selectedMatch.p2}</p>
            <p className="text-xs text-muted-foreground">
              1510 → <span className="text-foreground">1492</span>
            </p>
          </div>
          <span className="text-destructive font-bold">-18</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-border shrink-0">
        <button className="px-6 py-2 rounded-md font-semibold text-destructive border border-destructive/50 hover:bg-destructive/10 transition-colors">
          Reject
        </button>
        <button className="px-6 py-2 rounded-md font-semibold text-chart-4 border border-chart-4/50 hover:bg-chart-4/10 transition-colors">
          Dispute
        </button>
        <button className="px-8 py-2 rounded-md font-semibold bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2 shadow-[var(--auth-primary-glow)]">
          <CheckCircle className="w-4 h-4" /> Approve
        </button>
      </div>
    </>
  );

  // 🟢 REACT QUERY:
  // const { data: pendingMatches } = useQuery({ queryKey: ['pendingMatches'], queryFn: fetchPending })
  // const approveMutation = useMutation({ mutationFn: approveMatch, onSuccess: () => { ... } })

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] lg:overflow-hidden">
      {/* Left Sidebar: List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">
            Pending Verification
          </h2>
          <div className="flex gap-2">
            <button className="bg-secondary p-1.5 rounded">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-10">
          {MOCK_PENDING.map((match) => (
            <div
              key={match.id}
              onClick={() => {
                setSelectedMatch(match);
                setIsDetailOpen(true);
              }}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 flex justify-between items-center ${selectedMatch.id === match.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/50"}`}
            >
              <div className="flex gap-4">
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-muted-foreground font-bold">
                    ID
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {match.id}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {match.p1}{" "}
                    <span className="text-muted-foreground mx-1">⚔</span>{" "}
                    {match.p2}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${match.status === "PENDING" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}
                    >
                      {match.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {match.court} • {match.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black">{match.score}</p>
                <p className="text-[10px] text-muted-foreground">Final Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area: Detail & Actions */}
      <div className="hidden lg:flex w-2/3 bg-card border border-border rounded-xl p-6 flex-col h-full overflow-y-auto">
        {detailContent}
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity ${isDetailOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsDetailOpen(false)}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] bg-card border-t border-border rounded-t-2xl p-4 overflow-y-auto transition-transform duration-300 ${isDetailOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-card pb-2 z-10">
            <p className="text-sm font-bold text-foreground">Match Detail</p>
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              className="p-2 rounded-md hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {detailContent}
        </div>
      </div>
    </div>
  );
}
