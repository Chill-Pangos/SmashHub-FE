# React Query API Usage Report

**Generated:** March 3, 2026

This report provides a comprehensive analysis of React Query hooks implemented in `src/hooks/queries`, their actual usage across screen components in `src/pages`, and the corresponding service methods and API endpoints being called.

---

## **APIs USED IN SCREENS (Actual Usage)**

### **Auth APIs**

❌ **All 11 Auth hooks are NOT USED in screens**

- `useProfile` - Not used in any screen
- `useRegister` - Not used (auth handled via `useAuthOperations`)
- `useLogin` - Not used (auth handled via `useAuthOperations`)
- `useLogout` - Not used (auth handled via `useAuthOperations`)
- `useChangePassword` - Not used (auth handled via `useAuthOperations`)
- `useForgotPassword` - Not used (auth handled via `useAuthOperations`)
- `useVerifyOtp` - Not used (auth handled via `useAuthOperations`)
- `useResetPassword` - Not used (auth handled via `useAuthOperations`)
- `useSendEmailVerification` - Not used (auth handled via `useAuthOperations`)
- `useVerifyEmailOtp` - Not used (auth handled via `useAuthOperations`)
- `useResendEmailVerification` - Not used (auth handled via `useAuthOperations`)

**Note:** Authentication is currently handled through the `useAuthOperations` custom hook instead of the React Query hooks.

---

### **Tournament APIs**

✅ **7 out of 7 hooks are USED** (100% usage)

#### `useTournaments` - Used in 8 files

**Service Method:** `tournamentService.getAllTournaments(skip, limit)`  
**API Endpoint:** `GET /api/tournaments?skip={skip}&limit={limit}`

- `TournamentManager/TournamentDashboard/components/RecentTournaments.tsx`
- `TournamentManager/RefereeAssignment/RefereeAssignment.tsx`
- `TournamentManager/DelegationManagement/DelegationManagement.tsx`
- `TeamManager/TeamSchedule/TeamSchedule.tsx`
- `Spectator/SpectatorTournaments/SpectatorTournaments.tsx`
- `Public/PublicTournaments/PublicTournaments.tsx`
- `Coach/CoachSchedule/CoachSchedule.tsx`
- `Coach/CoachTournaments/CoachTournaments.tsx`

#### `useTournament` - Used in 3 files

**Service Method:** `tournamentService.getTournamentById(id)`  
**API Endpoint:** `GET /api/tournaments/{id}`

- `TournamentManager/TournamentUpdate/TournamentUpdateForm.tsx`
- `TournamentManager/TournamentDetail/TournamentDetail.tsx`
- `TournamentManager/DelegationManagement/DelegationManagement.tsx`

#### `useSearchTournaments` - Used in 1 file

**Service Method:** `tournamentService.searchTournaments(filters)`  
**API Endpoint:** `GET /api/tournaments/search?{filters}`

- `TournamentManager/TournamentList/TournamentList.tsx`

#### `useCreateTournament` - Used in 1 file

**Service Method:** `tournamentService.createTournament(data)`  
**API Endpoint:** `POST /api/tournaments`

- `TournamentManager/TournamentSetupWizard/TournamentSetupWizard.tsx`

#### `useUpdateTournament` - Used in 1 file

**Service Method:** `tournamentService.updateTournament(id, data)`  
**API Endpoint:** `PUT /api/tournaments/{id}`

- `TournamentManager/TournamentUpdate/TournamentUpdateForm.tsx`

#### `useDeleteTournament` - Used in 2 files

**Service Method:** `tournamentService.deleteTournament(id)`  
**API Endpoint:** `DELETE /api/tournaments/{id}`

- `TournamentManager/TournamentList/TournamentList.tsx`
- `TournamentManager/TournamentDetail/TournamentDetail.tsx`

#### `useTournamentsByStatus` - Used in 3 files

**Service Method:** `tournamentService.getTournamentsByStatus(status, skip, limit)`  
**API Endpoint:** `GET /api/tournaments/status/{status}?skip={skip}&limit={limit}`

- `TeamManager/TeamManagerDashboard/TeamManagerDashboard.tsx`
- `TeamManager/TeamTournaments/TeamTournaments.tsx`
- `Spectator/SpectatorDashboard/SpectatorDashboard.tsx`

---

### **Team APIs**

