import type { TournamentFlowPhase } from "../types";

export const tournamentLifecycleFlow: TournamentFlowPhase[] = [
  {
    id: "setup",
    titleKey: "tournamentManager.fullFlow.phases.setup.title",
    descriptionKey: "tournamentManager.fullFlow.phases.setup.description",
    colorClass: "text-violet-500",
    steps: [
      {
        id: "create-tournament",
        titleKey: "tournamentManager.fullFlow.steps.createTournament.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.createTournament.description",
        actorKey: "tournamentManager.fullFlow.actors.organizer",
        endpoints: [
          { method: "POST", path: "/api/tournaments" },
          { method: "GET", path: "/api/tournaments" },
          { method: "GET", path: "/api/tournaments/{id}" },
        ],
      },
      {
        id: "setup-categories",
        titleKey: "tournamentManager.fullFlow.steps.setupCategories.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.setupCategories.description",
        actorKey: "tournamentManager.fullFlow.actors.organizer",
        endpoints: [
          { method: "POST", path: "/api/tournament-categories" },
          {
            method: "GET",
            path: "/api/tournament-categories/tournament/{tournamentId}",
          },
          { method: "PUT", path: "/api/tournament-categories/{id}" },
        ],
      },
      {
        id: "assign-referees-and-config",
        titleKey:
          "tournamentManager.fullFlow.steps.assignRefereesAndConfig.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.assignRefereesAndConfig.description",
        actorKey: "tournamentManager.fullFlow.actors.organizer",
        endpoints: [
          { method: "POST", path: "/api/tournament-referees/invite" },
          {
            method: "POST",
            path: "/api/tournament-referees/accept-invitation",
          },
          { method: "POST", path: "/api/schedule-configs" },
          {
            method: "POST",
            path: "/api/schedule-configs/{tournamentId}/schedule-config/validate",
          },
        ],
      },
    ],
  },
  {
    id: "registration",
    titleKey: "tournamentManager.fullFlow.phases.registration.title",
    descriptionKey:
      "tournamentManager.fullFlow.phases.registration.description",
    colorClass: "text-emerald-500",
    steps: [
      {
        id: "entry-registration",
        titleKey: "tournamentManager.fullFlow.steps.entryRegistration.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.entryRegistration.description",
        actorKey: "tournamentManager.fullFlow.actors.playerCaptain",
        endpoints: [
          { method: "POST", path: "/api/entries/register" },
          { method: "POST", path: "/api/entries/{entryId}/add-member" },
          {
            method: "POST",
            path: "/api/entries/join-requests/{joinRequestId}/respond",
          },
        ],
      },
      {
        id: "lineup-and-eligibility",
        titleKey: "tournamentManager.fullFlow.steps.lineupAndEligibility.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.lineupAndEligibility.description",
        actorKey: "tournamentManager.fullFlow.actors.organizerAndCaptain",
        endpoints: [
          { method: "POST", path: "/api/entries/{entryId}/confirm-lineup" },
          {
            method: "GET",
            path: "/api/entries/category/{categoryId}/eligible",
          },
          {
            method: "POST",
            path: "/api/entries/category/{categoryId}/disqualify",
          },
        ],
      },
      {
        id: "payment-review",
        titleKey: "tournamentManager.fullFlow.steps.paymentReview.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.paymentReview.description",
        actorKey: "tournamentManager.fullFlow.actors.organizerAndPlayer",
        endpoints: [
          { method: "POST", path: "/api/payments" },
          { method: "PUT", path: "/api/payments/{paymentId}/proof" },
          { method: "POST", path: "/api/payments/{paymentId}/confirm" },
          {
            method: "GET",
            path: "/api/payments/category/{categoryId}/stats",
          },
        ],
      },
    ],
  },
  {
    id: "preparation",
    titleKey: "tournamentManager.fullFlow.phases.preparation.title",
    descriptionKey: "tournamentManager.fullFlow.phases.preparation.description",
    colorClass: "text-cyan-500",
    steps: [
      {
        id: "status-transition",
        titleKey: "tournamentManager.fullFlow.steps.statusTransition.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.statusTransition.description",
        actorKey: "tournamentManager.fullFlow.actors.organizerAndSystem",
        endpoints: [
          { method: "GET", path: "/api/tournaments/upcoming-changes" },
          { method: "POST", path: "/api/tournaments/update-statuses" },
        ],
      },
      {
        id: "group-draw",
        titleKey: "tournamentManager.fullFlow.steps.groupDraw.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.groupDraw.description",
        actorKey: "tournamentManager.fullFlow.actors.organizer",
        endpoints: [
          {
            method: "POST",
            path: "/api/group-standings/generate-placeholders",
          },
          { method: "POST", path: "/api/group-standings/random-draw" },
          {
            method: "POST",
            path: "/api/group-standings/save-assignments",
          },
        ],
      },
      {
        id: "schedule-generation",
        titleKey: "tournamentManager.fullFlow.steps.scheduleGeneration.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.scheduleGeneration.description",
        actorKey: "tournamentManager.fullFlow.actors.organizer",
        endpoints: [
          { method: "POST", path: "/api/schedules/generate-complete" },
          { method: "POST", path: "/api/schedules/generate-group-stage" },
          { method: "POST", path: "/api/schedules/generate-knockout-stage" },
          { method: "GET", path: "/api/schedules/category/{categoryId}" },
        ],
        prerequisites: [
          "tournamentManager.fullFlow.prerequisites.entriesConfirmed",
          "tournamentManager.fullFlow.prerequisites.paymentsConfirmed",
        ],
      },
    ],
  },
  {
    id: "execution",
    titleKey: "tournamentManager.fullFlow.phases.execution.title",
    descriptionKey: "tournamentManager.fullFlow.phases.execution.description",
    colorClass: "text-rose-500",
    steps: [
      {
        id: "start-match",
        titleKey: "tournamentManager.fullFlow.steps.startMatch.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.startMatch.description",
        actorKey: "tournamentManager.fullFlow.actors.referee",
        endpoints: [
          { method: "POST", path: "/api/matches/{id}/start" },
          {
            method: "POST",
            path: "/api/sub-matches/create-from-format",
            noteKey: "tournamentManager.fullFlow.notes.teamMatchesOnly",
          },
          { method: "POST", path: "/api/match-sets" },
        ],
      },
      {
        id: "finalize-result",
        titleKey: "tournamentManager.fullFlow.steps.finalizeResult.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.finalizeResult.description",
        actorKey: "tournamentManager.fullFlow.actors.refereeAndChief",
        endpoints: [
          { method: "GET", path: "/api/matches/{id}/elo-preview" },
          { method: "POST", path: "/api/matches/{id}/finalize" },
          { method: "POST", path: "/api/matches/{id}/approve" },
          { method: "POST", path: "/api/matches/{id}/reject" },
        ],
        autoTriggers: [
          "tournamentManager.fullFlow.autoTriggers.elo",
          "tournamentManager.fullFlow.autoTriggers.groupStandingSync",
          "tournamentManager.fullFlow.autoTriggers.knockoutAdvance",
        ],
      },
      {
        id: "operational-notify",
        titleKey: "tournamentManager.fullFlow.steps.operationalNotify.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.operationalNotify.description",
        actorKey: "tournamentManager.fullFlow.actors.systemAdmin",
        endpoints: [
          { method: "POST", path: "/api/notifications/send" },
          { method: "POST", path: "/api/notifications/event" },
          { method: "GET", path: "/api/notifications/status" },
        ],
      },
    ],
  },
  {
    id: "completion",
    titleKey: "tournamentManager.fullFlow.phases.completion.title",
    descriptionKey: "tournamentManager.fullFlow.phases.completion.description",
    colorClass: "text-amber-500",
    steps: [
      {
        id: "publish-standings",
        titleKey: "tournamentManager.fullFlow.steps.publishStandings.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.publishStandings.description",
        actorKey: "tournamentManager.fullFlow.actors.organizerAndAudience",
        endpoints: [
          { method: "GET", path: "/api/group-standings/{categoryId}" },
          {
            method: "GET",
            path: "/api/knockout-brackets/category/{categoryId}/tree",
          },
          {
            method: "GET",
            path: "/api/knockout-brackets/category/{categoryId}/standings",
          },
        ],
      },
      {
        id: "elo-and-history",
        titleKey: "tournamentManager.fullFlow.steps.eloAndHistory.title",
        descriptionKey:
          "tournamentManager.fullFlow.steps.eloAndHistory.description",
        actorKey: "tournamentManager.fullFlow.actors.audienceAndAthlete",
        endpoints: [
          { method: "GET", path: "/api/elo-scores/leaderboard" },
          { method: "GET", path: "/api/elo-histories/user/{userId}" },
          { method: "GET", path: "/api/matches/athlete/{userId}/history" },
        ],
      },
      {
        id: "wrap-up",
        titleKey: "tournamentManager.fullFlow.steps.wrapUp.title",
        descriptionKey: "tournamentManager.fullFlow.steps.wrapUp.description",
        actorKey: "tournamentManager.fullFlow.actors.organizer",
        endpoints: [
          { method: "GET", path: "/api/schedules" },
          { method: "GET", path: "/api/matches/status/completed" },
          { method: "GET", path: "/api/payments/category/{categoryId}/stats" },
        ],
        tipKey: "tournamentManager.fullFlow.tips.wrapUp",
      },
    ],
  },
];
