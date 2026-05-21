/**
 * Tournament Detail Page (Referee Portal)
 * View-only tournament details with role-specific tabs
 *
 * Architecture:
 * - Use tabs system (similar to Organizer's TournamentDetail)
 * - Fetch tournament data: GET /tournaments/:id
 * - Detect user role: is chief_referee or regular referee
 * - Import tabs from TournamentDetailTabs folder
 *
 * BASE TABS (all referees):
 * 1. OverviewTab - Basic tournament information (view-only)
 * 2. ScheduleTab - Match schedule with filters (view-only)
 * 3. StandingsTab - Group standings, bracket, ELO leaderboard (view-only)
 *
 * REFEREE-ONLY TABS:
 * 4. LiveScoreControllerTab - Update scores for ongoing matches
 * 5. ResultsSubmissionTab - Submit completed match results for approval
 *
 * CHIEF REFEREE-ONLY TABS:
 * 6. MatchControlCenterTab - Monitor and manage upcoming matches
 * 7. MatchResultsReviewTab - Approve/reject submitted results with ELO preview
 *
 * State Management:
 * - Use React Query for tournament data fetch
 * - Use URL search param for active tab: ?tab=schedule (allows direct linking)
 * - Tournament ID from URL params
 *
 * Error Handling:
 * - Loading state: skeleton for tournament header + tab content
 * - 404: Tournament not found (redirect to tournaments list)
 * - Forbidden: Referee not assigned to this tournament (show error message)
 */

import { useState } from "react";
import { useParams } from "react-router-dom";
// Using Organizer-style nav buttons for exact tab styling
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth, useRole } from "@/store";
import { Calendar, MapPin } from "lucide-react";
import {
  OverviewTab,
  ScheduleTab,
  StandingsTab,
  LiveScoreControllerTab,
  ResultsSubmissionTab,
  MatchControlCenterTab,
  MatchResultsReviewTab,
} from "./TournamentDetailTabs";

export default function TournamentDetail() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getRoleByName } = useRole();
  const [activeTab, setActiveTab] = useState("overview");

  const tabClass = (value: string) =>
    `whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
      activeTab === value
        ? "border-primary text-foreground"
        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
    }`;

  // Detect if user is chief referee
  const chiefRefereeRoleId = getRoleByName("chief_referee")?.id;
  const isChiefReferee = Boolean(
    chiefRefereeRoleId && user?.roles?.includes(chiefRefereeRoleId),
  );

  // TODO: Fetch tournament data
  // const { data: tournament, isLoading, error } = useQuery(...)

  return (
    <div className="w-full space-y-6">
      {/* Tournament Header (styled like Organizer) */}
      <div className="rounded-2xl border border-border/30 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            DRAFT
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ID: TRN-000
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-3">
          Tournament Name
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Start - End</span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block"></div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>Location TBD</span>
          </div>
        </div>
      </div>

      {/* Tabs (Organizer-style nav for identical styling) */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={tabClass("overview")}
          >
            {t("tournament.basicInfo")}
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={tabClass("schedule")}
          >
            {t("nav.schedule")}
          </button>

          <button
            onClick={() => setActiveTab("standings")}
            className={tabClass("standings")}
          >
            {t("tournament.standings")}
          </button>

          {!isChiefReferee && (
            <>
              <button
                onClick={() => setActiveTab("live-score")}
                className={tabClass("live-score")}
              >
                {t("referee.liveScoreController")}
              </button>

              <button
                onClick={() => setActiveTab("results-submission")}
                className={tabClass("results-submission")}
              >
                {t("referee.resultsSubmission")}
              </button>
            </>
          )}

          {isChiefReferee && (
            <>
              <button
                onClick={() => setActiveTab("match-control")}
                className={tabClass("match-control")}
              >
                {t("referee.matchControlCenter")}
              </button>

              <button
                onClick={() => setActiveTab("results-review")}
                className={tabClass("results-review")}
              >
                {t("referee.matchResultsReview")}
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Tab Contents (manual render to match Organizer behavior) */}
      <div className="mt-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "standings" && <StandingsTab />}

        {!isChiefReferee && activeTab === "live-score" && (
          <LiveScoreControllerTab />
        )}

        {!isChiefReferee && activeTab === "results-submission" && (
          <ResultsSubmissionTab />
        )}

        {isChiefReferee && activeTab === "match-control" && (
          <MatchControlCenterTab />
        )}

        {isChiefReferee && activeTab === "results-review" && (
          <MatchResultsReviewTab />
        )}
      </div>
    </div>
  );
}