✅ **1 out of 8 hooks are USED** (12.5% usage)

#### ✅ Used:

**`useTeam`** - Used in 1 file  
**Service Method:** `teamService.getTeamById(id)`  
**API Endpoint:** `GET /api/teams/{id}`

- `TeamManager/MyTeam/MyTeam.tsx`

#### ❌ Not Used:

- `useTeams` → `GET /api/teams`
- `useTeamsByTournament` → `GET /api/teams/tournament/{tournamentId}`
- `useCreateTeam` → `POST /api/teams`
- `useUpdateTeam` → `PUT /api/teams/{id}`
- `useDeleteTeam` → `DELETE /api/teams/{id}`
- `usePreviewImportTeams` → `POST /api/teams/import/preview`
- `useConfirmImportTeams` → `POST /api/teams/import/confirm`

---

### **Team Member APIs**

✅ **4 out of 6 hooks are USED** (66.7% usage)

#### `useMembersByTeam` - Used in 2 files

**Service Method:** `teamMemberService.getMembersByTeamId(teamId, skip, limit)`  
**API Endpoint:** `GET /api/team-members/team/{teamId}?skip={skip}&limit={limit}`

- `TeamManager/TeamRegistration/components/ManualEntryRegistration.tsx`
- `TeamManager/MyTeam/MyTeam.tsx`

#### `useTeamsByUser` - Used in 8 files

**Service Method:** `teamMemberService.getTeamsByUserId(userId, skip, limit)`  
**API Endpoint:** `GET /api/team-members/user/{userId}?skip={skip}&limit={limit}`

- `TeamManager/TeamRegistration/TeamRegistration.tsx`
- `TeamManager/TeamManagerDashboard/TeamManagerDashboard.tsx`
- `TeamManager/MyTeam/MyTeam.tsx`
- `Coach/CoachAthletes/CoachAthletes.tsx`
- `Coach/CoachDashboard/CoachDashboard.tsx`
- `Athlete/AthleteTournaments/AthleteTournaments.tsx`
- `Athlete/AthleteDashboard/AthleteDashboard.tsx`

#### `useCreateTeamMember` - Used in 2 files

**Service Method:** `teamMemberService.createTeamMember(data)`  
**API Endpoint:** `POST /api/team-members`

- `TeamManager/TeamRegistration/components/ManualTeamRegistration.tsx`
- `TeamManager/MyTeam/components/AddMemberDialog.tsx`

#### `useUpdateTeamMember` - Used in 1 file

**Service Method:** `teamMemberService.updateTeamMember(id, data)`  
**API Endpoint:** `PUT /api/team-members/{id}`

- `TeamManager/MyTeam/components/EditMemberDialog.tsx`

#### `useDeleteTeamMember` - Used in 1 file

**Service Method:** `teamMemberService.deleteTeamMember(id)`  
**API Endpoint:** `DELETE /api/team-members/{id}`

- `TeamManager/MyTeam/components/DeleteMemberDialog.tsx`

#### ❌ Not Used:

- `useTeamMembers` → `GET /api/team-members`
- `useTeamMember` → `GET /api/team-members/{id}`

---

### **Entry APIs**

✅ **1 out of 13 hooks are USED** (7.7% usage)

#### ✅ Used:

**`useRegisterEntry`** - Used in 1 file  
**Service Method:** `entryService.registerEntry(data)`  
**API Endpoint:** `POST /api/entries/register`

- `TeamManager/TeamRegistration/components/ManualEntryRegistration.tsx`

#### ❌ Not Used:

- `useEntries` → `GET /api/entries`
- `useEntry` → `GET /api/entries/{id}`
- `useEntriesByContent` → `GET /api/entries/content/{contentId}`
- `useCreateEntry` → `POST /api/entries`
- `useUpdateEntry` → `PUT /api/entries/{id}`
- `useDeleteEntry` → `DELETE /api/entries/{id}`
- `usePreviewImportSingleEntries` → `POST /api/entries/import/single/preview`
- `useConfirmImportSingleEntries` → `POST /api/entries/import/single/confirm`
- `usePreviewImportDoubleEntries` → `POST /api/entries/import/double/preview`
- `useConfirmImportDoubleEntries` → `POST /api/entries/import/double/confirm`
- `usePreviewImportTeamEntries` → `POST /api/entries/import/team/preview`
- `useConfirmImportTeamEntries` → `POST /api/entries/import/team/confirm`

