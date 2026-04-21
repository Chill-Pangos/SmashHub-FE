# SmashHub-BE API System Documentation

**Last Updated**: 2026-03-31
**Version**: 1.0
**Base URL**: `/api`

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Core Features & API Resources](#core-features--api-resources)
4. [Main Business Workflows](#main-business-workflows)
5. [State Machines & Status Flows](#state-machines--status-flows)
6. [Data Models & Relationships](#data-models--relationships)
7. [Real-time Features](#real-time-features)
8. [Error Handling & Status Codes](#error-handling--status-codes)

---

## System Overview

SmashHub-BE is a comprehensive **tournament management system API** designed for organizing competitive table tennis tournaments. The system handles:

- **Tournament Management**: Creation, scheduling, category management
- **User Registration & Entry Management**: Team formation, member management
- **Payment Processing**: Multiple payment methods with verification
- **Referee & Match Management**: Invitation-based referee system with match workflows
- **Scheduling**: Automatic group stage and knockout bracket generation
- **ELO Rating System**: Dynamic player ranking with match result integration
- **Real-time Notifications**: Socket.IO-based live updates

### System Architecture

```
Users (Organizers, Athletes, Referees)
    ↓
Authentication (JWT)
    ↓
Tournaments → Categories → Entries → Matches → Results
                                        ↓
                                   Group Standings / Knockout Brackets
                                        ↓
                                   ELO Scores & Leaderboard
                                        ↓
                                   Notifications (Real-time)
```

---

## Authentication & Authorization

### Authentication Flow

```
1. User Registration
   POST /auth/register
   → Create account with email/password

2. User Login
   POST /auth/login
   → Return Access Token + Refresh Token

3. Token Refresh
   POST /auth/refresh
   → Get new Access Token without re-logging in

4. Protected Endpoints
   All endpoints (except auth) require:
   Header: Authorization: Bearer <access_token>

5. Logout
   POST /auth/logout
   → Token added to blacklist
```

### Authentication Endpoints

| Method | Endpoint                              | Purpose                              |
| ------ | ------------------------------------- | ------------------------------------ |
| `POST` | `/auth/register`                      | Register new user account            |
| `POST` | `/auth/login`                         | User login (returns JWT tokens)      |
| `POST` | `/auth/refresh`                       | Refresh access token                 |
| `POST` | `/auth/logout`                        | Logout (blacklist token)             |
| `POST` | `/auth/change-password`               | Change password (authenticated user) |
| `POST` | `/auth/forgot-password`               | Request password reset OTP           |
| `POST` | `/auth/verify-otp`                    | Verify OTP code for password reset   |
| `POST` | `/auth/reset-password`                | Reset password with OTP              |
| `POST` | `/auth/send-email-verification-otp`   | Send email verification OTP          |
| `POST` | `/auth/verify-email-otp`              | Verify email with OTP                |
| `POST` | `/auth/resend-email-verification-otp` | Resend email verification            |

### Authorization Model

- **Role-Based Access Control (RBAC)**
- **Permission-Based Middleware**
- Key Roles: `admin`, `organizer`, `athlete`, `referee`, `chief_referee`
- Endpoints check user permissions before allowing access

---

## Core Features & API Resources

### 1. User Management (`/users`)

**Overview**: Manage user profiles and account information

```
User Lifecycle:
┌─────────────────────────────────────────┐
│ Create/Register → Update Profile → Use  │
│       (Auth)        (Profile)     (Participate)
└─────────────────────────────────────────┘
```

| Method   | Endpoint             | Purpose                                     | Auth Required |
| -------- | -------------------- | ------------------------------------------- | ------------- |
| `POST`   | `/users`             | Create user (admin)                         | ✓             |
| `GET`    | `/users`             | Get all users                               | ✓             |
| `GET`    | `/users/:id`         | Get user by ID                              | ✓             |
| `PUT`    | `/users/:id`         | Update user                                 | ✓             |
| `DELETE` | `/users/:id`         | Delete user                                 | ✓             |
| `PUT`    | `/users/:id/profile` | Update profile (avatar, DOB, phone, gender) | ✓             |

---

### 2. Tournament Management (`/tournaments`, `/tournament-categories`)

**Overview**: Create and manage tournaments with multiple categories

```
Tournament Lifecycle:
┌──────────────┬──────────────────┬─────────────┬──────────────────┐
│   Created    │  Registration    │ Registration│  Brackets        │
│   (Setup)    │  Open (Entries)  │  Closed     │  Generated       │
└──────────────┴──────────────────┴─────────────┴──────────────────┘
     ↓              ↓                   ↓             ↓
Tournament Status Updates (Scheduled or Manual)
```

#### Tournament Endpoints

| Method   | Endpoint                        | Purpose                              |
| -------- | ------------------------------- | ------------------------------------ |
| `POST`   | `/tournaments`                  | Create tournament with categories    |
| `GET`    | `/tournaments`                  | Get all tournaments                  |
| `GET`    | `/tournaments/search`           | Search tournaments with filters      |
| `GET`    | `/tournaments/:id`              | Get tournament by ID with categories |
| `PUT`    | `/tournaments/:id`              | Update tournament info & categories  |
| `DELETE` | `/tournaments/:id`              | Delete tournament                    |
| `POST`   | `/tournaments/update-statuses`  | Manually trigger status updates      |
| `GET`    | `/tournaments/upcoming-changes` | Get upcoming status changes          |

#### Tournament Categories

| Method   | Endpoint                     | Purpose            |
| -------- | ---------------------------- | ------------------ |
| `POST`   | `/tournament-categories`     | Create category    |
| `GET`    | `/tournament-categories`     | Get all categories |
| `GET`    | `/tournament-categories/:id` | Get category by ID |
| `PUT`    | `/tournament-categories/:id` | Update category    |
| `DELETE` | `/tournament-categories/:id` | Delete category    |

---

### 3. Entry & Registration Management (`/entries`)

**Overview**: Handle tournament registration, team formation, and member management

```
Entry Registration Flow:
┌──────────────────────────────────────────────┐
│ 1. Create Entry (register for category)      │
│    - Create Team OR Join Existing Team       │
├──────────────────────────────────────────────┤
│ 2. Team Management                           │
│    - Captain adds/removes members            │
│    - Members request to join / leave team    │
├──────────────────────────────────────────────┤
│ 3. Lineup Confirmation                       │
│    - Captain confirms final members          │
├──────────────────────────────────────────────┤
│ 4. Payment Processing                        │
│    - Record entry payment                    │
├──────────────────────────────────────────────┤
│ 5. Eligibility Check                         │
│    - Verify entry eligibility                │
│    - Disqualify if needed                    │
└──────────────────────────────────────────────┘
```

#### Entry Endpoints

| Method   | Endpoint                        | Purpose                                       |
| -------- | ------------------------------- | --------------------------------------------- |
| `POST`   | `/entries/register`             | Register for tournament (create team or join) |
| `GET`    | `/entries/category/:categoryId` | Get entries by category with filters          |
| `GET`    | `/entries/:entryId`             | Get entry by ID                               |
| `PUT`    | `/entries/:entryId`             | Update entry (captain only)                   |
| `DELETE` | `/entries/:entryId`             | Delete entry (captain only)                   |
| `GET`    | `/entries/me`                   | Get current user's entries with roles         |
| `GET`    | `/entries/:entryId/my-role`     | Get user's role in specific entry             |

#### Team Member Management

| Method | Endpoint                                 | Purpose                                  |
| ------ | ---------------------------------------- | ---------------------------------------- |
| `GET`  | `/entries/:entryId/members`              | Get all members of entry                 |
| `POST` | `/entries/:entryId/add-member`           | Add member (captain)                     |
| `POST` | `/entries/:entryId/remove-member`        | Remove member (captain)                  |
| `POST` | `/entries/:entryId/leave`                | Leave entry (member)                     |
| `POST` | `/entries/:entryId/transfer-captaincy`   | Transfer captaincy                       |
| `POST` | `/entries/:entryId/set-required-members` | Set required member count (team entries) |
| `POST` | `/entries/:entryId/confirm-lineup`       | Confirm final lineup (captain)           |

#### Join Requests (for team entries)

| Method | Endpoint                                        | Purpose                     |
| ------ | ----------------------------------------------- | --------------------------- |
| `GET`  | `/entries/:entryId/join-requests`               | Get join requests (captain) |
| `POST` | `/entries/join-requests/:joinRequestId/respond` | Respond to join request     |

#### Eligibility Management

| Method | Endpoint                                   | Purpose                       |
| ------ | ------------------------------------------ | ----------------------------- |
| `GET`  | `/entries/category/:categoryId/eligible`   | Get eligible entries          |
| `POST` | `/entries/category/:categoryId/disqualify` | Disqualify ineligible entries |

#### Entry Import

| Method | Endpoint          | Purpose             |
| ------ | ----------------- | ------------------- |
| `POST` | `/entries/import` | Bulk import entries |

---

### 4. Payment System (`/payments`)

**Overview**: Handle tournament entry payments with multiple methods

```
Payment Workflow:
┌─────────────────────────────────────────────────┐
│ 1. Create Payment Record (Entry → Payment)      │
├─────────────────────────────────────────────────┤
│ 2. Choose Payment Method:                       │
│    - Cash (In-person payment)                   │
│    - Bank Transfer (Proof upload)               │
│    - Online (Credit card, etc.)                 │
├─────────────────────────────────────────────────┤
│ 3. Payment Verification (Organizer)             │
│    - Confirm → Payment complete                 │
│    - Reject → Payment failed                    │
│    - Refund → Return payment                    │
├─────────────────────────────────────────────────┤
│ 4. Track Payment Statistics                     │
└─────────────────────────────────────────────────┘

Payment Status Flow:
pending → completed/failed/refunded
```

#### Payment Endpoints

| Method | Endpoint                               | Purpose                                    |
| ------ | -------------------------------------- | ------------------------------------------ |
| `POST` | `/payments`                            | Create payment for entry                   |
| `GET`  | `/payments/entry/:entryId`             | Get payments by entry                      |
| `GET`  | `/payments/category/:categoryId`       | Get payments by category (admin/organizer) |
| `GET`  | `/payments/category/:categoryId/stats` | Get payment statistics by category         |
| `GET`  | `/payments/pending/:categoryId`        | Get pending payments (to be confirmed)     |
| `GET`  | `/payments/:paymentId`                 | Get payment by ID                          |
| `POST` | `/payments/cash`                       | Record cash payment                        |
| `POST` | `/payments/online`                     | Record online payment                      |
| `PUT`  | `/payments/:paymentId/proof`           | Upload payment proof image                 |
| `POST` | `/payments/:paymentId/confirm`         | Confirm payment (organizer)                |
| `POST` | `/payments/:paymentId/reject`          | Reject payment (organizer)                 |
| `POST` | `/payments/:paymentId/refund`          | Refund payment (organizer)                 |

**Payment Methods**: `cash`, `bank_transfer`, `online`
**Payment Status**: `pending`, `completed`, `failed`, `refunded`

---

### 5. Referee Management (`/tournament-referees`)

**Overview**: Manage tournament referees via invitation-based system

```
Referee Management Workflow:
┌──────────────────────────────────────────────────┐
│ 1. Organizer Sends Invitation                    │
│    - Choose role: referee OR chief_referee       │
├──────────────────────────────────────────────────┤
│ 2. Referee Response:                             │
│    - Accept → Becomes active referee            │
│    - Reject → Invitation rejected               │
│    - (No response) → Expires after N hours      │
├──────────────────────────────────────────────────┤
│ 3. Active Referee Management:                    │
│    - Organizer can update role                  │
│    - Organizer can remove referee               │
│    - Organizer can cancel pending invitations   │
├──────────────────────────────────────────────────┤
│ 4. Constraints:                                  │
│    - Only 1 chief_referee per tournament        │
│    - Cannot referee & compete in same tournament│
│    - Invitation expires (configurable hours)    │
└──────────────────────────────────────────────────┘

Invitation State Machine:
pending → (accept/reject/expire/cancel)
  accept → accepted
  reject → rejected
  cancel → cancelled
  expire → expired
```

#### Referee Endpoints

| Method | Endpoint                                                    | Purpose                                            |
| ------ | ----------------------------------------------------------- | -------------------------------------------------- |
| `POST` | `/tournament-referees/invite`                               | Send referee invitation                            |
| `POST` | `/tournament-referees/accept-invitation`                    | Accept invitation (referee)                        |
| `POST` | `/tournament-referees/reject-invitation`                    | Reject invitation (referee)                        |
| `POST` | `/tournament-referees/cancel-invitation`                    | Cancel pending invitation (organizer)              |
| `POST` | `/tournament-referees/remove`                               | Remove referee from tournament (organizer)         |
| `POST` | `/tournament-referees/update-role`                          | Update referee role (organizer)                    |
| `GET`  | `/tournament-referees/tournament/:tournamentId`             | Get referees by tournament (role filter supported) |
| `GET`  | `/tournament-referees/tournament/:tournamentId/invitations` | Get invitations (organizer only)                   |

**Referee Roles**: `referee`, `chief_referee`
**Invitation States**: `pending`, `accepted`, `rejected`, `cancelled`, `expired`

---

### 6. Scheduling System (`/schedules`)

**Overview**: Generate and manage tournament schedules (group stage & knockout)

```
Scheduling Flow:

Option 1: Complete Tournament (Group Stage + Knockout)
┌────────────────────────────────────────────────┐
│ Generate Complete Schedule                      │
├────────────────────────────────────────────────┤
│ ↓ Group Stage Setup                            │
│   - Assign teams to groups                     │
│   - Generate round-robin matches               │
│   - Calculate standings                        │
│ ↓ Knockout Stage Setup                         │
│   - Generate bracket from group winners        │
│   - Generate knockout matches                  │
└────────────────────────────────────────────────┘

Option 2: Group Stage Only
┌────────────────────────────────────────────────┐
│ Generate Group Stage Schedule                  │
├────────────────────────────────────────────────┤
│ - Assign teams randomly to groups              │
│ - Generate round-robin matches within groups   │
│ - Manage match time slots & lunch breaks       │
└────────────────────────────────────────────────┘

Option 3: Knockout Only
┌────────────────────────────────────────────────┐
│ Generate Knockout Schedule                      │
├────────────────────────────────────────────────┤
│ - Generate bracket from direct entries         │
│ - Create knockout matches                      │
└────────────────────────────────────────────────┘
```

#### Schedule Endpoints

| Method   | Endpoint                             | Purpose                                         |
| -------- | ------------------------------------ | ----------------------------------------------- |
| `POST`   | `/schedules/generate`                | Generate tournament schedules                   |
| `POST`   | `/schedules/generate-complete`       | Generate complete tournament (group + knockout) |
| `POST`   | `/schedules/generate-group-stage`    | Generate group stage schedules                  |
| `POST`   | `/schedules/generate-knockout-only`  | Generate knockout-only schedule                 |
| `POST`   | `/schedules/generate-knockout-stage` | Generate knockout stage schedules               |
| `POST`   | `/schedules/update-knockout`         | Update knockout stage entries                   |
| `GET`    | `/schedules`                         | Get all schedules                               |
| `GET`    | `/schedules/:id`                     | Get schedule by ID                              |
| `GET`    | `/schedules/category/:categoryId`    | Get schedules by category (with stage filter)   |
| `PUT`    | `/schedules/:id`                     | Update schedule                                 |
| `DELETE` | `/schedules/:id`                     | Delete schedule                                 |

**Features**:

- Automatic time slot allocation
- Lunch break support (default 12:00-14:00)
- Multiple tables parallel matching
- Round-robin within groups
- Knockout bracket generation

---

### 7. Match Management (`/matches`)

**Overview**: Create, manage, and track match results with referee workflow

```
Match Lifecycle:
┌───────────────────────────────────────────────────────┐
│ 1. Create Match (from schedule)                       │
├───────────────────────────────────────────────────────┤
│ 2. Start Match                                        │
│    - Referee confirms match start                    │
│    - Auto-assign 2 referees from available pool     │
├───────────────────────────────────────────────────────┤
│ 3. Finalize Match (Referee submits result)           │
│    - Enter match score, set scores                   │
│    - Generate ELO preview                           │
│    - Status: pending (awaiting approval)            │
├───────────────────────────────────────────────────────┤
│ 4. Chief Referee Approval                            │
│    - Review match result and ELO changes            │
│    - Approve → Results finalized                    │
│    - Reject → Return for review                     │
├───────────────────────────────────────────────────────┤
│ 5. Cascade Updates on Approval:                      │
│    - Update group standings (if group stage)        │
│    - Advance winner in knockout bracket             │
│    - Update player ELO scores                       │
│    - Send notifications                            │
└───────────────────────────────────────────────────────┘

Match Status Flow:
created → started → finalized & pending → approved
                              ↘ rejected ↗
```

#### Match Endpoints

| Method   | Endpoint                        | Purpose                                         |
| -------- | ------------------------------- | ----------------------------------------------- |
| `POST`   | `/matches`                      | Create match                                    |
| `GET`    | `/matches`                      | Get all matches                                 |
| `GET`    | `/matches/pending`              | Get pending matches (chief referee approval)    |
| `GET`    | `/matches/schedule/:scheduleId` | Get matches by schedule                         |
| `GET`    | `/matches/status/:status`       | Get matches by status                           |
| `GET`    | `/matches/:id`                  | Get match by ID                                 |
| `PUT`    | `/matches/:id`                  | Update match                                    |
| `DELETE` | `/matches/:id`                  | Delete match                                    |
| `POST`   | `/matches/:id/start`            | Start match (auto-assign 2 referees)            |
| `POST`   | `/matches/:id/finalize`         | Submit match result (referee)                   |
| `POST`   | `/matches/:id/approve`          | Approve result (chief referee)                  |
| `POST`   | `/matches/:id/reject`           | Reject result with review notes (chief referee) |
| `GET`    | `/matches/:id/elo-preview`      | Preview ELO changes for match                   |
| `GET`    | `/matches/:id/pending-with-elo` | Get pending match with ELO preview              |

#### Athlete Match History

| Method | Endpoint                            | Purpose                                 |
| ------ | ----------------------------------- | --------------------------------------- |
| `GET`  | `/matches/athlete/:userId/upcoming` | Get upcoming matches for athlete        |
| `GET`  | `/matches/athlete/:userId/history`  | Get completed match history for athlete |

#### Match Sets

| Method   | Endpoint          | Purpose            |
| -------- | ----------------- | ------------------ |
| `POST`   | `/match-sets`     | Create match set   |
| `GET`    | `/match-sets`     | Get all match sets |
| `GET`    | `/match-sets/:id` | Get set by ID      |
| `PUT`    | `/match-sets/:id` | Update set         |
| `DELETE` | `/match-sets/:id` | Delete set         |

---

### 8. Group Stage Management (`/group-standings`)

**Overview**: Manage group assignments and track group standings

```
Group Stage Flow:
┌─────────────────────────────────────────┐
│ 1. Generate Group Placeholders           │
│    - Create empty groups                │
├─────────────────────────────────────────┤
│ 2. Random Draw Preview                   │
│    - Preview group assignments          │
├─────────────────────────────────────────┤
│ 3. Save Assignments                      │
│    - Commit group assignments           │
├─────────────────────────────────────────┤
│ 4. Generate Group Matches                │
│    - Create round-robin schedule        │
├─────────────────────────────────────────┤
│ 5. Match Results & Standings             │
│    - After each match: recalculate standings │
│    - Update team positions in group     │
├─────────────────────────────────────────┤
│ 6. Qualified Teams                       │
│    - Get top teams from each group      │
│    - Advance to knockout stage          │
└─────────────────────────────────────────┘
```

#### Group Standing Endpoints

| Method | Endpoint                                 | Purpose                                  |
| ------ | ---------------------------------------- | ---------------------------------------- |
| `POST` | `/group-standings/generate-placeholders` | Generate group placeholders for category |
| `POST` | `/group-standings/random-draw`           | Get random draw preview                  |
| `POST` | `/group-standings/save-assignments`      | Save group assignments                   |
| `POST` | `/group-standings/calculate`             | Recalculate group standings positions    |
| `POST` | `/group-standings/matches/:matchId/sync` | Sync standings after match approval      |
| `GET`  | `/group-standings/:categoryId`           | Get group standings for category         |
| `GET`  | `/group-standings/:categoryId/qualified` | Get qualified teams from group stage     |

---

### 9. Knockout Bracket System (`/knockout-brackets`)

**Overview**: Generate and manage knockout tournament brackets

```
Knockout Bracket Flow:
┌──────────────────────────────────────────────────┐
│ Option 1: Generate from Entries (No Group Stage) │
│  - Direct seed entries into bracket             │
└──────────────────────────────────────────────────┘

OR

┌──────────────────────────────────────────────────┐
│ Option 2: Generate from Group Stage Results      │
│  - Top N teams from each group → bracket        │
└──────────────────────────────────────────────────┘

Bracket Management:
┌──────────────────────────────────────────────────┐
│ 1. Validate Bracket                              │
│    - Check bracket structure integrity           │
├──────────────────────────────────────────────────┤
│ 2. Run Matches                                   │
│    - Create matches for each round               │
├──────────────────────────────────────────────────┤
│ 3. Advance Winners                               │
│    - Auto-advance winners to next round          │
│    - Update bracket state                       │
├──────────────────────────────────────────────────┤
│ 4. Final Standings                               │
│    - Get champion, runner-up, 3rd place          │
└──────────────────────────────────────────────────┘
```

#### Knockout Bracket Endpoints

| Method | Endpoint                                            | Purpose                                        |
| ------ | --------------------------------------------------- | ---------------------------------------------- |
| `POST` | `/knockout-brackets/generate`                       | Generate bracket from entries (no group stage) |
| `POST` | `/knockout-brackets/generate-from-group-stage`      | Generate bracket from group stage winners      |
| `POST` | `/knockout-brackets/validate`                       | Validate bracket structure integrity           |
| `POST` | `/knockout-brackets/advance-winner`                 | Advance winner to next round                   |
| `GET`  | `/knockout-brackets/category/:categoryId/tree`      | Get full bracket tree structure                |
| `GET`  | `/knockout-brackets/category/:categoryId/standings` | Get tournament standings (final positions)     |
| `GET`  | `/knockout-brackets/category/:categoryId/entry`     | Get brackets by entry (ID or name)             |

---

### 10. ELO Rating System

#### ELO Scores (`/elo-scores`)

**Overview**: Manage player ELO ratings

```
ELO System Flow:
┌──────────────────────────────────────────────┐
│ 1. Initial ELO Score (1200 default)          │
│    - Created when user first plays           │
├──────────────────────────────────────────────┤
│ 2. Match Result Processing                   │
│    - Calculate ELO change based on:          │
│      - Current ratings                       │
│      - Match outcome (win/loss/draw)        │
│      - K-factor (volatility)                │
├──────────────────────────────────────────────┤
│ 3. After Match Approval                      │
│    - Update player ELO scores                │
│    - Record ELO change in history            │
├──────────────────────────────────────────────┤
│ 4. Leaderboard Generation                    │
│    - Sort players by ELO rating              │
│    - Public ranking display                  │
└──────────────────────────────────────────────┘
```

| Method   | Endpoint                  | Purpose                                |
| -------- | ------------------------- | -------------------------------------- |
| `POST`   | `/elo-scores`             | Create ELO score                       |
| `GET`    | `/elo-scores`             | Get all ELO scores                     |
| `GET`    | `/elo-scores/leaderboard` | Get ELO leaderboard (sorted by rating) |
| `GET`    | `/elo-scores/:id`         | Get ELO score by ID                    |
| `PUT`    | `/elo-scores/:id`         | Update ELO score                       |
| `DELETE` | `/elo-scores/:id`         | Delete ELO score                       |

#### ELO History (`/elo-histories`)

| Method | Endpoint             | Purpose                  |
| ------ | -------------------- | ------------------------ |
| `POST` | `/elo-histories`     | Create ELO history entry |
| `GET`  | `/elo-histories`     | Get all history entries  |
| `GET`  | `/elo-histories/:id` | Get history entry by ID  |

---

### 11. System Administration

#### Roles & Permissions

| Method   | Endpoint            | Purpose              |
| -------- | ------------------- | -------------------- |
| `POST`   | `/roles`            | Create role          |
| `GET`    | `/roles`            | Get all roles        |
| `GET`    | `/roles/:id`        | Get role by ID       |
| `GET`    | `/roles/name/:name` | Get role by name     |
| `PUT`    | `/roles/:id`        | Update role          |
| `DELETE` | `/roles/:id`        | Delete role          |
| `POST`   | `/permissions`      | Create permission    |
| `GET`    | `/permissions`      | Get all permissions  |
| `GET`    | `/permissions/:id`  | Get permission by ID |
| `PUT`    | `/permissions/:id`  | Update permission    |
| `DELETE` | `/permissions/:id`  | Delete permission    |

---

### 12. Real-time Notifications (`/notifications`)

**Overview**: Real-time notification delivery via Socket.IO

```
Notification Flow:
┌──────────────────────────────────────────┐
│ Event Occurs (match finished, payment, etc) │
├──────────────────────────────────────────┤
│ ↓ Create Notification Record             │
├──────────────────────────────────────────┤
│ ↓ Send to Connected User(s)              │
│   (via Socket.IO if connected)           │
├──────────────────────────────────────────┤
│ ↓ User Disconnects?                      │
│   (Notification stored in DB)            │
└──────────────────────────────────────────┘
```

| Method | Endpoint                            | Purpose                      |
| ------ | ----------------------------------- | ---------------------------- |
| `POST` | `/notifications/send`               | Send notification to user(s) |
| `POST` | `/notifications/event`              | Send custom event            |
| `GET`  | `/notifications/connected-users`    | Get all connected users      |
| `GET`  | `/notifications/status/:userId`     | Check user connection status |
| `POST` | `/notifications/disconnect/:userId` | Disconnect user              |
| `GET`  | `/notifications/status`             | Get service status           |

**Socket.IO Events**:

- `notification:match_result` - Match result updated
- `notification:payment_confirmed` - Payment confirmed
- `notification:referee_invitation` - Referee invitation sent
- `notification:entry_joined` - Member joined team
- Custom event types as needed

---

## Main Business Workflows

### Workflow 1: Complete Tournament Setup & Execution

```
Phase 1: Setup (Pre-Registration)
┌─────────────────────────────────────────────┐
│ 1. Create Tournament                        │
│    - Name, dates, location, number of tables│
│    - Status: created                        │
│ 2. Create Categories                        │
│    - Name, game type, participant count     │
└─────────────────────────────────────────────┘
         ↓ (Manual or scheduled status update)

Phase 2: Registration
┌─────────────────────────────────────────────┐
│ Tournament Status: registration_open        │
│ 1. Users Register                           │
│    - Create teams or join teams             │
│ 2. Team Formation                           │
│    - Add members, transfer captaincy        │
│ 3. Process Payments                         │
│    - Confirm entry payments                 │
│ 4. Check Eligibility                        │
│    - Disqualify invalid entries             │
└─────────────────────────────────────────────┘
         ↓ (Manual status update when ready)

Phase 3: Scheduling
┌─────────────────────────────────────────────┐
│ Tournament Status: registration_closed      │
│ 1. Invite Referees                          │
│    - Send referee invitations               │
│ 2. Generate Schedules                       │
│    - Group stage + knockout bracket         │
│ 3. Create Matches                           │
│    - From schedule, awaiting play           │
└─────────────────────────────────────────────┘
         ↓ (Manual status update when ready)

Phase 4: Execution
┌─────────────────────────────────────────────┐
│ Tournament Status: brackets_generated       │
│ 1. Run Matches                              │
│    - Start → Finalize → Approve → Results  │
│ 2. Update Standings                         │
│    - Group stage standings sync             │
│    - Knockout bracket advancement           │
│ 3. Update ELO Ratings                       │
│    - Player ratings updated per match      │
│ 4. Generate Final Results                   │
│    - Champion, runner-up, standings         │
└─────────────────────────────────────────────┘
```

### Workflow 2: Entry Registration & Team Formation

```
Solo Registration
┌─────────────────────────────────────┐
│ 1. POST /entries/register (solo)    │
│    - Create entry as sole member    │
│ 2. Payment (POST /payments)         │
│ 3. Entry ready for tournament       │
└─────────────────────────────────────┘

Team Registration (Create Team)
┌──────────────────────────────────────────┐
│ 1. POST /entries/register (team)        │
│    - Organizer creates entry            │
│ 2. Team Members Added:                  │
│    - POST /:entryId/add-member          │
│    - Members confirm membership         │
│ 3. Captain confirms lineup              │
│    - POST /:entryId/confirm-lineup      │
│ 4. Payment (POST /payments)             │
└──────────────────────────────────────────┘

Team Registration (Join Team)
┌──────────────────────────────────────────┐
│ 1. Get available teams                   │
│    - GET /entries/category/:categoryId   │
│ 2. POST /join-request for team           │
│ 3. Captain reviews request               │
│    - GET /:entryId/join-requests         │
│ 4. Captain approves                      │
│    - POST /join-requests/:id/respond     │
│ 5. Member joins team                     │
│ 6. Captain confirms lineup               │
│ 7. Payment (POST /payments)              │
└──────────────────────────────────────────┘
```

### Workflow 3: Match Execution with Referee Approval

```
┌──────────────────────────────────────────────────┐
│ 1. Match Created (from schedule)                 │
│    - Scheduled time, location, teams            │
├──────────────────────────────────────────────────┤
│ 2. Referee Starts Match                          │
│    - POST /matches/:id/start                    │
│    - Status: started                            │
│    - 2 referees auto-assigned                   │
├──────────────────────────────────────────────────┤
│ 3. Match Completion (Referee)                    │
│    - POST /matches/:id/finalize                 │
│    - Enter scores, set results                  │
│    - Get ELO preview                            │
│    - Status: pending (awaiting approval)        │
├──────────────────────────────────────────────────┤
│ 4. Chief Referee Reviews                         │
│    - GET /matches/:id/pending-with-elo          │
│    - Review ELO impact                          │
├──────────────────────────────────────────────────┤
│ 5a. Approve Result (Chief Referee)              │
│    - POST /matches/:id/approve                  │
│    - Cascading updates:                         │
│      - Update standings (if group)              │
│      - Advance knockout winner                  │
│      - Update ELO scores                        │
│      - Send notifications                       │
├──────────────────────────────────────────────────┤
│ 5b. Reject Result (Chief Referee)               │
│    - POST /matches/:id/reject                   │
│    - Status: rejected                           │
│    - Return to referee for review               │
└──────────────────────────────────────────────────┘
```

### Workflow 4: Payment Confirmation Process

```
┌──────────────────────────────────────────┐
│ 1. User Creates Payment (POST /payments) │
│    - Entry: payment created              │
│    - Status: pending                     │
├──────────────────────────────────────────┤
│ 2. Submit Payment Via:                   │
│    - Cash: POST /payments/cash           │
│    - Online: POST /payments/online       │
│    - Bank: PUT /payments/:id/proof       │
├──────────────────────────────────────────┤
│ 3. Organizer Reviews Pending             │
│    - GET /payments/pending/:categoryId   │
├──────────────────────────────────────────┤
│ 4a. Confirm Payment (Organizer)          │
│    - POST /payments/:id/confirm          │
│    - Status: completed                   │
│    - Entry now eligible for tournament   │
├──────────────────────────────────────────┤
│ 4b. Reject Payment (Organizer)           │
│    - POST /payments/:id/reject           │
│    - Status: failed                      │
│    - User notified, can resubmit         │
├──────────────────────────────────────────┤
│ 4c. Refund Payment (Organizer)           │
│    - POST /payments/:id/refund           │
│    - Status: refunded                    │
│    - Used for cancellations              │
└──────────────────────────────────────────┘
```

---

## State Machines & Status Flows

### Tournament Status Flow

```
created → registration_open → registration_closed → brackets_generated → completed

Transitions:
- Manual: POST /tournaments/update-statuses
- Automatic: Scheduled (cron jobs)
- Reverse: Allowed (rebuild schedules)
```

### Entry Status Flow

```
pending → confirmed → disqualified (optional)

Transitions:
- Pending: Awaiting payment confirmation
- Confirmed: Payment verified, eligible for tournament
- Disqualified: Failed eligibility checks
```

### Match Status Flow

```
created → started → finalized
            ↓        ├→ pending → approved ✓
            └────────┴→ pending → rejected ↻

Transitions:
- created → started: Referee initiates
- started → finalized: Referee submits result
- finalized → pending: Result awaiting approval
- pending → approved: Chief referee confirms (cascades)
- pending → rejected: Chief referee returns for review
```

### Payment Status Flow

```
pending → completed (✓ entry eligible)
    ├→ failed (✗ rejected by organizer)
    └→ refunded (payment cancelled)
```

### Referee Invitation Status Flow

```
pending → accepted (✓ active referee)
    ├→ rejected (✗ declined by referee)
    ├→ cancelled (✗ cancelled by organizer)
    └→ expired (✗ no response within N hours)
```

### ELO Rating Impact

```
Match Approved
    ↓
Calculate ELO Delta:
  - Winner: +N points
  - Loser: -N points
  - Based on: current ratings, K-factor, result type
    ↓
Update Player ELO Scores
    ↓
Record ELO History Entry
    ↓
Update Leaderboard
```

---

## Data Models & Relationships

### Core Entity Relationships

```
User
  ├─ Entry (1→N): Participate in tournaments
  ├─ TournamentReferee (1→N): Referee assignments
  ├─ Payment (1→N): Entry payments
  ├─ ELOScore (1→N): Rating per game
  └─ ELOHistory (1→N): Rating change log

Tournament
  ├─ Category (1→N): Multiple divisions
  ├─ Schedule (1→N): Match schedules
  ├─ Match (1→N): Tournament matches
  └─ TournamentReferee (1→N): Assigned referees

Category
  ├─ Entry (1→N): Teams/participants
  ├─ Payment (1→N): Entry fees
  ├─ Schedule (1→N): Category schedules
  ├─ GroupStanding (1→N): Group stage
  └─ KnockoutBracket (1→N): Knockout brackets

Entry
  ├─ EntryMember (1→N): Team members
  ├─ Match (1→N): Matches with this entry
  ├─ Payment (1→N): Payment records
  └─ JoinRequest (1→N): Member requests

Schedule
  └─ Match (1→N): Matches in this schedule

Match
  ├─ MatchSet (1→N): Individual sets/games
  ├─ Referee (N→M): 2 assigned referees
  └─ ELODelta (computed): Rating changes

GroupStanding
  └─ GroupTeam (1→N): Teams in group with standings

KnockoutBracket
  └─ BracketMatch (1→N): Bracket matches

Role & Permission
  └─ User-Role-Permission mapping
```

### Key Data Entities

```
User
├─ id, email, password, firstName, lastName
├─ avatar, dateOfBirth, phone, gender
├─ emailVerified, createdAt, role

Tournament
├─ id, name, description
├─ startDate, endDate, location
├─ numberOfTables, maxTeamSize
├─ status (created, registration_open, registration_closed, brackets_generated)

Category
├─ id, tournamentId, name, description
├─ participantCount, prizePool

Entry
├─ id, categoryId, teamName (if team), captain
├─ status (pending, confirmed, disqualified)

Match
├─ id, categoryId, scheduleId
├─ team1Id, team2Id (OR team1-solo, team2-solo)
├─ score, sets, status
├─ referee1Id, referee2Id (assigned automatically)

Payment
├─ id, entryId, amount
├─ method (cash, bank_transfer, online)
├─ status (pending, completed, failed, refunded)
├─ proofImageUrl

TournamentReferee
├─ id, tournamentId, userId
├─ role (referee, chief_referee)
├─ status (active)

RefereeInvitation
├─ id, tournamentId, userId, refereeRole
├─ status (pending, accepted, rejected, cancelled, expired)
├─ expiryDate

ELOScore
├─ id, userId, gameType
├─ rating (initial: 1200)
├─ lastUpdated

ELOHistory
├─ id, userId, matchId
├─ previousRating, newRating, delta
├─ timestamp
```

---

## Real-time Features

### Socket.IO Integration

**Connection**: `/api/notifications` namespace

**Events**:

```javascript
// Client emits
socket.emit("join:room", { userId: "user_123" });

// Server broadcasts
io.to(userId).emit("notification:match_result", {
  matchId: "match_123",
  team1Score: 2,
  team2Score: 1,
  winner: "team1",
  timestamp: Date.now(),
});

io.to(userId).emit("notification:referee_invitation", {
  tournamentId: "tour_123",
  tournamentName: "Spring Tournament",
  role: "referee",
  expiryDate: "2026-04-07",
});

io.to(userId).emit("notification:payment_confirmed", {
  entryId: "entry_123",
  amount: 500000,
  timestamp: Date.now(),
});
```

**Key Events**:

- `notification:match_result` - Match finalized & approved
- `notification:referee_invitation` - New referee invitation
- `notification:payment_confirmed` - Payment approved
- `notification:entry_member_joined` - New member joined team
- `notification:group_standings_updated` - Group stage standings changed
- `notification:knockout_advanced` - Advancement in bracket
- Custom events as needed

---

## Error Handling & Status Codes

### HTTP Status Codes Used

| Code  | Meaning              | Example                                                 |
| ----- | -------------------- | ------------------------------------------------------- |
| `200` | OK                   | Successful GET request                                  |
| `201` | Created              | Resource successfully created                           |
| `400` | Bad Request          | Invalid input data                                      |
| `401` | Unauthorized         | Missing/invalid auth token                              |
| `403` | Forbidden            | User lacks permission                                   |
| `404` | Not Found            | Resource doesn't exist                                  |
| `409` | Conflict             | Cannot complete (e.g., duplicate, constraint violation) |
| `422` | Unprocessable Entity | Validation error                                        |
| `500` | Server Error         | Internal server error                                   |

### Common Error Scenarios

```json
{
  "error": "NOT_FOUND",
  "message": "Tournament not found",
  "statusCode": 404
}

{
  "error": "VALIDATION_ERROR",
  "message": "Invalid entry data",
  "details": ["Team name is required", "Captain ID is invalid"]
}

{
  "error": "PERMISSION_DENIED",
  "message": "Only captain can add members",
  "statusCode": 403
}

{
  "error": "CONFLICT",
  "message": "Only 1 chief referee allowed per tournament",
  "statusCode": 409
}
```

---

## API Usage Patterns

### Authentication Pattern

```
1. Register: POST /auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

2. Login: POST /auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}

3. Use Token: Add to all protected requests
Header: Authorization: Bearer eyJhbGc...

4. Refresh: POST /auth/refresh
Header: Authorization: Bearer <refresh_token>
```

### Tournament Creation Pattern

```
POST /tournaments
{
  "name": "Spring Championship 2026",
  "startDate": "2026-04-15",
  "endDate": "2026-04-17",
  "location": "Arena A",
  "numberOfTables": 4,
  "categories": [
    {
      "name": "Men's Singles",
      "participantCount": 32,
      "prizePool": 10000000
    },
    {
      "name": "Women's Doubles",
      "participantCount": 16,
      "prizePool": 5000000
    }
  ]
}
```

### Entry Registration Pattern

```
POST /entries/register
{
  "categoryId": "cat_123",
  "teamName": "Alpha Team", // optional for team
  "captainId": "user_456",
  "members": ["user_456", "user_789"] // for team
}

// Organizer verifies payment
POST /payments/:paymentId/confirm

// Entry eligible for tournament
POST /entries/:entryId // status: confirmed
```

### Match Result Pattern

```
1. Referee starts match
POST /matches/:id/start

2. Referee submits result
POST /matches/:id/finalize
{
  "team1Score": 12,
  "team2Score": 8,
  "sets": [
    { "team1": 6, "team2": 4 },
    { "team1": 6, "team2": 4 }
  ]
}

3. Chief referee previews
GET /matches/:id/pending-with-elo
// Shows ELO deltas

4. Chief referee approves
POST /matches/:id/approve

// Cascading updates happen automatically
// - Group standings updated (if applicable)
// - Knockout advancing handled (if applicable)
// - ELO scores updated
// - Notifications sent
```

---

## Configuration & Defaults

```
INVITATION_EXPIRY_HOURS = 48 hours (referees)
DEFAULT_ELO_RATING = 1200
DEFAULT_K_FACTOR = 32 (ELO volatility)
LUNCH_BREAK_START = 12:00
LUNCH_BREAK_END = 14:00
REFEREES_PER_MATCH = 2
MAX_CHIEF_REFEREES = 1 (per tournament)
```

---

## Summary

SmashHub-BE provides a complete tournament management system with:

- **Tournament Setup**: Creation, categories, status management
- **Registration**: Team formation, member management, payments
- **Scheduling**: Automatic group stage + knockout generation
- **Match Management**: Referee workflow with multi-level approval
- **Rating System**: Dynamic ELO scoring with public leaderboards
- **Real-time Updates**: Socket.IO notifications for live events
- **Authorization**: Role-based permission middleware throughout

The system emphasizes data integrity with state machines, cascading updates, and comprehensive audit trails.
