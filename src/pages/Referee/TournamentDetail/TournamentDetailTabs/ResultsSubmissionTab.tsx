import { useState } from "react";
import { Check, X } from "lucide-react";

const SUBMISSION_QUEUE = [
  {
    id: "#992-B",
    p1: "Elena Rybakina",
    p2: "Aryna Sabalenka",
    seed1: 3,
    seed2: 2,
    p1Sets: 2,
    p2Sets: 1,
    court: "Court A",
    finishedAt: "5m ago",
    status: "READY",
  },
  {
    id: "#991-A",
    p1: "Iga Swiatek",
    p2: "Coco Gauff",
    seed1: 1,
    seed2: 4,
    p1Sets: 2,
    p2Sets: 0,
    court: "Court C",
    finishedAt: "18m ago",
    status: "RECHECK",
  },
  {
    id: "#988-C",
    p1: "Naomi Osaka",
    p2: "Jessica Pegula",
    seed1: 6,
    seed2: 7,
    p1Sets: 2,
    p2Sets: 1,
    court: "Court B",
    finishedAt: "27m ago",
    status: "READY",
  },
];

export default function ResultsSubmissionTab() {
  const [selectedMatch, setSelectedMatch] = useState(SUBMISSION_QUEUE[0]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [verifiedScores, setVerifiedScores] = useState(true);
  const [signaturesLogged, setSignaturesLogged] = useState(true);
  const [conductClean, setConductClean] = useState(false);

  const p1Wins = selectedMatch.p1Sets > selectedMatch.p2Sets;
  const p2Wins = selectedMatch.p2Sets > selectedMatch.p1Sets;

  const detailContent = (
    <>
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-foreground">Final Submission</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review set scores before official commitment to the ledger.
          </p>
        </div>
        <span className="bg-chart-4/20 text-chart-4 text-xs font-bold px-3 py-1 rounded-full mt-1">
          Match ID: {selectedMatch.id}
        </span>
      </div>

      <div className="bg-background rounded-xl p-6 border border-border mb-6 flex justify-between items-center shrink-0">
        <div className={`flex flex-col items-center w-1/3 ${p2Wins ? 'opacity-50' : ''}`}>
          <div className={`w-16 h-16 rounded-full bg-secondary mb-2 ${p1Wins ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}></div>
          <p className="font-bold">{selectedMatch.p1}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold">Seed #{selectedMatch.seed1}</span>
            {p1Wins && <span className="text-[10px] text-primary font-bold uppercase">Winner</span>}
          </div>
        </div>
        
        <div className="text-5xl font-black font-mono w-1/3 text-center">
          {selectedMatch.p1Sets} - {selectedMatch.p2Sets}
        </div>

        <div className={`flex flex-col items-center w-1/3 ${p1Wins ? 'opacity-50' : ''}`}>
          <div className={`w-16 h-16 rounded-full bg-secondary mb-2 ${p2Wins ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}></div>
          <p className="font-bold">{selectedMatch.p2}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {p2Wins && <span className="text-[10px] text-primary font-bold uppercase">Winner</span>}
            <span className="text-[10px] text-muted-foreground font-semibold">Seed #{selectedMatch.seed2}</span>
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 mb-6 shrink-0">
        <h3 className="font-bold flex items-center gap-2 mb-6">
          Set Breakdown
        </h3>
        <table className="w-full text-left">
          <thead className="text-xs text-muted-foreground font-bold border-b border-border">
            <tr>
              <th className="pb-4">Player</th>
              <th className="pb-4 text-center">Set 1</th>
              <th className="pb-4 text-center">Set 2</th>
              <th className="pb-4 text-center">Set 3</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-4 font-semibold text-foreground flex items-center gap-2">
                {selectedMatch.p1}{" "}
                {p1Wins && <span className="w-2 h-2 bg-primary rounded-full"></span>}
              </td>
              <td className="py-4 text-center font-mono font-bold text-lg">6</td>
              <td className="py-4 text-center font-mono font-bold text-lg">3</td>
              <td className="py-4 text-center font-mono font-bold text-lg">
                7 <br />
                <span className="text-[10px] text-primary font-normal">(7)</span>
              </td>
            </tr>
            <tr>
              <td className="py-4 font-semibold text-muted-foreground">
                {selectedMatch.p2}
                {p2Wins && <span className="w-2 h-2 bg-primary rounded-full ml-2"></span>}
              </td>
              <td className="py-4 text-center font-mono text-lg text-muted-foreground">4</td>
              <td className="py-4 text-center font-mono text-lg text-muted-foreground">6</td>
              <td className="py-4 text-center font-mono text-lg text-muted-foreground">
                6 <br />
                <span className="text-[10px] font-normal">(5)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔴 Bổ sung khối ELO Impact Preview từ MatchResultsReviewTab */}
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2 shrink-0">
        ELO Impact Preview
      </h3>
      <div className="flex gap-4 mb-8 shrink-0">
        <div className="flex-1 bg-background border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{selectedMatch.p1}</p>
            <p className="text-xs text-muted-foreground">
              {p1Wins ? '1450 → ' : '1474 → '}
              <span className="text-foreground">{p1Wins ? '1474' : '1450'}</span>
            </p>
          </div>
          <span className={`font-bold ${p1Wins ? 'text-chart-3' : 'text-destructive'}`}>
            {p1Wins ? '+24' : '-24'}
          </span>
        </div>
        <div className="flex-1 bg-background border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{selectedMatch.p2}</p>
            <p className="text-xs text-muted-foreground">
              {p2Wins ? '1492 → ' : '1510 → '}
              <span className="text-foreground">{p2Wins ? '1510' : '1492'}</span>
            </p>
          </div>
          <span className={`font-bold ${p2Wins ? 'text-chart-3' : 'text-destructive'}`}>
            {p2Wins ? '+18' : '-18'}
          </span>
        </div>
      </div>

      <div className="border border-border rounded-xl p-6 flex flex-col bg-card shrink-0">
        <h3 className="font-bold text-lg mb-6">Validation Checklist</h3>

        <div className="flex flex-col gap-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 transition-colors ${verifiedScores ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border group-hover:border-primary"}`}
              onClick={() => setVerifiedScores(!verifiedScores)}
            >
              {verifiedScores && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <div>
              <p className={`font-semibold text-sm ${verifiedScores ? "text-foreground" : "text-muted-foreground"}`}>
                Verify Set Scores
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Scores match physical card.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 transition-colors ${signaturesLogged ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border group-hover:border-primary"}`}
              onClick={() => setSignaturesLogged(!signaturesLogged)}
            >
              {signaturesLogged && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <div>
              <p className={`font-semibold text-sm ${signaturesLogged ? "text-foreground" : "text-muted-foreground"}`}>
                Player Signatures Logged
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Both competitors acknowledged.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 transition-colors ${conductClean ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border group-hover:border-primary"}`}
              onClick={() => setConductClean(!conductClean)}
            >
              {conductClean && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <div>
              <p className={`font-semibold text-sm ${conductClean ? "text-foreground" : "text-muted-foreground"}`}>
                Code of Conduct Clean
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No violations to report.
              </p>
            </div>
          </label>
        </div>

        <div className="bg-secondary/30 border border-chart-4/30 rounded-lg p-4 mb-4 mt-8">
          <p className="text-xs font-bold text-chart-4 flex items-center gap-1 mb-1">
            ⚠️ Irreversible Action
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Submitting this card will finalize the match and update global
            rankings.
          </p>
        </div>

        <button
          disabled={!verifiedScores || !signaturesLogged}
          className="w-full py-3 rounded-lg font-bold text-sm bg-primary text-primary-foreground shadow-[var(--auth-primary-glow)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Submit Official Card
        </button>
      </div>
    </>
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] lg:overflow-hidden relative">
      {/* Left Sidebar: List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Awaiting Final Submission
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Select a completed match card to finalize.
          </p>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-10">
          {SUBMISSION_QUEUE.map((match) => (
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
                  <span className="text-[10px] text-muted-foreground font-bold">ID</span>
                  <span className="text-sm font-bold text-primary">{match.id}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm mt-1">
                    {match.p1} <span className="text-muted-foreground mx-1">vs</span> {match.p2}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${match.status === "READY" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}
                    >
                      {match.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {match.court} • Completed {match.finishedAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black">
                  {match.p1Sets} - {match.p2Sets}
                </p>
                <p className="text-[10px] text-muted-foreground">Final Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area (Desktop): Detail & Actions */}
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
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] bg-card border-t border-border rounded-t-2xl overflow-y-auto transition-transform duration-300 ${isDetailOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between sticky top-0 bg-card p-4 z-30 border-b border-border mb-4">
            <p className="text-sm font-bold text-foreground">
              Submission Detail
            </p>
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              className="p-2 rounded-md hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 pt-0">{detailContent}</div>
        </div>
      </div>
    </div>
  );
}