---

### **Match APIs**

✅ **9 out of 17 hooks are USED** (52.9% usage)

#### `useMatches` - Used in 2 files

**Service Method:** `matchService.getAllMatches(skip, limit)`  
**API Endpoint:** `GET /api/matches?skip={skip}&limit={limit}`

- `TeamManager/TeamSchedule/TeamSchedule.tsx`
- `Coach/CoachSchedule/CoachSchedule.tsx`

#### `useMatchesByStatus` - Used in 10 files

**Service Method:** `matchService.getMatchesByStatus(status, skip, limit)`  
**API Endpoint:** `GET /api/matches/status/{status}?skip={skip}&limit={limit}`

- `Spectator/SpectatorSchedule/SpectatorSchedule.tsx`
- `Spectator/SpectatorDashboard/SpectatorDashboard.tsx`
- `Spectator/LiveMatches/LiveMatches.tsx`
- `Referee/MatchHistory/MatchHistory.tsx`
- `Referee/RefereeDashboard/RefereeDashboard.tsx` (3 times - scheduled, in_progress, completed)
- `ChiefReferee/MatchSupervision/components/ScheduledMatches.tsx`
- `ChiefReferee/MatchSupervision/components/LiveMatches.tsx`
- `Athlete/MatchHistory/MatchHistory.tsx`
- `Athlete/AthleteSchedule/AthleteSchedule.tsx`
- `Athlete/AthleteDashboard/AthleteDashboard.tsx`

#### `usePendingMatches` - Used in 1 file

**Service Method:** `matchService.getPendingMatches(skip, limit)`  
**API Endpoint:** `GET /api/matches/pending?skip={skip}&limit={limit}`

- `ChiefReferee/MatchSupervision/components/PendingMatchReview.tsx`

#### `usePendingMatchWithElo` - Used in 1 file

**Service Method:** `matchService.getPendingMatchWithElo(id)`  
**API Endpoint:** `GET /api/matches/{id}/pending-with-elo`

- `ChiefReferee/MatchSupervision/components/PendingMatchReview.tsx`

#### `useStartMatch` - Used in 1 file

**Service Method:** `matchService.startMatch(id)`  
**API Endpoint:** `POST /api/matches/{id}/start`

- `ChiefReferee/MatchSupervision/components/ScheduledMatches.tsx`

#### `useFinalizeMatch` - Used in 1 file

**Service Method:** `matchService.finalizeMatch(id)`  
**API Endpoint:** `POST /api/matches/{id}/finalize`

- `Referee/RefereeDashboard/RefereeDashboard.tsx`

#### `useApproveMatch` - Used in 1 file

**Service Method:** `matchService.approveMatch(id, data)`  
**API Endpoint:** `POST /api/matches/{id}/approve`

- `ChiefReferee/MatchSupervision/components/PendingMatchReview.tsx`

#### `useRejectMatch` - Used in 1 file

**Service Method:** `matchService.rejectMatch(id, data)`  
**API Endpoint:** `POST /api/matches/{id}/reject`

- `ChiefReferee/MatchSupervision/components/PendingMatchReview.tsx`

#### ❌ Not Used:

- `useMatch` → `GET /api/matches/{id}`
- `useMatchesBySchedule` → `GET /api/matches/schedule/{scheduleId}`
- `useEloPreview` → `GET /api/matches/{id}/elo-preview`
- `useCreateMatch` → `POST /api/matches`
- `useUpdateMatch` → `PUT /api/matches/{id}`
- `useDeleteMatch` → `DELETE /api/matches/{id}`
- `useAthleteUpcomingMatches` → `GET /api/matches/athlete/{userId}/upcoming`
- `useAthleteMatchHistory` → `GET /api/matches/athlete/{userId}/history`

---

### **Match Set APIs**

✅ **2 out of 7 hooks are USED** (28.6% usage)

#### ✅ Used:

**`useMatchSetsByMatch`** - Used in 1 file  
**Service Method:** `matchSetService.getMatchSetsByMatch(matchId, skip, limit)`  
**API Endpoint:** `GET /api/match-sets/match/{matchId}?skip={skip}&limit={limit}`

- `Referee/RefereeDashboard/RefereeDashboard.tsx`

