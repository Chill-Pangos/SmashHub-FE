import { useEffect, useState } from "react";
import MatchControlCenterTab from "./TournamentDetailTabs/MatchControlCenterTab";
import MatchResultsReviewTab from "./TournamentDetailTabs/MatchResultsReviewTab";
import LiveScoreControllerTab from "./TournamentDetailTabs/LiveScoreControllerTab";
import ResultsSubmissionTab from "./TournamentDetailTabs/ResultsSubmissionTab";
import PlayersTab from "./TournamentDetailTabs/PlayersTab";
import RefereesTab from "./TournamentDetailTabs/RefereesTab";
import { Calendar, MapPin, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTournament, useScheduleConfigByTournament } from "@/hooks/queries";

import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/useDateFormat";

export default function TournamentDetail() {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  const { data: tournament, isLoading, error } = useTournament(id);
  const { data: scheduleConfig } = useScheduleConfigByTournament(id, { enabled: !!id });

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

  const formatEventDate = (start?: string, end?: string) => {
    if (!start && !end) return "TBD";
    if (start && end) {
      return `${formatDateTime(start)} - ${formatDateTime(end)}`;
    } else if (start) {
      return formatDateTime(start);
    }
    return "TBD";
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-muted-foreground animate-pulse">Loading tournament details...</p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-destructive/20 bg-card p-6">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <p className="text-destructive font-medium">{error?.message || "Failed to load tournament"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col gap-6">
      {/* 1. HEADER SECTION */}
      <div className="space-y-4">
        {/* Status & ID Badge */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {t(`constants.status.tournament.${tournament.status}`, tournament.status) as string}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ID: TRN-{new Date(tournament.createdAt).getFullYear()}-{tournament.id.toString().padStart(3, "0")}
          </span>
          <span className="ml-auto text-sm font-bold text-primary border border-primary px-3 py-1 rounded-full">
            {role === "chief_referee" ? t("referee.tournamentDetail.chiefRefereeDashboard", "Chief Referee Dashboard") : t("referee.tournamentDetail.refereeDashboard", "Referee Dashboard")}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tournament.name}
        </h1>

        {/* Date & Location Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatEventDate(scheduleConfig?.startDate || tournament.startDate, scheduleConfig?.endDate || tournament.endDate)}</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{tournament.location}</span>
          </div>
        </div>
      </div>
      {/* Custom Tabs Navigation */}
      <div className="flex gap-2 border-b border-border">
        {role === "chief_referee" ? (
          <>
            <button
              onClick={() => setActiveTab("control_center")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "control_center" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t("referee.tournamentDetail.matchControlCenter", "Match Control Center")}
            </button>
            <button
              onClick={() => setActiveTab("results_review")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "results_review" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t("referee.tournamentDetail.approvalDashboard", "Approval Dashboard")}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("live_score")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "live_score" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t("referee.tournamentDetail.liveScoreController", "Live Score Controller")}
            </button>
            <button
              onClick={() => setActiveTab("results_submission")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "results_submission" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t("referee.tournamentDetail.finalSubmission", "Final Submission")}
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab("players")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "players" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {t("referee.tournamentDetail.players", "Players")}
        </button>
        <button
          onClick={() => setActiveTab("referees")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "referees" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {t("referee.tournamentDetail.referees", "Referees")}
        </button>
      </div>

      {/* Tab Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === "control_center" && <MatchControlCenterTab />}
        {activeTab === "results_review" && <MatchResultsReviewTab />}
        {activeTab === "live_score" && <LiveScoreControllerTab />}
        {activeTab === "results_submission" && <ResultsSubmissionTab />}
        {activeTab === "players" && <PlayersTab tournamentId={id} />}
        {activeTab === "referees" && <RefereesTab tournamentId={id} />}
      </main>
    </div>
  );
}
