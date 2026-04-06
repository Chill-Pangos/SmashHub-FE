# 🏆 SmashHub-BE - Phân Tích Toàn Diện Hệ Thống

> **Tournament Management System** - Nền tảng quản lý giải đấu thể thao (Badminton)

---

## 📋 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Tech Stack](#2-tech-stack)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [Database Models (26 Models)](#4-database-models)
5. [API Routes & Endpoints (21 Route Files)](#5-api-routes--endpoints)
6. [Services (25 Services)](#6-services)
7. [Controllers (19 Controllers)](#7-controllers)
8. [Middlewares](#8-middlewares)
9. [Cron Jobs](#9-cron-jobs)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Business Flow](#11-business-flow)

---

## 1. TỔNG QUAN HỆ THỐNG

**SmashHub-BE** là một hệ thống quản lý giải đấu thể thao toàn diện được xây dựng bằng Node.js + Express + TypeScript.

### Mục Đích
- Quản lý giải đấu thể thao (đặc biệt là Cầu lông/Badminton)
- Hỗ trợ đăng ký, lập lịch, quản lý trận đấu
- Tính toán và theo dõi điểm ELO của người chơi
- Cung cấp API cho frontend và mobile app

### Đặc Điểm Nổi Bật
✅ Hỗ trợ cả vòng bảng (Round Robin) và loại trực tiếp (Knockout)  
✅ Hệ thống ELO rating tự động  
✅ Real-time notifications với Socket.IO  
✅ Role-based access control (RBAC)  
✅ Automated scheduling & cron jobs  
✅ Payment integration  

---

## 2. TECH STACK

### Backend Framework
- **Node.js** + **Express.js 5.1.0**
- **TypeScript** (strict mode)

### Database
- **MySQL 8.0**
- **Sequelize ORM 6.37.7** + **sequelize-typescript**

### Authentication & Security
- **JWT** (jsonwebtoken 9.0.3)
- **bcryptjs 3.0.3** (password hashing)
- **Helmet** (security headers)
- **CORS**

### Real-time Communication
- **Socket.IO 4.8.3**

### Utilities
- **Joi 18.0.2** (validation)
- **Nodemailer 7.0.12** (email)
- **Multer 2.0.2** (file upload)
- **node-cron 4.2.1** (scheduled tasks)
- **qrcode 1.5.4**
- **xlsx** (Excel import/export)

### Documentation
- **Swagger UI**

---

## 3. CẤU TRÚC THỨ MỤC

```
SmashHub-BE/
│
├── src/
│   ├── models/              # 26 Sequelize models (Database entities)
│   │   ├── user.model.ts
│   │   ├── tournament.model.ts
│   │   ├── match.model.ts
│   │   ├── entry.model.ts
│   │   └── ...
│   │
│   ├── services/            # Business logic layer (25+ services)
│   │   ├── tournament.service.ts
│   │   ├── schedule.service.ts
│   │   ├── eloCalculation.service.ts
│   │   └── ...
│   │
│   ├── controllers/         # Request handlers
│   │   ├── tournament.controller.ts
│   │   ├── match.controller.ts
│   │   └── ...
│   │
│   ├── routes/              # API endpoints (16 route modules)
│   │   ├── tournament.routes.ts
│   │   ├── match.routes.ts
│   │   ├── auth.routes.ts
│   │   └── ...
│   │
│   ├── dto/                 # Data Transfer Objects
│   │   └── Validation schemas
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── permission.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   ├── swagger.ts
│   │   └── config.ts
│   │
│   ├── crons/               # Scheduled jobs
│   │   └── Automated tasks
│   │
│   ├── constants/           # Application constants
│   ├── utils/               # Helper functions
│   └── docs/                # API documentation
│
├── database/                # Database migrations/seeds
├── docs/                    # Additional documentation
├── dist/                    # Compiled JavaScript
├── node_modules/
├── package.json
├── tsconfig.json
└── ecosystem.config.json    # PM2 configuration
```

---

## 4. DATABASE MODELS (26 Models)

### User & Auth

**User** (`users` table)
```
Fields: id, firstName, lastName, email, password, isEmailVerified, gender, avatarUrl, dob, phoneNumber
Associations: HasOne EloScore, HasMany EloHistory/EntryMember, BelongsToMany Role
```

**Role** (`roles` table)
```
Fields: id, name, description
System Roles: admin, user, referee, chief_referee, organizer
Associations: BelongsToMany User, Permission
```

**Permission** (`permissions` table)
```
Fields: id, name, description
Associations: BelongsToMany Role
```

**Token** (`tokens` table)
```
Fields: id, userId, token, type(access/refresh), expiresAt, isBlacklisted
```

**OTP** (`otps` table)
```
Fields: id, userId, code, purpose(password_reset/email_verification), expiresAt, isUsed
```

### Tournament Management

**Tournament** (`tournaments` table)
```
Fields: id, name, tier(1-5), status, startDate, endDate, registrationStartDate, 
        registrationEndDate, bracketGenerationDate, location, createdBy, numberOfTables
Status: upcoming, registration_open, registration_closed, brackets_generated, ongoing, completed, cancelled
Associations: BelongsTo User, HasMany TournamentCategory/TournamentReferee
```

**TournamentCategory** (`tournament_categories` table)
```
Fields: id, tournamentId, name, type(single/double/team), maxEntries, maxSets,
        teamFormat(regex: ^[SD](-[SD])+$), minAge, maxAge, minElo, maxElo,
        maxMembersPerEntry, gender(male/female/mixed), isGroupStage, entryFee
Associations: BelongsTo Tournament, HasMany Entry/Schedule
```

**TournamentReferee** (`tournament_referees` table)
```
Fields: id, tournamentId, refereeId, role(main/chief)
```

**RefereeInvitation** (`referee_invitations` table)
```
Fields: id, tournamentId, refereeId, status(pending/accepted/rejected)
```

### Entry Management

**Entry** (`entries` table)
```
Fields: id, categoryId, captainId, name, isAcceptingMembers, requiredMemberCount,
        currentMemberCount, isConfirmed, confirmedAt
Associations: BelongsTo TournamentCategory/User, HasMany EntryMember/Match/Payment/JoinRequest
```

**EntryMember** (`entry_members` table)
```
Fields: id, entryId, userId, joinedAt
Associations: BelongsTo Entry/User
```

**JoinRequest** (`join_requests` table)
```
Fields: id, entryId, userId, status(pending/approved/rejected), rejectionReason
```

### Scheduling

**Schedule** (`schedules` table)
```
Fields: id, categoryId, scheduledAt, stage(group/knockout), groupName,
        knockoutRound(Round of 64/32/16, Quarter-final, Semi-final, Third-place, Final), tableNumber
Associations: BelongsTo TournamentCategory, HasMany Match
```

**GroupStanding** (`group_standings` table)
```
Fields: id, categoryId, groupName, entryId, matchesPlayed, matchesWon, matchesLost,
        setsWon, setsLost, setsDiff, position
```

**KnockoutBracket** (`knockout_brackets` table)
```
Fields: id, categoryId, roundNumber(1-6), bracketPosition, roundName, scheduleId, matchId,
        entryAId, entryBId, winnerEntryId, nextBracketId, previousBracketAId, previousBracketBId,
        status(pending/ready/in_progress/completed), isByeMatch
Tree structure: nextBracketId, previousBracketA/B for navigation
```

### Match Management

**Match** (`matches` table)
```
Fields: id, scheduleId, entryAId, entryBId, status(scheduled/in_progress/completed/cancelled),
        winnerEntryId, resultStatus(pending/approved/rejected), reviewNotes
Associations: BelongsTo Schedule/Entry, HasMany EloHistory/SubMatch/MatchReferee
```

**SubMatch** (`sub_matches` table)
```
Fields: id, matchId, subMatchNumber(1-10), status(scheduled/in_progress/completed),
        winnerTeam(A/B), umpireId, assistantUmpireId
Associations: BelongsTo Match/User, HasMany MatchSet/SubMatchPlayer
```

**SubMatchPlayer** (`sub_match_players` table)
```
Fields: id, subMatchId, entryMemberId, team(A/B)
```

**MatchSet** (`match_sets` table)
```
Fields: id, subMatchId, setNumber, teamAScore, teamBScore
```

**MatchReferee** (`match_referees` table)
```
Fields: id, matchId, refereeId
```

### ELO System

**EloScore** (`elo_scores` table)
```
Fields: id, userId (UNIQUE), score (default: 1000, range: 0-10000)
```

**EloHistory** (`elo_histories` table)
```
Fields: id, userId, matchId, oldScore, newScore, delta
```

### Payment & Notification

**Payment** (`payments` table)
```
Fields: id, entryId, amount, method(cash/bank_transfer/online), status(pending/completed/failed/refunded),
        proofImageUrl, confirmedBy, confirmedAt, transactionRef, refundedAt
```

**Notification** (`notifications` table)
```
Fields: id, userId, type, title, message, data(JSON), isRead
```

### Join Tables
- **UserRole** (`user_roles`) - userId, roleId
- **RolePermission** (`role_permissions`) - roleId, permissionId

### Relationships Summary

```
Tournament 1───* TournamentCategory 1───* Entry 1───* EntryMember *───1 User
                        │                    │
                        │                    │
                   1────* Schedule 1───* Match 1───* SubMatch 1───* MatchSet
                        │                    │           │
                        │                    │           └───* SubMatchPlayer
                  GroupStanding        KnockoutBracket

User *───* Role *───* Permission
User 1───1 EloScore
User 1───* EloHistory *───1 Match
Entry 1───* Payment
Entry 1───* JoinRequest
```

---

## 5. API ROUTES & ENDPOINTS (21 Route Files)

### Auth Routes (`/auth`)
```
POST   /auth/register                    # Đăng ký tài khoản mới
POST   /auth/login                       # Đăng nhập
POST   /auth/refresh-token               # Làm mới access token
POST   /auth/change-password             # Đổi mật khẩu
POST   /auth/logout                      # Đăng xuất (blacklist token)
POST   /auth/forgot-password             # Yêu cầu reset mật khẩu
POST   /auth/verify-otp                  # Xác minh OTP
POST   /auth/reset-password              # Reset mật khẩu với OTP
POST   /auth/send-email-verification     # Gửi OTP xác minh email
POST   /auth/verify-email-otp            # Xác minh email với OTP
```

### Users Routes (`/users`)
```
POST   /users                            # Tạo user (require: user:create)
GET    /users                            # Lấy danh sách users
GET    /users/:id                        # Lấy user theo ID
PUT    /users/:id                        # Cập nhật user (require: user:update)
DELETE /users/:id                        # Xóa user (require: user:delete)
PUT    /users/:id/profile                # Cập nhật profile
```

### Roles Routes (`/roles`)
```
POST   /roles                            # Tạo role (require: roles:create)
GET    /roles                            # Lấy danh sách roles
GET    /roles/:id                        # Lấy role theo ID
PUT    /roles/:id                        # Cập nhật role (require: roles:update)
DELETE /roles/:id                        # Xóa role (require: roles:delete)
GET    /roles/name/:name                 # Lấy role theo tên
```

### Permissions Routes (`/permissions`)
```
POST   /permissions                      # Tạo permission (require: permissions:manage)
GET    /permissions                      # Lấy danh sách permissions
GET    /permissions/:id                  # Lấy permission theo ID
PUT    /permissions/:id                  # Cập nhật permission
DELETE /permissions/:id                  # Xóa permission
```

### Tournaments Routes (`/tournaments`)
```
POST   /tournaments                      # Tạo tournament (với categories)
GET    /tournaments                      # Lấy danh sách tournaments với filter
GET    /tournaments/search               # Tìm kiếm tournaments
GET    /tournaments/:id                  # Lấy tournament theo ID
PUT    /tournaments/:id                  # Cập nhật tournament
DELETE /tournaments/:id                  # Xóa tournament
POST   /tournaments/update-statuses      # Cập nhật statuses hàng loạt
GET    /tournaments/upcoming-changes     # Lấy thay đổi status sắp tới
```

### Tournament Categories Routes (`/tournament-categories`)
```
POST   /tournament-categories            # Tạo category
GET    /tournament-categories            # Lấy danh sách categories
GET    /tournament-categories/:id        # Lấy category theo ID
PUT    /tournament-categories/:id        # Cập nhật category
DELETE /tournament-categories/:id        # Xóa category
```

### Tournament Referees Routes (`/tournament-referees`)
```
POST   /tournament-referees              # Assign referee cho tournament
GET    /tournament-referees              # Lấy danh sách tournament referees
GET    /tournament-referees/:id          # Lấy tournament referee theo ID
DELETE /tournament-referees/:id          # Gỡ referee khỏi tournament
```

### Entries Routes (`/entries`)
```
POST   /entries/register                           # Đăng ký tham gia tournament
GET    /entries/category/:categoryId               # Lấy entries theo category
GET    /entries/category/:categoryId/eligible      # Lấy entries đủ điều kiện
POST   /entries/category/:categoryId/disqualify    # Loại entries không đủ điều kiện
GET    /entries/me                                 # Lấy entries của current user
GET    /entries/:entryId                           # Lấy entry theo ID
PUT    /entries/:entryId                           # Cập nhật entry
DELETE /entries/:entryId                           # Xóa entry
POST   /entries/:entryId/add-member                # Thêm thành viên vào entry
POST   /entries/:entryId/remove-member             # Xóa thành viên khỏi entry
GET    /entries/:entryId/members                   # Lấy danh sách thành viên
POST   /entries/:entryId/leave                     # Rời khỏi entry
POST   /entries/:entryId/set-required-members      # Đặt số lượng thành viên yêu cầu
POST   /entries/:entryId/transfer-captaincy        # Chuyển quyền captain
GET    /entries/:entryId/join-requests             # Lấy yêu cầu tham gia
POST   /entries/join-requests/:joinRequestId/respond  # Phản hồi yêu cầu tham gia
POST   /entries/:entryId/confirm-lineup            # Xác nhận lineup
GET    /entries/:entryId/my-role                   # Lấy role của user trong entry
```

### Entry Import Routes (`/entries`)
```
POST   /entries/import/csv               # Import entries từ CSV
POST   /entries/import/validate          # Validate CSV trước import
```

### Schedules Routes (`/schedules`)
```
GET    /schedules                        # Lấy danh sách schedules
POST   /schedules/generate               # Tạo schedule tự động
POST   /schedules/generate-group-stage   # Tạo schedule vòng bảng
POST   /schedules/generate-complete      # Tạo schedule hoàn chỉnh (group + knockout)
POST   /schedules/generate-knockout-only # Tạo schedule chỉ knockout
POST   /schedules/generate-knockout-stage # Tạo schedule vòng knockout
POST   /schedules/update-knockout        # Cập nhật knockout stage matches
GET    /schedules/:id                    # Lấy schedule theo ID
PUT    /schedules/:id                    # Cập nhật schedule
DELETE /schedules/:id                    # Xóa schedule
GET    /schedules/category/:categoryId   # Lấy schedules theo category
```

### Matches Routes (`/matches`)
```
POST   /matches                          # Tạo match
GET    /matches                          # Lấy danh sách matches
GET    /matches/pending                  # Lấy pending matches chờ approval
GET    /matches/schedule/:scheduleId     # Lấy matches theo schedule
```

### Sub Matches Routes (`/sub-matches`)
```
POST   /sub-matches/create-from-format   # Tạo sub-matches từ team format
POST   /sub-matches/:id/start            # Bắt đầu sub-match
POST   /sub-matches/:id/finalize         # Kết thúc sub-match
POST   /sub-matches/:id/assign-players   # Gán players vào sub-match
GET    /sub-matches/match/:matchId       # Lấy sub-matches theo match
GET    /sub-matches/:id                  # Lấy sub-match theo ID
```

### Match Sets Routes (`/match-sets`)
```
POST   /match-sets                       # Tạo match set
GET    /match-sets                       # Lấy danh sách match sets
GET    /match-sets/:id                   # Lấy match set theo ID
PUT    /match-sets/:id                   # Cập nhật match set
DELETE /match-sets/:id                   # Xóa match set
```

### Sub Match Players Routes (`/sub-match-players`)
```
POST   /sub-match-players                # Tạo sub match player
GET    /sub-match-players                # Lấy danh sách
GET    /sub-match-players/:id            # Lấy theo ID
PUT    /sub-match-players/:id            # Cập nhật
DELETE /sub-match-players/:id            # Xóa
```

### ELO Scores Routes (`/elo-scores`)
```
POST   /elo-scores                       # Tạo ELO score (require: elo:manage)
GET    /elo-scores                       # Lấy danh sách ELO scores
GET    /elo-scores/leaderboard           # Lấy ELO leaderboard
GET    /elo-scores/:id                   # Lấy ELO score theo ID
PUT    /elo-scores/:id                   # Cập nhật ELO score
DELETE /elo-scores/:id                   # Xóa ELO score
```

### ELO Histories Routes (`/elo-histories`)
```
POST   /elo-histories                    # Tạo ELO history (require: elo:manage)
GET    /elo-histories                    # Lấy danh sách ELO histories
GET    /elo-histories/:id                # Lấy ELO history theo ID
DELETE /elo-histories/:id                # Xóa ELO history
GET    /elo-histories/user/:userId       # Lấy ELO history theo user
GET    /elo-histories/match/:matchId     # Lấy ELO history theo match
```

### Group Standings Routes (`/group-standings`)
```
POST   /group-standings                  # Tạo group standing
GET    /group-standings                  # Lấy danh sách
GET    /group-standings/:id              # Lấy theo ID
PUT    /group-standings/:id              # Cập nhật stats
GET    /group-standings/category/:categoryId  # Lấy theo category
```

### Knockout Brackets Routes (`/knockout-brackets`)
```
POST   /knockout-brackets/generate                   # Tạo bracket từ entries
POST   /knockout-brackets/generate-from-group-stage  # Tạo bracket từ group stage
POST   /knockout-brackets/advance-winner             # Advance winner
POST   /knockout-brackets/validate                   # Validate bracket integrity
GET    /knockout-brackets/category/:categoryId/tree      # Lấy bracket tree
GET    /knockout-brackets/category/:categoryId/standings # Lấy standings
GET    /knockout-brackets/category/:categoryId/entry     # Lấy brackets của entry
```

### Payments Routes (`/payments`)
```
POST   /payments                         # Tạo payment
POST   /payments/cash                    # Ghi nhận thanh toán tiền mặt
POST   /payments/online                  # Ghi nhận thanh toán online
GET    /payments/entry/:entryId          # Lấy payments theo entry
GET    /payments/category/:categoryId    # Lấy payments theo category
GET    /payments/category/:categoryId/stats  # Lấy stats payments
GET    /payments/pending/:categoryId     # Lấy pending payments
GET    /payments/:paymentId              # Lấy payment theo ID
POST   /payments/:paymentId/confirm      # Xác nhận payment
POST   /payments/:paymentId/reject       # Từ chối payment
POST   /payments/:paymentId/refund       # Hoàn tiền
PUT    /payments/:paymentId/proof        # Upload proof image
```

### Notifications Routes (`/notifications`)
```
POST   /notifications/send               # Gửi notification
POST   /notifications/event              # Gửi custom event
GET    /notifications/connected-users    # Lấy danh sách users đang kết nối
GET    /notifications/status/:userId     # Kiểm tra kết nối user
POST   /notifications/disconnect/:userId # Ngắt kết nối user
GET    /notifications/status             # Lấy trạng thái service
```

---

## 6. SERVICES (25 Services)

| Service | Main Methods |
|---------|--------------|
| **auth.service** | register, login, refreshToken, changePassword, logout, forgotPassword, verifyOtp, resetPassword, sendEmailVerification, verifyEmailOtp, isTokenBlacklisted, verifyToken, getUserByToken |
| **user.service** | create, findAll, findById, update, updateProfile, delete, findAvailableChiefReferees |
| **tournament.service** | create, findAllWithCategoriesFiltered, findById, findByIdWithCategories, update, delete, getByCreatedBy |
| **tournamentCategory.service** | create, findAll, findById, update, delete, findByTournamentId |
| **entry.service** | register, addMember, removeMember, getById, findByCategoryId, update, delete, getAllMembers, leaveEntry, setRequiredMemberCount, transferCaptaincy, getJoinRequests, respondToJoinRequest, confirmLineup, getEligibleEntries, disqualifyIneligibleEntries, getUserEntries, getUserRoleInEntry |
| **entryMember.service** | create, findAll, findById, delete, findByEntryId |
| **entryImport.service** | importEntriesFromCsv, validateCsv |
| **teamImport.service** | importTeamsFromCsv |
| **match.service** | create, findAll, findById, update, delete, findPendingMatches, findByScheduleId, updateResultStatus, approveMatchResult, rejectMatchResult |
| **schedule.service** | generateSchedule, generateGroupStageSchedule, generateCompleteSchedule, generateKnockoutOnlySchedule, generateKnockoutStageSchedule, updateKnockoutEntries, getSchedulesByCategoryId, findAll, findById, update, delete |
| **subMatch.service** | createFromFormat, start, finalize, assignPlayers, getByMatchId, getById |
| **subMatchPlayer.service** | create, findAll, findById, delete |
| **matchSet.service** | create, update, delete, findBySubMatchId |
| **knockoutBracket.service** | generateFromEntries, generateFromGroupStage, advanceWinner, validateBracketIntegrity, getBracketTree, getStandings, getBracketsByEntry |
| **groupStanding.service** | create, updateStats, getByCategory, findByGroupName |
| **payment.service** | createPayment, recordCashPayment, recordOnlinePayment, getPaymentsByEntry, getPaymentsByCategory, getPaymentStats, getPendingPayments, getPaymentById, confirmPayment, rejectPayment, refundPayment, uploadPaymentProof |
| **eloScore.service** | create, findAll, findById, update, delete, getLeaderboard |
| **eloHistory.service** | create, findAll, findById, delete, findByUserId, findByMatchId |
| **eloCalculation.service** | updateEloForTournament, previewTournamentEloChanges, previewMatchEloChanges |
| **email.service** | sendEmail, sendPasswordResetEmail, sendEmailVerificationEmail, sendNotificationEmail |
| **permission.service** | create, findAll, findById, update, delete |
| **role.service** | create, findAll, findById, update, delete, findByName |
| **rolePermission.service** | assignPermissionToRole, removePermissionFromRole |
| **userRole.service** | assignRoleToUser, removeRoleFromUser |
| **notification.service** | sendNotification, sendEvent, getConnectedUsers, checkUserConnection, disconnectUser |
| **tournamentReferee.service** | assignReferee, removeReferee, getRefereesByTournament |

### ELO Calculation Service (Chi tiết)

**ELO Formula:**
```typescript
const K_FACTOR = 12;
const DEFAULT_ELO = 1000;

expectedScore(ratingA, ratingB) = 1 / (1 + 10^((ratingB - ratingA) / 400))
actualScore(winsA, total) = winsA / total
marginMultiplier(winsA, winsB) = 1 + |winsA - winsB| / (winsA + winsB)
eloDelta = K_FACTOR * marginMultiplier * (actualScore - expectedScore)
newElo = currentElo + eloDelta
```

**Key Methods:**
```typescript
updateEloForTournament(tournamentId)      // Cập nhật ELO sau giải
previewTournamentEloChanges(tournamentId) // Preview toàn giải
previewMatchEloChanges(matchId)           // Preview 1 trận
```

---

## 7. CONTROLLERS (19 Controllers)

| Controller | Methods |
|-----------|---------|
| **auth.controller** | register, login, refreshToken, changePassword, logout, forgotPassword, verifyOtp, resetPassword, sendEmailVerification, verifyEmailOtp |
| **user.controller** | create, findAll, findById, update, updateProfile, delete, getAvailableChiefReferees |
| **tournament.controller** | create, findAllWithCategoriesFiltered, findById, findByIdWithCategories, update, delete, getByCreatedBy, updateStatuses, getUpcomingChanges |
| **tournamentCategory.controller** | create, findAll, findById, update, delete |
| **entry.controller** | register, addMember, removeMember, findByCategoryId, getById, update, delete, getAllMembers, leaveEntry, setRequiredMemberCount, transferCaptaincy, getJoinRequests, respondToJoinRequest, confirmLineup, getEligibleEntries, disqualifyIneligibleEntries, getUserEntries, getUserRoleInEntry |
| **entryImport.controller** | importFromCsv, validateCsv |
| **match.controller** | create, findAll, findPendingMatches, findByScheduleId, getById, updateResultStatus, approveResult, rejectResult |
| **schedule.controller** | generateSchedule, generateGroupStageSchedule, generateCompleteSchedule, generateKnockoutOnlySchedule, generateKnockoutStageSchedule, updateKnockoutEntries, getSchedulesByCategoryId, findAll, findById, update, delete |
| **subMatch.controller** | createFromFormat, start, finalize, assignPlayers, getByMatchId, getById |
| **subMatchPlayer.controller** | create, findAll, findById, update, delete |
| **matchSet.controller** | create, findAll, findById, update, delete |
| **knockoutBracket.controller** | generateFromEntries, generateFromGroupStage, advanceWinner, validateBracketIntegrity, getBracketTree, getStandings, getBracketsByEntry |
| **groupStanding.controller** | create, findAll, findById, updateStats, getByCategory |
| **payment.controller** | createPayment, recordCashPayment, recordOnlinePayment, getPaymentsByEntry, getPaymentsByCategory, getPaymentStats, getPendingPayments, getPaymentById, confirmPayment, rejectPayment, refundPayment, uploadPaymentProof |
| **eloScore.controller** | create, findAll, findById, update, delete, getLeaderboard |
| **eloHistory.controller** | create, findAll, findById, delete, findByUserId, findByMatchId |
| **permission.controller** | create, findAll, findById, update, delete |
| **role.controller** | create, findAll, findById, update, delete, findByName |
| **notification.controller** | sendNotification, sendEvent, getConnectedUsers, checkUserConnection, disconnectUser, getStatus |

---

## 8. MIDDLEWARES

### auth.middleware.ts
- **authenticate**: JWT token verification, token blacklist check
- **optionalAuthenticate**: Optional token verification (không fail nếu không có token)

### permission.middleware.ts
- **checkPermission(requiredPermission)**: Kiểm tra single permission
- **checkAnyPermission(permissions[])**: Kiểm tra ANY permission trong list
- **checkAllPermissions(permissions[])**: Kiểm tra ALL permissions
- **checkRole(role | role[])**: Kiểm tra role

### errorHandler.middleware.ts
- **errorHandler**: Global error handler, parse AppError
- **notFoundHandler**: 404 handler

### emailVerification.middleware.ts
- **emailVerification**: Xác minh email verification

### upload.middleware.ts
- **multer config**: File upload handling (image, CSV)

---

## 9. CRON JOBS

### tournament.cron.ts
1. **autoUpdateTournamentStatus** (Every 15 minutes)
   - `upcoming` → `registration_open` (khi registrationStartDate)
   - `registration_open` → `registration_closed` (khi registrationEndDate)
   - `registration_closed` → `brackets_generated` (khi bracketGenerationDate)

2. **notifyUpcomingStatusChanges** (Every hour at minute 0)
   - Kiểm tra tournaments sắp thay đổi status trong 24 giờ tới
   - Log warnings cho admin

### cleanup.cron.ts
1. **cleanupExpiredOtps** (Every 5 minutes)
   - Xóa OTPs hết hạn hoặc đã sử dụng

2. **cleanupExpiredAccessTokens** (Every 30 minutes)
   - Xóa access tokens hết hạn hoặc bị blacklist

3. **cleanupExpiredRefreshTokens** (Every day at midnight)
   - Xóa refresh tokens hết hạn hoặc bị blacklist

---

## 10. AUTHENTICATION & AUTHORIZATION

### System Roles
- **admin** - Toàn quyền hệ thống
- **user** - Người dùng thường
- **referee** - Trọng tài
- **chief_referee** - Trọng tài trưởng
- **organizer** - Tổ chức giải đấu

### Sample Permissions
```
user:create, user:update, user:delete, user:view
roles:create, roles:update, roles:delete, roles:view
permissions:manage
entries:create, entries:update, entries:delete, entries:view
matches:create, matches:update, matches:approve_result
schedules:create, schedules:update
payments:view, payments:update
elo:manage
notifications:send
tournaments:create, tournaments:update, tournaments:delete
```

### Authentication Flow
1. User đăng ký → Email verification (OTP)
2. User login → Server tạo JWT access token + refresh token
3. Client gửi token trong header: `Authorization: Bearer <token>`
4. Server verify token qua `authenticate` middleware
5. Token hết hạn → Dùng refresh token để lấy access token mới
6. Logout → Token bị blacklist

---

# 📊 CHI TIẾT TOÀN BỘ BUSINESS FLOWS

---

## 🔐 1. AUTHENTICATION FLOWS

### Register Flow
```
1. Validate email format & password strength
2. Check nếu email đã tồn tại → throw error
3. Hash password với bcrypt (salt=10)
4. Create user (isEmailVerified = false)
5. Assign default role "spectator"
6. Generate access token (JWT, expiresIn từ config)
7. Generate refresh token (JWT)
8. Save cả 2 tokens vào DB với expiresAt
9. Return: { user, accessToken, refreshToken }
```

### Login Flow
```
1. Validate email format
2. Find user by email (throw nếu không tồn tại)
3. Compare password với bcrypt
4. Blacklist TẤT CẢ active tokens cũ của user
5. Generate access token + refresh token mới
6. Save tokens vào DB
7. Get user roles từ UserRole table
8. Return: { user(với roles), accessToken, refreshToken }
```

### Logout Flow
```
1. Receive userId
2. Blacklist TẤT CẢ active tokens của user
3. Update: isBlacklisted = true, blacklistedAt = now
```

### Refresh Token Flow
```
1. Receive refreshToken từ request
2. Check token có bị blacklist không
3. Verify JWT signature với JWT_REFRESH_SECRET
4. Find user từ decoded userId
5. Blacklist old refresh token
6. Generate new access token + refresh token
7. Save tokens vào DB
8. Return: { accessToken, refreshToken }
```

### Change Password Flow
```
1. Receive userId, oldPassword, newPassword
2. Validate newPassword strength
3. Find user by id
4. Compare oldPassword với hashed password
5. Hash newPassword
6. Update user.password
```

### Forgot Password Flow
```
1. Receive email
2. Find user by email
3. Generate 6-digit OTP
4. Mark existing unused OTPs as used
5. Create OTP: { userId, code, type: "password_reset", expiresAt: now+5min }
6. Send OTP via email
```

### Verify OTP Flow
```
1. Receive email, otp
2. Find user by email
3. Find OTP: { userId, code, type: "password_reset", isUsed: false }
4. Check OTP không hết hạn (expiresAt > now)
5. Return success
```

### Reset Password Flow
```
1. Receive email, otp, newPassword
2. Validate newPassword strength
3. Find user & verify OTP
4. Check newPassword != currentPassword
5. Hash newPassword & update user.password
6. Mark OTP as used
7. Blacklist tất cả active tokens (security)
8. Send email notification
```

### Email Verification Flow
```
sendEmailVerificationOtp:
1. Receive email, find user
2. Generate OTP (10 minutes expiry)
3. Mark existing OTPs as used
4. Create OTP: { type: "email_verification" }
5. Send email

verifyEmailOtp:
1. Receive email, otp
2. Find user & verify OTP
3. Mark OTP as used
4. Update user.isEmailVerified = true
```

---

## 👤 2. USER MANAGEMENT FLOWS

### Create User
```
Direct DB: User.create(userData)
```

### Update User
```
1. Find user by id
2. Update fields
3. Return updated user
```

### Update Profile
```
Update specific fields: avatarUrl, dob, phoneNumber, gender
```

### Delete User
```
User.destroy({ where: { id } })
Returns: boolean (deletedCount > 0)
```

### Find Available Chief Referees
```
1. Find all users với role "chief_referee"
2. Exclude những users đã assigned làm main referee
3. Return available users
```

---

## 🏆 3. TOURNAMENT FLOWS

### Create Tournament with Categories
```
Transaction:
1. Create Tournament: { name, tier, startDate, endDate, location, status, numberOfTables }
2. Create TournamentCategories:
   - name, type (single/double/team)
   - maxEntries, maxSets
   - teamFormat (VD: "S-D-S" cho doubles format)
   - minAge, maxAge, minElo, maxElo (eligibility)
   - maxMembersPerEntry, gender, isGroupStage, entryFee
3. Return tournament with categories
```

### Update Tournament
```
Transaction:
1. Find tournament
2. Update basic info
3. Delete old categories
4. Create new categories
5. Return updated tournament
```

### Tournament Status Lifecycle
```
draft
  ↓ (registrationStartDate reached - auto by cron)
registration_open
  ↓ (registrationEndDate reached - auto by cron)
registration_closed
  ↓ (bracketGenerationDate reached - auto by cron)
brackets_generated
  ↓ (tournament.startDate - manual)
ongoing
  ↓ (tournament.endDate - manual)
completed
  │
  └─ cancelled (any state can be cancelled)
```

### Auto Update Tournament Status (Cron - Every 15 minutes)
```
1. draft → registration_open (when registrationStartDate <= now)
2. registration_open → registration_closed (when registrationEndDate <= now)
3. registration_closed → brackets_generated (when bracketGenerationDate <= now)
```

---

## 📝 4. ENTRY REGISTRATION FLOWS

### Register Entry (Single)
```
1. Get category + tournament
2. Check registration open (now between registrationStartDate & End)
3. Validate user eligible:
   - Gender check (nếu category có gender restriction)
   - Age check (minAge/maxAge từ DOB)
   - ELO check (minElo/maxElo)
4. Check user not already registered in category
5. Transaction:
   a. Create Entry: { categoryId, captainId=userId, isAcceptingMembers=false,
                      requiredMemberCount=1, currentMemberCount=1 }
   b. Create EntryMember: { entryId, userId, eloAtEntry=currentElo }
6. Return: { entry, message }
```

### Register Entry (Double/Team - Create Team)
```
1-4. Same checks as single
5. Transaction:
   a. Create Entry: { categoryId, captainId=userId, isAcceptingMembers=true,
                      requiredMemberCount=(2 for double, undefined for team),
                      currentMemberCount=1 }
   b. Create EntryMember
6. Return: { entry, message: "Team created" }
```

### Join Team Flow
```
1-4. Same eligibility checks
5. Verify targetEntry exists & accepts members
6. Check not full (currentMemberCount < requiredMemberCount)
7. Check no pending join request already
8. Create JoinRequest: { entryId, userId, status: "pending" }
9. Send notification to team captain
10. Return: { entry, message: "Join request sent" }
```

### Add Member to Entry (Captain)
```
1. Find entry + verify caller is captain
2. Check registration open
3. Check entry accepts members & not full
4. Validate new member eligible
5. Check new member not already registered
6. Transaction:
   a. Create EntryMember
   b. Increment currentMemberCount
   c. Auto-close if now full
7. Return: new member
```

### Remove Member (Captain)
```
1-3. Verify captain during registration
4. Check member not captain
5. Find member in entry
6. Transaction:
   a. Delete EntryMember
   b. Decrement currentMemberCount
   c. Reopen if was closed
```

### Transfer Captaincy
```
1. Verify current captain
2. Check registration open
3. Verify newCaptain is member of entry
4. Update entry.captainId = newCaptainId
```

### Respond to Join Request (Approve/Reject)
```
REJECT:
1. Find join request (status pending)
2. Verify caller is entry captain
3. Update: { status: "rejected", rejectionReason, respondedAt }

APPROVE:
1-3. Same checks
4. Verify entry still accepts members & not full
5. Re-validate user eligible
6. Transaction:
   a. Create EntryMember
   b. Increment currentMemberCount
   c. Auto-close if full
   d. Update joinRequest: { status: "approved" }
```

### Confirm Lineup (Captain)
```
1. Verify captain
2. Check not already confirmed
3. Check registration open
4. Check team has enough members
5. Update: { isConfirmed = true, confirmedAt = now }
```

### Leave Entry (Member)
```
1. Find entry during registration
2. Check caller not captain
3. Find member
4. Transaction:
   a. Delete EntryMember
   b. Decrement currentMemberCount
   c. Reopen if was closed
```

### Set Required Member Count (Team)
```
1. Verify captain
2. Check entry type = team
3. Check registration open
4. Verify count >= currentMemberCount && <= maxMembersPerEntry
5. Update: requiredMemberCount = count
```

### Get Eligible Entries
```
For each entry in category, check:
1. Sufficient members: currentMemberCount >= requiredMemberCount
2. Captain confirmed: isConfirmed = true
3. Payment done: exists Payment with status='completed' (if has fee)
Return: { eligible: [], ineligible: [{entry, reasons}] }
```

### Disqualify Ineligible Entries
```
1. Verify organizer
2. Check registration closed
3. Get ineligible entries
4. Transaction (FK dependency order):
   a. Delete JoinRequests
   b. Delete Payments
   c. Delete EntryMembers
   d. Delete Entries
Return: { deletedCount, deleted: [{entryId, reasons}] }
```

---

## 📅 5. SCHEDULE GENERATION FLOWS

### Schedule Algorithm Decision
```
if (endDate - startDate <= 20 hours) → SingleDayAllocator
else → MultiDayAllocator
```

### Single Day Tournament Allocation
```
- Match duration: 60 min
- Break: 10 min
- Slot = floor(matchIndex / numberOfTables) × 70 minutes
- All matches run parallel up to numberOfTables
- Validation: lastMatchStart <= endDate
```

### Multi Day Tournament Allocation
```
- Match duration: 60 min
- Break: 20 min
- Auto move to next day when exceeds daily end time
- Slot computed by calculating day boundaries
- Validation: lastMatchEnd <= tournamentEnd
```

### Generate Group Stage Schedule
```
1. Verify organizer
2. Get group standings (from groupStanding.generateGroupPreview)
3. Build round-robin pairs from each group
4. Clear existing schedules
5. Get tournament referees
6. For each match:
   a. Get time slot from allocator
   b. Create Schedule: { categoryId, stage:"group", groupName, scheduledAt, tableNumber }
   c. Create Match: { scheduleId, entryAId, entryBId, status:"scheduled" }
   d. Assign referees dynamically
7. Return: { schedules, matches, warning? }
```

### Generate Knockout Schedule
```
1. Verify organizer
2. Get "ready" brackets (status="ready" & isByeMatch=false)
3. For each bracket:
   a. Get time slot
   b. Create Schedule: { categoryId, stage:"knockout", knockoutRound }
   c. Create Match
   d. Update bracket.matchId & bracket.scheduleId
   e. Assign referees
4. Return: { schedules, matches }
```

### Dynamic Referee Assignment
```
When match starts (status → in_progress):
1. Get all tournament referees (role="referee")
2. Count active assignments for each
3. Build workload map
4. Select refs from those with least assignments
5. Assign to match
```

### Referee Assignment Algorithm
```
calcRefsPerMatch(totalMatches, totalRefs):
  if (totalMatches * 2 <= totalRefs * 3) → 2 refs per match
  else → 1 ref per match

assignReferees(workloads, count):
  Sort by assignedCount (ascending)
  Select top `count` with lowest load
```

---

## 🎯 6. MATCH FLOWS

### Start Match
```
1. Verify referee assigned to this match
2. Check status = "scheduled"
3. Update: status = "in_progress"
4. Assign referee dynamically (if multiple refs needed)
5. Return updated match
```

### Finalize Match (Submit Result)
```
1. Verify referee assigned
2. Check status = "in_progress"
3. Get all sets of match
4. Calculate sets won by each entry
5. Verify complete: max(entryASets, entryBSets) >= ceil(maxSets/2) + 1
6. Determine winner
7. Update: { status:"completed", winnerEntryId, resultStatus:"pending" }
```

### Approve Match Result (Chief Referee)
```
1. Verify chief referee of tournament
2. Check status = "completed" & resultStatus = "pending"
3. Verify winnerEntryId set
4. Update: resultStatus = "approved"
5. If stage = "group":
   → Call groupStandingService.updateStandingsAfterMatch
6. If stage = "knockout":
   → Call knockoutBracketService.advanceWinner
```

### Reject Match Result
```
1. Verify chief referee
2. Check status = "completed" & resultStatus = "pending"
3. Verify reviewNotes provided
4. Update: { status:"in_progress", resultStatus:"rejected", reviewNotes, winnerEntryId:null }
→ Referee can re-submit result
```

### Match Status Lifecycle
```
scheduled
  ↓ (referee starts)
in_progress
  ↓ (all sets completed, referee submits)
completed + resultStatus="pending"
  │
  ├── (chief approve) → completed + resultStatus="approved"
  │
  └── (chief reject) → in_progress + resultStatus="rejected"
                            ↓ (referee re-submit)
                       completed + resultStatus="pending"
```

---

## 🏸 7. SUBMATCH & MATCHSET FLOWS

### Create SubMatches from Format
```
1. Verify referee assigned to match
2. Check match.status = "in_progress"
3. Check no submatch exists yet
4. Split teamFormat (VD: "S-D-S" → ["S", "D", "S"])
5. Create submatch per format:
   - subMatchNumber = index+1
   - status = "scheduled"
```

### Start SubMatch
```
1. Verify referee
2. Check status = "scheduled"
3. Update: { status:"in_progress", umpireId:refereeId }
```

### Finalize SubMatch
```
1. Verify referee
2. Check status = "in_progress"
3. Get all sets of submatch
4. Calculate team wins
5. Check không draw (teamASets != teamBSets)
6. Update: { status:"completed", winnerTeam:(A|B) }
```

### Assign Players to SubMatch
```
1. Verify referee
2. Check status = "scheduled"
3. Verify both teamA & teamB have players
4. Delete old assignments
5. BulkCreate SubMatchPlayer: { subMatchId, entryMemberId, team }
```

### Create MatchSet (Score Entry)
```
1. Verify referee assigned to submatch
2. Check submatch.status = "in_progress"
3. Check haven't reached maxSets
4. Check match không có winner yet
5. Validate score logic:
   - Pre-deuce (both < 10): winner has exactly 11, loser < 10
   - Deuce (both >= 10): winner leads by exactly 2
6. Get nextSetNumber
7. Create MatchSet: { subMatchId, setNumber, entryAScore, entryBScore }
```

### Set Scoring Rules (Badminton)
```
Valid set score:
Pre-deuce (both < 10):
  - Winner has exactly 11, loser has < 10

Deuce (both >= 10):
  - Winner leads by exactly 2
  - VD: 12-10, 13-11, 15-13 all valid
```

---

## 📊 8. GROUP STANDING FLOWS

### Calculate Optimal Groups
```
1. Check >= 12 entries
2. Find best groupCount (4, 8, 16, 32, 64) where 3-5 teams per group
3. Distribute entries as evenly as possible
4. Return: { numGroups, teamsPerGroup[], totalSlots }
```

### Generate Group Preview
```
1. Verify chief referee
2. Check registration closed
3. Get eligible entries
4. Calculate optimal groups
5. Shuffle entry IDs randomly
6. Distribute entries to groups
7. Return preview (NOT saved yet)
```

### Save Group Assignments
```
1. Verify chief referee & registration closed
2. Validate assignments (no duplicates, all in category)
3. Transaction:
   a. Delete existing standings
   b. BulkCreate GroupStanding:
      - groupName, entryId, categoryId
      - All stats = 0, position = null
```

### Update Standings After Match
```
1. Verify chief referee
2. Get match (group stage, completed, has winner)
3. Calculate sets won by each entry
4. Transaction:
   a. Increment winner: matchesPlayed++, matchesWon++, setsWon/Lost, setsDiff
   b. Increment loser: matchesPlayed++, matchesLost++, setsWon/Lost, setsDiff
5. Recalculate positions for group
```

### Ranking Algorithm (Position Calculation)
```
Sorting priority (for same group):
1. matchesWon DESC (win count)
2. setsDiff DESC (set difference)
3. Head-to-head result

Algorithm:
1. Pre-fetch all h2h results between standings
2. Sort standings array with comparator
3. Update position field (1, 2, 3...)
```

### Get Qualifiers
```
1. Get standings ordered by groupName & position
2. For each group, return top N entries (default: 2)
3. Validate all standings ranked
```

---

## 🏅 9. KNOCKOUT BRACKET FLOWS

### Bracket Size Calculation
```
POSSIBLE_BRACKET_SIZES = [4, 8, 16, 32, 64, 128, 256]
Calculate smallest power-of-2 >= numEntries
```

### Bye Slot Distribution
```
1. numByes = bracketSize - numEntries
2. Shuffle entries randomly
3. Distribute bye slots evenly between top & bottom halves
4. Shuffle each half
5. Return slots array
```

### Generate from Group Stage (Seeding)
```
1. Verify chief referee
2. Get qualifiers from each group (top N per group)
3. Separate 1st place & 2nd place teams
4. Shuffle each group separately
5. Interleave 1st and 2nd place into different bracket halves
   → Prevents top teams meeting early
6. Call buildBracketTree
```

### Generate from Entries (No Group Stage)
```
1. Verify chief referee & not a group stage category
2. Get eligible entries (>= 4)
3. Call buildBracketTree with entry IDs
```

### Build Bracket Tree
```
1. Check >= MIN_ENTRIES (4)
2. Calculate bracketSize (power of 2)
3. Build slots (entries + bye slots)
4. totalRounds = log2(bracketSize)
5. Transaction:
   a. Delete existing brackets
   b. Round 1: Create numRound1 = bracketSize/2 brackets
      - Pair slots[0-1], [2-3], etc.
      - If both have entries: status = "ready"
      - If one/both null (bye): status = "completed", winnerEntryId auto-filled
   c. Rounds 2..N:
      - Create brackets for winners of previous round
      - Link with previousBracketAId/B, nextBracketId
6. Return all brackets
```

### Advance Winner
```
1. Verify chief referee
2. Get bracket by id
3. Check status != "completed"
4. Verify winnerEntryId is entryA or entryB
5. Transaction:
   a. Update bracket: { winnerEntryId, status:"completed" }
   b. If nextBracketId exists:
      - Determine if winner was from slot A or B
      - Update next bracket's corresponding slot
      - If now both slots filled: nextBracket.status = "ready"
      - Else: nextBracket.status = "pending"
```

### Get Standings (Final Rankings)
```
Return:
{
  champion: winnerEntryId of Final
  runnerUp: loserEntryId of Final
  thirdPlace: [loser entries from both Semi-finals]
  eliminated: [{entryId, eliminatedAt: roundName}, ...]
}
```

### Bracket Integrity Validation
```
Checks:
1. Total brackets = bracketSize - 1 (binary tree property)
2. Round 1 brackets: each has >= 1 entry
3. No duplicate entries in Round 1
4. Bracket linking correct (nextBracketId, previousBracketA/B)
5. All linked brackets exist
```

---

## 📈 10. ELO CALCULATION FLOWS

### ELO Formula Constants
```
K_FACTOR = 12
DEFAULT_ELO = 1000

expectedScore(ratingA, ratingB) = 1 / (1 + 10^((ratingB - ratingA)/400))
marginMultiplier(winsA, winsB) = 1 + |winsA - winsB| / (winsA + winsB)
eloDelta = K_FACTOR × margin × (actual - expected)
```

### Preview Match ELO Changes
```
1. Get match with entries & submatches & sets
2. Get member ELOs for both entries
3. Calculate avgElo per entry
4. Calculate expectedScore for each
5. Calculate actualScore from submatch results
6. Calculate marginMultiplier
7. For each member, calculate delta
8. Return: { entryA/B: {avgElo, expectedScore, actualScore},
             marginMultiplier, changes: [{userId, currentElo, change}] }
```

### Preview Tournament ELO Changes
```
1. Get all approved matches in tournament
2. Build user ELO snapshot (pre-tournament)
3. For each match, calculate deltas
4. Aggregate deltas per user
5. Return: { totalMatches, changes: [{userId, currentElo, finalElo, totalDelta}] }
```

### Update ELO After Tournament
```
1. Get approved matches of tournament
2. Build ELO snapshot
3. For each match:
   a. Get member ELOs from snapshot
   b. Calculate deltas
   c. Aggregate per user
4. Transaction:
   a. For each user:
      - Get or create EloScore
      - Update: score += totalDelta (min 0)
      - Create EloHistory: { userId, matchId, tournamentId, previousElo, newElo, eloDelta }
```

---

## 💳 11. PAYMENT FLOWS

### Create Payment (Bank Transfer/Online)
```
1. Get entry with category
2. Check category has entryFee
3. Check amount matches fee
4. Check no pending/completed payment exists
5. Create Payment: { entryId, amount, method, status:"pending" }
```

### Confirm Payment
```
1. Verify organizer
2. Check payment.status = "pending"
3. If bank_transfer: proofImageUrl required
4. If online: transactionRef required
5. Update: { status:"completed", confirmedBy, confirmedAt }
```

### Reject Payment
```
1. Verify organizer
2. Check status = "pending"
3. Update: status = "failed"
```

### Refund Payment
```
1. Verify organizer
2. Check status = "completed"
3. Update: { status:"refunded", refundedAt }
```

### Record Cash Payment
```
1. Get entry & verify organizer
2. Check no cash payment recorded
3. Create Payment: { method:"cash", status:"completed", confirmedBy, confirmedAt }
```

### Record Online Payment (Webhook)
```
1. Get entry
2. Check transactionRef not already processed
3. Create Payment: { method:"online", status:"completed", transactionRef }
```

### Upload Payment Proof
```
1. Only captain or organizer can upload
2. Check method = "bank_transfer"
3. Check status = "pending"
4. Update: proofImageUrl
```

### Payment Status Lifecycle
```
Bank Transfer/Online:
pending → (confirm) → completed
pending → (reject) → failed

Cash:
Immediately: completed

Refund:
completed → refunded
```

---

## 🔔 12. NOTIFICATION FLOWS

### Socket.IO Connection Management
```
On connection:
1. Client sends "register" event with userId
2. If user already connected: disconnect previous session
3. Store mapping: userId ↔ socketId
4. Join user room: user:${userId}

On disconnect:
1. Remove user mapping
```

### Send Notifications
```
sendToUser(userId, payload):
  io.to(`user:${userId}`).emit("notification", payload)

sendToUsers(userIds, payload):
  For each userId: sendToUser(userId, payload)

sendToRoom(roomId, payload):
  io.to(roomId).emit("notification", payload)
```

### Create & Send Notification
```
1. Create Notification record in DB
2. If user online: send real-time via socket
3. Return notification
```

### Notification Templates
```
Available templates:
- joinRequest(requesterName, entryName)
- joinRequestApproved/Rejected(entryName)
- paymentConfirmed/Rejected/Refunded(categoryName)
- matchScheduled(opponent, scheduledAt)
- matchStartingSoon(opponent, minutesLeft)
- matchResult(opponent, won: boolean)
- tournamentAnnouncement(tournamentName, announcement)
- refereeInvitation(tournamentName)
```

### Mark as Read
```
markAsRead(notificationId, userId):
  Update: isRead=true, readAt=now

markAllAsRead(userId):
  Update all unread to read
```

---

## ⏰ 13. CRON JOB FLOWS

### Tournament Status Auto-Update (Every 15 minutes)
```
1. draft → registration_open (registrationStartDate passed)
2. registration_open → registration_closed (registrationEndDate passed)
3. registration_closed → brackets_generated (bracketGenerationDate passed)
Log updates
```

### Tournament Status Change Notification (Every hour)
```
Check tournaments that will change status in next 24 hours
Log warnings for admin
```

### Cleanup Expired OTPs (Every 5 minutes)
```
Delete OTPs where: expiresAt < now OR isUsed = true
```

### Cleanup Expired Access Tokens (Every 30 minutes)
```
Delete access tokens where: expiresAt < now OR isBlacklisted = true
```

### Cleanup Expired Refresh Tokens (Every day at midnight)
```
Delete refresh tokens where: expiresAt < now OR isBlacklisted = true
```

---

## 📋 14. KEY BUSINESS LOGIC SUMMARIES

### Tournament Eligibility Checks
```
User eligible for category if:
✓ Gender matches (if category.gender != "mixed")
✓ Age within range (if category has age restriction)
✓ ELO within range (if category has ELO restriction)
✓ Not already registered in same category
```

### Entry Eligibility for Competition
```
Entry eligible if:
✓ Sufficient members: currentMemberCount >= requiredMemberCount
✓ Captain confirmed: isConfirmed = true
✓ Payment done: exists Payment with status = "completed" (if fee required)
```

### Match Completion Logic
```
Match complete when:
- One entry wins >= ceil(maxSets/2) + 1 sets
- VD: maxSets=5 → need 3 sets to win
      maxSets=7 → need 4 sets to win
```

### Bracket Generation Seeding
```
1st place teams alternate with 2nd place teams
→ Prevents top teams meeting early
→ Top from Group A & C → Top half
→ Top from Group B & D → Bottom half
```

---

## 🔒 15. PERMISSION CHECKS (Recurring Patterns)

| Action | Required Role |
|--------|---------------|
| Add/remove member, update entry, transfer captaincy, confirm lineup | Captain |
| Approve/reject payments, create schedule, manage group assignments | Organizer |
| Approve/reject match results, validate bracket, generate schedules | Chief Referee |
| Submit match result, manage submatch, score entry | Assigned Referee |
| Register, join team, leave entry, view own matches | Athlete |

---

## 🔄 16. TRANSACTION BOUNDARIES (Critical)

Operations using transactions for consistency:

1. **Tournament Create** - tournament + categories
2. **Entry Register** - entry + add member
3. **Add Member** - create member + increment count
4. **Remove Member** - delete member + decrement count
5. **Disqualify Entries** - delete entries, payments, members, requests (FK order)
6. **Schedule Generation** - delete old + create new schedules/matches
7. **Bracket Generation** - delete old + create new brackets
8. **Update Standings** - increment multiple standings
9. **Advance Winner** - update current bracket + next bracket
10. **ELO Update** - update EloScore + create EloHistory

---

## 📊 SUMMARY

**SmashHub-BE** là một hệ thống **Tournament Management** hoàn chỉnh với:

- ✅ **26 database models** liên kết chặt chẽ
- ✅ **21 API route files** với RESTful design
- ✅ **25 services** xử lý business logic
- ✅ **19 controllers** handle requests
- ✅ **5 middlewares** (auth, permission, error, email, upload)
- ✅ **2 cron job files** (tournament status, cleanup)
- ✅ **ELO rating system** tự động
- ✅ **Real-time updates** qua Socket.IO
- ✅ **RBAC** với 5 roles chính
- ✅ **Group stage + Knockout brackets**
- ✅ **Payment system** (cash, bank transfer, online)
- ✅ **CSV import** cho entries/teams

---

**Created:** 2026-04-06  
**Version:** 3.0 (Complete Flow Analysis)  
**Last Updated:** 2026-04-06