**`useCreateMatchSetWithScore`** - Used in 1 file  
**Service Method:** `matchSetService.createMatchSetWithScore(data)`  
**API Endpoint:** `POST /api/match-sets/score`

- `Referee/RefereeDashboard/RefereeDashboard.tsx`

#### ❌ Not Used:

- `useMatchSets` → `GET /api/match-sets`
- `useMatchSet` → `GET /api/match-sets/{id}`
- `useCreateMatchSet` → `POST /api/match-sets`
- `useUpdateMatchSet` → `PUT /api/match-sets/{id}`
- `useDeleteMatchSet` → `DELETE /api/match-sets/{id}`

---

### **Schedule APIs**

✅ **3 out of 11 hooks are USED** (27.3% usage)

#### `useSchedules` - Used in 3 files

**Service Method:** `scheduleService.getAllSchedules(skip, limit)`  
**API Endpoint:** `GET /api/schedules?skip={skip}&limit={limit}`

- `TeamManager/TeamSchedule/TeamSchedule.tsx`
- `Spectator/SpectatorSchedule/SpectatorSchedule.tsx`
- `Coach/CoachSchedule/CoachSchedule.tsx`

#### `useGenerateCompleteSchedule` - Used in 1 file

**Service Method:** `scheduleService.generateCompleteSchedule(data)`  
**API Endpoint:** `POST /api/schedules/generate-complete`

- `TournamentManager/SchedulingGenerator/ScheduleGenerator.tsx`

#### `useGenerateKnockoutOnlySchedule` - Used in 1 file

**Service Method:** `scheduleService.generateKnockoutOnlySchedule(data)`  
**API Endpoint:** `POST /api/schedules/generate-knockout-only`

- `TournamentManager/SchedulingGenerator/ScheduleGenerator.tsx`

#### ❌ Not Used:

- `useSchedule` → `GET /api/schedules/{id}`
- `useSchedulesByContent` → `GET /api/schedules/content/{contentId}`
- `useCreateSchedule` → `POST /api/schedules`
- `useUpdateSchedule` → `PUT /api/schedules/{id}`
- `useDeleteSchedule` → `DELETE /api/schedules/{id}`
- `useGenerateSchedule` → `POST /api/schedules/generate`
- `useUpdateKnockoutEntries` → `POST /api/schedules/update-knockout`
- `useGenerateGroupStageSchedule` → `POST /api/schedules/generate-group-stage`
- `useGenerateKnockoutStageSchedule` → `POST /api/schedules/generate-knockout-stage`

---

### **Group Standing APIs**

❌ **0 out of 7 hooks are USED** (0% usage)

All hooks are implemented but not used:

- `useGroupStandingsByContent` → `GET /api/group-standings/content/{contentId}`
- `useQualifiedTeams` → `GET /api/group-standings/qualified/{contentId}`
- `useGeneratePlaceholders` → `POST /api/group-standings/generate-placeholders`
- `useRandomDraw` → `POST /api/group-standings/random-draw`
- `useSaveAssignments` → `POST /api/group-standings/save-assignments`
- `useRandomDrawAndSave` → `POST /api/group-standings/random-draw-and-save`
- `useCalculateStandings` → `POST /api/group-standings/calculate`

---

### **Knockout Bracket APIs**

❌ **0 out of 9 hooks are USED** (0% usage)

All hooks are implemented but not used:

- `useKnockoutBrackets` → `GET /api/knockout-brackets`
- `useKnockoutBracket` → `GET /api/knockout-brackets/{id}`
- `useKnockoutBracketsByContent` → `GET /api/knockout-brackets/content/{contentId}`
- `useCreateKnockoutBracket` → `POST /api/knockout-brackets`
- `useUpdateKnockoutBracket` → `PUT /api/knockout-brackets/{id}`
- `useDeleteKnockoutBracket` → `DELETE /api/knockout-brackets/{id}`
- `useGenerateKnockoutBracket` → `POST /api/knockout-brackets/generate`
- `useGenerateFromGroups` → `POST /api/knockout-brackets/generate-from-groups`
- `useAdvanceWinner` → `POST /api/knockout-brackets/advance-winner`

---

### **Tournament Referee APIs**

✅ **7 out of 9 hooks are USED** (77.8% usage)

#### `useAvailableChiefReferees` - Used in 1 file

