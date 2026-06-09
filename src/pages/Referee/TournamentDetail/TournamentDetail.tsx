import { useEffect, useState } from "react";
import MatchControlCenterTab from "./TournamentDetailTabs/MatchControlCenterTab";
import MatchResultsReviewTab from "./TournamentDetailTabs/MatchResultsReviewTab";
import LiveScoreControllerTab from "./TournamentDetailTabs/LiveScoreControllerTab";
import ResultsSubmissionTab from "./TournamentDetailTabs/ResultsSubmissionTab";
import { Search } from "lucide-react";

import { useCurrentUser } from "@/hooks/queries/useAuthQueries";

export default function TournamentDetail() {
  const { data: userData } = useCurrentUser();
  const roleItem = userData?.roles?.[0];
  const roleName = typeof roleItem === 'object' ? roleItem?.name : undefined;
  
  // Determine role based on actual user roles, fallback to referee
  const [role, setRole] = useState<"chief_referee" | "referee">("referee");

  useEffect(() => {
    if (roleName === "chief_referee" || roleName === "CHIEF_REFEREE") {
      setRole("chief_referee");
    } else {
      setRole("referee");
    }
  }, [roleName]);

  const [activeTab, setActiveTab] = useState<string>(
    role === "chief_referee" ? "control_center" : "live_score",
  );

  useEffect(() => {
    setActiveTab(role === "chief_referee" ? "control_center" : "live_score");
  }, [role]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col gap-6">
      {/* Header dùng chung */}
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">
          {role === "chief_referee"
            ? "Chief Referee Dashboard"
            : "Referee Dashboard"}
        </h1>
        <div className="flex items-center gap-4">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search matches..."
              className="bg-input border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </header>

      {/* Custom Tabs Navigation */}
      <div className="flex gap-2 border-b border-border">
        {role === "chief_referee" ? (
          <>
            <button
              onClick={() => setActiveTab("control_center")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "control_center" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Match Control Center
            </button>
            <button
              onClick={() => setActiveTab("results_review")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "results_review" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Approval Dashboard
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("live_score")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "live_score" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Live Score Controller
            </button>
            <button
              onClick={() => setActiveTab("results_submission")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "results_submission" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Final Submission
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === "control_center" && <MatchControlCenterTab />}
        {activeTab === "results_review" && <MatchResultsReviewTab />}
        {activeTab === "live_score" && <LiveScoreControllerTab />}
        {activeTab === "results_submission" && <ResultsSubmissionTab />}
      </main>
    </div>
  );
}
