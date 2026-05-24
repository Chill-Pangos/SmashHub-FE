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

  // 🟢 Giao diện chi tiết (Dùng chung cho cả Desktop panel và Mobile bottom sheet)
  const detailContent = (
    <>
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-primary">Final Submission</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review set scores before official commitment to the ledger.
          </p>
        </div>
        <span className="bg-chart-4/20 text-chart-4 text-xs font-bold px-3 py-1 rounded-full">
          Match ID: {selectedMatch.id}
        </span>
      </div>

      <div className="bg-background border border-border rounded-xl p-8 flex justify-between items-center relative overflow-hidden mb-6 shrink-0">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          Final
        </div>

        <div className="flex flex-col items-center gap-3 w-1/3 z-10">
          <div className="w-20 h-20 rounded-full bg-secondary border border-border"></div>
          <div className="text-center">
            <h3 className="font-bold text-lg">{selectedMatch.p1}</h3>
            <p className="text-xs text-muted-foreground">
              Seed #{selectedMatch.seed1}
            </p>
          </div>
          <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-2xl font-black shadow-inner">
            {selectedMatch.p1Sets}
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center z-10 border border-border text-muted-foreground transform rotate-45">
          <span className="block transform -rotate-45 text-xs font-bold">
            VS
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 w-1/3 z-10 opacity-70">
          <div className="w-20 h-20 rounded-full bg-secondary border border-border"></div>
          <div className="text-center">
            <h3 className="font-bold text-lg">{selectedMatch.p2}</h3>
            <p className="text-xs text-muted-foreground">
              Seed #{selectedMatch.seed2}
            </p>
          </div>
          <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-2xl font-black">
            {selectedMatch.p2Sets}
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
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              </td>
              <td className="py-4 text-center font-mono font-bold text-lg">
                6
              </td>
              <td className="py-4 text-center font-mono font-bold text-lg">
                3
              </td>
              <td className="py-4 text-center font-mono font-bold text-lg">
                7 <br />
                <span className="text-[10px] text-primary font-normal">
                  (7)
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-4 font-semibold text-muted-foreground">
                {selectedMatch.p2}
              </td>
              <td className="py-4 text-center font-mono text-lg text-muted-foreground">
                4
              </td>
              <td className="py-4 text-center font-mono text-lg text-muted-foreground">
                6
              </td>
              <td className="py-4 text-center font-mono text-lg text-muted-foreground">
                6 <br />
                <span className="text-[10px] font-normal">(5)</span>
              </td>
            </tr>
          </tbody>
        </table>
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
              <p
                className={`font-semibold text-sm ${verifiedScores ? "text-foreground" : "text-muted-foreground"}`}
              >
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
              <p
                className={`font-semibold text-sm ${signaturesLogged ? "text-foreground" : "text-muted-foreground"}`}
              >
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
              <p
                className={`font-semibold text-sm ${conductClean ? "text-foreground" : "text-muted-foreground"}`}
              >
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

  // 🟢 REACT QUERY:
  // const { data: completedMatchesAwaitingSubmission } = useQuery(...)
  // const submitMatchMutation = useMutation({ mutationFn: submitToLedger })

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
                  <span className="text-[10px] text-muted-foreground font-bold">
                    ID
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {match.id}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm mt-1">
                    {match.p1}{" "}
                    <span className="text-muted-foreground mx-1">vs</span>{" "}
                    {match.p2}
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
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] bg-card border-t border-border rounded-t-2xl  overflow-y-auto transition-transform duration-300 ${isDetailOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between sticky top-0 bg-card p-4 z-30">
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
          <div className="p-4">{detailContent}</div>
        </div>
      </div>
    </div>
  );
}