**Service Method:** `tournamentRefereeService.getAvailableChiefReferees()`  
**API Endpoint:** `GET /api/tournament-referees/available-chief-referees`

- `TournamentManager/TournamentSetupWizard/components/ChiefRefereeSelection.tsx`

#### `useRefereesByTournament` - Used in 2 files

**Service Method:** `tournamentRefereeService.getRefereesByTournament(tournamentId, skip, limit)`  
**API Endpoint:** `GET /api/tournament-referees/tournament/{tournamentId}?skip={skip}&limit={limit}`

- `TournamentManager/RefereeAssignment/RefereeAssignment.tsx`
- `TournamentManager/RefereeAssignment/components/AssignRefereeDialog.tsx`

#### `useAvailableReferees` - Used in 1 file

**Service Method:** `tournamentRefereeService.getAvailableReferees(tournamentId, excludeIds)`  
**API Endpoint:** `GET /api/tournament-referees/tournament/{tournamentId}/available`

- `TournamentManager/RefereeAssignment/components/AssignRefereeDialog.tsx`

#### `useCreateTournamentReferee` - Used in 1 file

**Service Method:** `tournamentRefereeService.createTournamentReferee(data)`  
**API Endpoint:** `POST /api/tournament-referees`

- `TournamentManager/TournamentSetupWizard/components/ChiefRefereeSelection.tsx`

#### `useAssignReferees` - Used in 1 file

**Service Method:** `tournamentRefereeService.assignReferees(data)`  
**API Endpoint:** `POST /api/tournament-referees/assign`

- `TournamentManager/RefereeAssignment/components/AssignRefereeDialog.tsx`

#### `useUpdateTournamentReferee` - Used in 1 file

**Service Method:** `tournamentRefereeService.updateTournamentReferee(id, data)`  
**API Endpoint:** `PUT /api/tournament-referees/{id}`

- `TournamentManager/RefereeAssignment/components/RefereeList.tsx`

#### `useUpdateRefereeAvailability` - Used in 1 file

**Service Method:** `tournamentRefereeService.updateAvailability(id, data)`  
**API Endpoint:** `PUT /api/tournament-referees/{id}/availability`

- `TournamentManager/RefereeAssignment/components/RefereeList.tsx`

#### `useDeleteTournamentReferee` - Used in 1 file

**Service Method:** `tournamentRefereeService.deleteTournamentReferee(id)`  
**API Endpoint:** `DELETE /api/tournament-referees/{id}`

- `TournamentManager/RefereeAssignment/components/RefereeList.tsx`

#### ❌ Not Used:

- `useTournamentReferees` → `GET /api/tournament-referees`
- `useTournamentReferee` → `GET /api/tournament-referees/{id}`

---

### **Role APIs**

❌ **0 out of 6 hooks are USED** (0% usage)

All hooks are implemented but not used:

- `useRoles` → `GET /api/roles`
- `useRole` → `GET /api/roles/{id}`
- `useRoleByName` → `GET /api/roles/name/{name}`
- `useCreateRole` → `POST /api/roles`
- `useUpdateRole` → `PUT /api/roles/{id}`
- `useDeleteRole` → `DELETE /api/roles/{id}`

**Note:** Role management is handled through the store (`useRole` from `@/store`) instead.

---

### **User APIs**

✅ **1 out of 3 hooks are USED** (33.3% usage)

#### ✅ Used:

**`useUsers`** - Used in 1 file  
**Service Method:** `userService.getUsers(skip, limit)`  
**API Endpoint:** `GET /api/users?skip={skip}&limit={limit}`

- `TeamManager/TeamRegistration/components/ManualTeamRegistration.tsx`

#### ❌ Not Used:

- `useUser` → `GET /api/users/{id}`
- `useSearchUsers` → `GET /api/users/search?query={query}`

---

## **SUMMARY STATISTICS**

### Overall Usage

- **Total Hooks Implemented**: 114
- **Hooks Actually Used**: 36 (31.6%)
- **Hooks Not Used**: 78 (68.4%)

### Module-by-Module Breakdown

