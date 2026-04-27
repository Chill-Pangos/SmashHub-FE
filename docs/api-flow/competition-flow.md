# Schedules, Matches, Sub-matches, Group Standings, Knockout, ELO

Base path: `/api`

This file groups the operational competition APIs because they are tightly connected in the flowchart.

## Schedule Config

### `POST /schedule-configs`

Create schedule config for a tournament.

Request body includes `tournamentId`, time window fields, lunch break fields, and optional `notes`.

### `GET /schedule-configs/defaults`

Get default schedule config values.

### `GET /schedule-configs/{tournamentId}/schedule-config`

Get schedule config by tournament.

### `PATCH /schedule-configs/{tournamentId}/schedule-config`

Update schedule config.

### `POST /schedule-configs/{tournamentId}/schedule-config/validate`

Validate a config against total matches.

Request body: `totalMatches`.

Notes: schedule config is part of the schedule-generation flow; frontend should save or validate it before generating schedules.
There is no dedicated delete route for schedule config in the current router.

## Schedules

### `GET /schedules`

List schedules.

### `POST /schedules/generate`

Generate tournament schedules automatically.

Request body includes `categoryId`, `startDate`, optional `startTime`, `endTime`, lunch break fields, `roundNumber`, `groupName`, `isGroupStage`, `numberOfGroups`, `teamsPerGroup`, `includeKnockout`, `teamsAdvancePerGroup`, `knockoutStartDate`.

### `POST /schedules/update-knockout`

Update knockout entries based on group results.

Request body: `categoryId`, `groupResults`.

### `POST /schedules/generate-group-stage`

Generate group stage schedules.

### `POST /schedules/generate-complete`

Generate the full tournament schedule.

Notes: this is the highest-level schedule flow and can drive both group and knockout creation.

### `POST /schedules/generate-knockout-only`

Generate knockout-only schedule.

### `POST /schedules/generate-knockout-stage`

Generate knockout stage schedules from existing brackets.

### `GET /schedules/{id}`

Get schedule by ID.

### `PUT /schedules/{id}`

Update schedule.

### `DELETE /schedules/{id}`

Delete schedule.

### `GET /schedules/category/{categoryId}`

Get schedules by category.

Query param: optional `stage` (`group` or `knockout`).

Flow notes:

- The flowchart expects paid and confirmed entries before schedule generation.
- Group-stage generation happens before knockout-stage generation when a category uses group play.
- The frontend should treat schedule generation as a batch action, not a user-level CRUD edit.

## Group Standings

### `POST /group-standings/generate-placeholders`

Generate group placeholders.

Request body: `categoryId`.

### `POST /group-standings/random-draw`

Alias for placeholder generation, used for preview.

### `POST /group-standings/save-assignments`

Persist group assignments.

Request body: `categoryId`, `groupAssignments` or legacy `assignments`.

### `POST /group-standings/matches/{matchId}/sync`

Update standings after a match completes.

### `POST /group-standings/calculate`

Recalculate standings.

Request body: `categoryId`, optional `groupName`.

### `GET /group-standings/{categoryId}`

List standings for a category. The backend also accepts an optional `groupName` query parameter.

### `GET /group-standings/{categoryId}/qualified`

List qualified teams from a group stage category.

Query params: optional `teamsPerGroup` or `qualifiersPerGroup`.

Flow note: standings update is downstream of match approval in the flowchart, not something frontend should call manually during normal match flow unless admin tooling needs it.

## Knockout Brackets

### `POST /knockout-brackets/generate`

Generate knockout bracket from entries.

Request body: `categoryId`.

### `POST /knockout-brackets/generate-from-group-stage`

Generate knockout bracket from group stage results.

Request body: `categoryId`, optional `qualifiersPerGroup`.

### `POST /knockout-brackets/advance-winner`

Advance a winner to the next round.

Request body: `bracketId`, `winnerEntryId`.

### `POST /knockout-brackets/validate`

Validate bracket integrity.

### `GET /knockout-brackets/category/{categoryId}/tree`

