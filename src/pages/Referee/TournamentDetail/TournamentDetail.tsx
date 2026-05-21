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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth, useRole } from "@/store";
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

  // Detect if user is chief referee
  const chiefRefereeRoleId = getRoleByName("chief_referee")?.id;
  const isChiefReferee = Boolean(
    chiefRefereeRoleId && user?.roles?.includes(chiefRefereeRoleId),
  );

  // TODO: Fetch tournament data
  // const { data: tournament, isLoading, error } = useQuery(...)

  return (
    <div className="w-full space-y-6">
      {/* Tournament Header */}
      <div className="rounded-2xl border border-border/30 bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Tournament Name</h1>
        <p className="text-muted-foreground mt-2">
          TODO: Display tournament header with basic info
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b">
          {/* Base tabs - all referees */}
          <TabsTrigger value="overview">
            {t("tournament.basicInfo")}
          </TabsTrigger>
          <TabsTrigger value="schedule">{t("nav.schedule")}</TabsTrigger>
          <TabsTrigger value="standings">
            {t("tournament.standings")}
          </TabsTrigger>

          {/* Referee-only tabs */}
          {!isChiefReferee && (
            <>
              <TabsTrigger value="live-score">
                {t("referee.liveScoreController")}
              </TabsTrigger>
              <TabsTrigger value="results-submission">
                {t("referee.resultsSubmission")}
              </TabsTrigger>
            </>
          )}

          {/* Chief Referee-only tabs */}
          {isChiefReferee && (
            <>
              <TabsTrigger value="match-control">
                {t("referee.matchControlCenter")}
              </TabsTrigger>
              <TabsTrigger value="results-review">
                {t("referee.matchResultsReview")}
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Base Tab Contents */}
        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <ScheduleTab />
        </TabsContent>

        <TabsContent value="standings" className="mt-6">
          <StandingsTab />
        </TabsContent>

        {/* Referee-only Tabs */}
        {!isChiefReferee && (
          <>
            <TabsContent value="live-score" className="mt-6">
              <LiveScoreControllerTab />
            </TabsContent>

            <TabsContent value="results-submission" className="mt-6">
              <ResultsSubmissionTab />
            </TabsContent>
          </>
        )}

        {/* Chief Referee-only Tabs */}
        {isChiefReferee && (
          <>
            <TabsContent value="match-control" className="mt-6">
              <MatchControlCenterTab />
            </TabsContent>

            <TabsContent value="results-review" className="mt-6">
              <MatchResultsReviewTab />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