| Module             | Total Hooks | Used | Not Used | Usage % |
| ------------------ | ----------- | ---- | -------- | ------- |
| Tournament         | 7           | 7    | 0        | 100%    |
| Tournament Referee | 9           | 7    | 2        | 77.8%   |
| Team Member        | 6           | 4    | 2        | 66.7%   |
| Match              | 17          | 9    | 8        | 52.9%   |
| User               | 3           | 1    | 2        | 33.3%   |
| Match Set          | 7           | 2    | 5        | 28.6%   |
| Schedule           | 11          | 3    | 8        | 27.3%   |
| Team               | 8           | 1    | 7        | 12.5%   |
| Entry              | 13          | 1    | 12       | 7.7%    |
| Auth               | 11          | 0    | 11       | 0%      |
| Group Standing     | 7           | 0    | 7        | 0%      |
| Knockout Bracket   | 9           | 0    | 9        | 0%      |
| Role               | 6           | 0    | 6        | 0%      |

---

## **RECOMMENDATIONS**

### High Priority

1. **Group Standing & Knockout Bracket Modules**: These are completely unused. Consider:
   - Implementing the corresponding UI screens
   - Or removing if not part of the current feature set

2. **Auth Module**: All React Query hooks are unused because `useAuthOperations` is used instead. Consider:
   - Migrating to use the React Query hooks for consistency
   - Or removing the unused React Query auth hooks

3. **Role Module**: Unused because store-based `useRole` is used. Consolidate the approach.

### Medium Priority

4. **Entry Module**: Only 1 out of 13 hooks used. The import functionality is completely unused.

5. **Team Module**: Only 1 out of 8 hooks used. Team creation, update, delete, and import features are not implemented in UI.

6. **Athlete-specific Match Hooks**: `useAthleteUpcomingMatches` and `useAthleteMatchHistory` are implemented but not used in Athlete pages.

### Low Priority

7. Consider implementing missing CRUD operations for entities that have partial coverage.

---

## **NOTES**

- This report was generated by analyzing actual imports and usage in `src/pages/**/*.{ts,tsx}` files.
- Some hooks may be imported but not actively used in component logic.
- The analysis focuses on direct usage; indirect usage through other custom hooks is noted where identified.

---

## **API ENDPOINTS SUMMARY**

### **Actually Called API Endpoints (36 unique endpoints)**

#### **Tournament Endpoints (7)**

- `GET /api/tournaments` - List all tournaments
- `GET /api/tournaments/{id}` - Get tournament by ID
- `GET /api/tournaments/search` - Search tournaments
- `GET /api/tournaments/status/{status}` - Get tournaments by status
- `POST /api/tournaments` - Create tournament
- `PUT /api/tournaments/{id}` - Update tournament
- `DELETE /api/tournaments/{id}` - Delete tournament

#### **Team Endpoints (1)**

- `GET /api/teams/{id}` - Get team by ID

#### **Team Member Endpoints (4)**

- `GET /api/team-members/team/{teamId}` - Get members by team
- `GET /api/team-members/user/{userId}` - Get teams by user
- `POST /api/team-members` - Create team member
- `PUT /api/team-members/{id}` - Update team member
- `DELETE /api/team-members/{id}` - Delete team member

#### **Entry Endpoints (1)**

- `POST /api/entries/register` - Register entry

#### **Match Endpoints (9)**

- `GET /api/matches` - List all matches
- `GET /api/matches/status/{status}` - Get matches by status
- `GET /api/matches/pending` - Get pending matches
- `GET /api/matches/{id}/pending-with-elo` - Get pending match with ELO preview
- `POST /api/matches/{id}/start` - Start match
- `POST /api/matches/{id}/finalize` - Finalize match
- `POST /api/matches/{id}/approve` - Approve match result
- `POST /api/matches/{id}/reject` - Reject match result

#### **Match Set Endpoints (2)**

- `GET /api/match-sets/match/{matchId}` - Get match sets by match
- `POST /api/match-sets/score` - Create match set with score

#### **Schedule Endpoints (3)**

- `GET /api/schedules` - List all schedules
- `POST /api/schedules/generate-complete` - Generate complete schedule
- `POST /api/schedules/generate-knockout-only` - Generate knockout-only schedule

#### **Tournament Referee Endpoints (8)**