Get full bracket tree.

### `GET /knockout-brackets/category/{categoryId}/standings`

Get final knockout standings.

Flow note: in the flowchart, knockout advancement is an automatic follow-up after approved results in the knockout path.

## Matches

### `POST /matches`

Create a match.

Request body follows `CreateMatchDto`: `scheduleId`, `entryAId`, `entryBId`, `status`, optional `winnerEntryId`, `resultStatus`, `reviewNotes`.

### `GET /matches`

List matches.

### `GET /matches/pending`

List pending matches waiting for chief referee approval.

### `GET /matches/schedule/{scheduleId}`

List matches by schedule.

### `GET /matches/status/{status}`

List matches by status.

### `POST /matches/{id}/start`

Start a match and assign referees.

Notes: match must be in scheduled state.

### `GET /matches/{id}/pending-with-elo`

Get pending match with ELO preview.

### `POST /matches/{id}/finalize`

Submit match result for approval.

Request body is driven by the match result DTOs; frontend should send the winner/result fields used by the backend implementation.

### `POST /matches/{id}/approve`

Approve a pending match result.

Request body: optional `reviewNotes`.

Flow note: this endpoint is the critical trigger in the flowchart. After approval, standings, bracket advancement, and ELO updates happen as downstream effects.

### `POST /matches/{id}/reject`

Reject a pending match result.

Request body: required `reviewNotes`.

### `GET /matches/{id}/elo-preview`

Preview ELO changes for a match.

### `GET /matches/athlete/{userId}/upcoming`

Get upcoming matches for an athlete.

### `GET /matches/athlete/{userId}/history`

Get completed match history for an athlete.

### `GET /matches/{id}`

Get match by ID.

### `PUT /matches/{id}`

Update match.

### `DELETE /matches/{id}`

Delete match.

## Sub-matches

### `POST /sub-matches/create-from-format`

Create sub-matches from team format like `S-D-S`.

Request body: `matchId`, `teamFormat`.

### `POST /sub-matches/{id}/start`

Start a sub-match.

### `POST /sub-matches/{id}/finalize`

Finalize a sub-match.

### `POST /sub-matches/{id}/assign-players`

Assign players to a sub-match.

Request body: `players` array with `entryMemberId` and `team` (`A` or `B`).

### `GET /sub-matches/match/{matchId}`

List sub-matches by match.

### `GET /sub-matches/{id}`

Get sub-match by ID.

## Sub-match Players

### `GET /sub-match-players/sub-match/{subMatchId}`

List players in a sub-match.

### `GET /sub-match-players/sub-match/{subMatchId}/team/{team}`

List players for team A or B in a sub-match.

### `GET /sub-match-players/entry-member/{entryMemberId}`

Get sub-match history for an entry member.

## Match Sets

### `POST /match-sets`

Create a set with score.

Request body: `subMatchId`, `entryAScore`, `entryBScore`.

### `GET /match-sets/{id}`

Get set by ID.

### `PUT /match-sets/{id}`

Update set score.

### `GET /match-sets/sub-match/{subMatchId}`

List sets by sub-match.

### `DELETE /match-sets/{id}`

Delete a set.

## ELO

### `POST /elo-scores`

Create ELO score.

### `GET /elo-scores`

List ELO scores.

### `GET /elo-scores/leaderboard`

Get ELO leaderboard.

### `GET /elo-scores/{id}`

Get ELO score by ID.

### `PUT /elo-scores/{id}`

Update ELO score.

### `DELETE /elo-scores/{id}`

Delete ELO score.

### `POST /elo-histories`

Create ELO history record.

### `GET /elo-histories`

List ELO history records.

### `GET /elo-histories/{id}`

Get ELO history by ID.

### `GET /elo-histories/user/{userId}`

List ELO history by user.

### `GET /elo-histories/match/{matchId}`

List ELO history by match.

### `DELETE /elo-histories/{id}`

Delete ELO history.

Flow note: ELO changes are a downstream effect of approved match results, so frontend should usually read them after approval rather than trying to write them manually.