- `GET /api/tournament-referees/available-chief-referees` - Get available chief referees
- `GET /api/tournament-referees/tournament/{tournamentId}` - Get referees by tournament
- `GET /api/tournament-referees/tournament/{tournamentId}/available` - Get available referees
- `POST /api/tournament-referees` - Create tournament referee
- `POST /api/tournament-referees/assign` - Assign multiple referees
- `PUT /api/tournament-referees/{id}` - Update tournament referee
- `PUT /api/tournament-referees/{id}/availability` - Update referee availability
- `DELETE /api/tournament-referees/{id}` - Delete tournament referee

#### **User Endpoints (1)**

- `GET /api/users` - List all users

---

### **Unused API Endpoints (78 endpoints)**

These endpoints are implemented in services but never called because the corresponding React Query hooks are not used:

#### **Auth Endpoints (11)** - All unused

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/profile`
- `POST /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `POST /api/auth/send-email-verification`
- `POST /api/auth/verify-email-otp`
- `POST /api/auth/resend-email-verification`

#### **Team Endpoints (6)**

- `GET /api/teams`
- `GET /api/teams/tournament/{tournamentId}`
- `POST /api/teams`
- `PUT /api/teams/{id}`
- `DELETE /api/teams/{id}`
- `POST /api/teams/import/preview`
- `POST /api/teams/import/confirm`

#### **Team Member Endpoints (2)**

- `GET /api/team-members`
- `GET /api/team-members/{id}`

#### **Entry Endpoints (12)**

- `GET /api/entries`
- `GET /api/entries/{id}`
- `GET /api/entries/content/{contentId}`
- `POST /api/entries`
- `PUT /api/entries/{id}`
- `DELETE /api/entries/{id}`
- `POST /api/entries/import/single/preview`
- `POST /api/entries/import/single/confirm`
- `POST /api/entries/import/double/preview`
- `POST /api/entries/import/double/confirm`
- `POST /api/entries/import/team/preview`
- `POST /api/entries/import/team/confirm`

#### **Match Endpoints (8)**

- `GET /api/matches/{id}`
- `GET /api/matches/schedule/{scheduleId}`
- `GET /api/matches/{id}/elo-preview`
- `GET /api/matches/athlete/{userId}/upcoming`
- `GET /api/matches/athlete/{userId}/history`
- `POST /api/matches`
- `PUT /api/matches/{id}`
- `DELETE /api/matches/{id}`

#### **Match Set Endpoints (5)**

- `GET /api/match-sets`
- `GET /api/match-sets/{id}`
- `POST /api/match-sets`
- `PUT /api/match-sets/{id}`
- `DELETE /api/match-sets/{id}`

#### **Schedule Endpoints (8)**

- `GET /api/schedules/{id}`
- `GET /api/schedules/content/{contentId}`
- `POST /api/schedules`
- `PUT /api/schedules/{id}`
- `DELETE /api/schedules/{id}`
- `POST /api/schedules/generate`
- `POST /api/schedules/update-knockout`
- `POST /api/schedules/generate-group-stage`
- `POST /api/schedules/generate-knockout-stage`

#### **Group Standing Endpoints (7)** - All unused

- `GET /api/group-standings/content/{contentId}`
- `GET /api/group-standings/qualified/{contentId}`
- `POST /api/group-standings/generate-placeholders`
- `POST /api/group-standings/random-draw`
- `POST /api/group-standings/save-assignments`
- `POST /api/group-standings/random-draw-and-save`
- `POST /api/group-standings/calculate`

#### **Knockout Bracket Endpoints (9)** - All unused

- `GET /api/knockout-brackets`
- `GET /api/knockout-brackets/{id}`
- `GET /api/knockout-brackets/content/{contentId}`
- `POST /api/knockout-brackets`
- `PUT /api/knockout-brackets/{id}`
- `DELETE /api/knockout-brackets/{id}`
- `POST /api/knockout-brackets/generate`
- `POST /api/knockout-brackets/generate-from-groups`
- `POST /api/knockout-brackets/advance-winner`

#### **Tournament Referee Endpoints (2)**

- `GET /api/tournament-referees`
- `GET /api/tournament-referees/{id}`

#### **Role Endpoints (6)** - All unused

- `GET /api/roles`
- `GET /api/roles/{id}`
- `GET /api/roles/name/{name}`
- `POST /api/roles`
- `PUT /api/roles/{id}`
- `DELETE /api/roles/{id}`

#### **User Endpoints (2)**

- `GET /api/users/{id}`
- `GET /api/users/search`
