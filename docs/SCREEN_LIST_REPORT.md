# DANH SÁCH CÁC MÀN HÌNH HỆ THỐNG SMASHHUB - WEB APPLICATION

**Ngày tạo:** 03/02/2026  
**Phiên bản:** Web Application  
**Mục đích:** Liệt kê tất cả các màn hình trong hệ thống SmashHub Web với trạng thái implement

---

## 📊 TỔNG QUAN

### Thống Kê

- **Tổng số màn hình:** 82 màn hình
- **Đã implement hoàn chỉnh (API):** 52 màn hình ✅
- **Sử dụng Mock Data (tạm ẩn):** 20 màn hình ⚠️
- **Có API nhưng chưa tích hợp:** 10 màn hình 🔄

### Chú Thích Trạng Thái

- ✅ **Hoàn chỉnh:** Màn hình đã tích hợp API, hoạt động đầy đủ
- ⚠️ **Mock Data:** Màn hình sử dụng dữ liệu giả, đã ẩn khỏi UI
- 🔄 **Đã có API:** Hook đã có sẵn, cần refactor để tích hợp
- ❌ **Chưa có API:** Backend chưa có endpoint

---

## 1️⃣ MODULE XÁC THỰC (AUTHENTICATION)

### 1.1 Public Authentication Routes

| STT | Tên Màn hình                                 | Mã Use Case | Người dùng | Trạng thái | Route              | Ghi chú                        |
| --- | -------------------------------------------- | ----------- | ---------- | ---------- | ------------------ | ------------------------------ |
| 1   | **LoginScreen** (Đăng nhập)                  | UC-32       | Tất cả     | ✅         | `/signin`          | SignIn.tsx                     |
| 2   | **RegisterScreen** (Đăng ký tài khoản)       | UC-49       | Khách      | ✅         | `/signup`          | SignUp.tsx                     |
| 3   | **ForgotPasswordScreen** (Quên mật khẩu)     | UC-32       | Tất cả     | ✅         | `/forgot-password` | ForgotPassword.tsx             |
| 4   | **VerifyOtpScreen** (Xác thực OTP)           | UC-32       | Tất cả     | ✅         | `/verify-otp`      | VerifyOtp.tsx                  |
| 5   | **ResetPasswordScreen** (Đặt lại mật khẩu)   | UC-32       | Tất cả     | ✅         | `/reset-password`  | ResetPassword.tsx              |
| 6   | **EmailVerificationScreen** (Xác thực email) | UC-49       | Tất cả     | ✅         | `/verify-email`    | EmailVerification.tsx          |
| 7   | **ChangePasswordScreen** (Đổi mật khẩu)      | UC-33       | Tất cả     | ✅         | `/change-password` | ChangePassword.tsx (Protected) |

**Tổng Module Auth:** 7/7 ✅

---

## 2️⃣ MODULE CÔNG KHAI (PUBLIC)

### 2.1 Public Pages

| STT | Tên Màn hình                                               | Mã Use Case  | Người dùng | Trạng thái | Route            | Ghi chú                            |
| --- | ---------------------------------------------------------- | ------------ | ---------- | ---------- | ---------------- | ---------------------------------- |
| 8   | **HomeScreen** (Trang chủ)                                 | UC-41        | Tất cả     | ✅         | `/`              | Home.tsx                           |
| 9   | **PublicTournamentsScreen** (Danh sách giải đấu công khai) | UC-03, UC-36 | Tất cả     | ✅         | `/tournaments`   | PublicTournaments.tsx              |
| 10  | **MasterScoreboardScreen** (Bảng điểm tổng hợp)            | UC-23, UC-24 | Tất cả     | ✅         | `/scoreboard`    | MasterScoreboard.tsx               |
| 11  | **RankingsScreen** (Bảng xếp hạng công khai)               | UC-24, UC-40 | Tất cả     | ⚠️ Mock    | `/rankings` (ẩn) | Rankings.tsx - Chưa có API ranking |

**Tổng Module Public:** 3/4 ✅ | 1 ⚠️

---

## 3️⃣ MODULE QUẢN TRỊ VIÊN (ADMIN)

### 3.1 Admin Dashboard & Management

| STT | Tên Màn hình                                         | Mã Use Case         | Người dùng | Trạng thái | Route                  | Ghi chú                                            |
| --- | ---------------------------------------------------- | ------------------- | ---------- | ---------- | ---------------------- | -------------------------------------------------- |
| 12  | **SystemDashboardScreen** (Tổng quan hệ thống)       | UC-01, UC-42        | Admin      | ✅         | `/admin`               | SystemDashboard.tsx                                |
| 13  | **UserManagementScreen** (Quản lý người dùng)        | UC-01, UC-50, UC-51 | Admin      | ⚠️ Mock    | `/admin/users` (ẩn)    | UserManagement.tsx - Chưa có user CRUD API         |
| 14  | **RBACSettingsScreen** (Cài đặt phân quyền)          | UC-02               | Admin      | ⚠️ Mock    | `/admin/rbac` (ẩn)     | RBACSettings.tsx - Có role API nhưng chưa tích hợp |
| 15  | **SystemLogsScreen** (Nhật ký hệ thống)              | UC-42               | Admin      | ⚠️ Mock    | `/admin/logs` (ẩn)     | SystemLogs.tsx - Chưa có logs API                  |
| 16  | **NotificationManagementScreen** (Quản lý thông báo) | UC-34               | Admin      | ✅         | `/admin/notifications` | NotificationManagement.tsx                         |

**Tổng Module Admin:** 2/5 ✅ | 3 ⚠️

---

## 4️⃣ MODULE QUẢN LÝ GIẢI ĐẤU (TOURNAMENT MANAGER / ORGANIZER)

### 4.1 Tournament Management

| STT | Tên Màn hình                                           | Mã Use Case  | Người dùng | Trạng thái | Route                            | Ghi chú                   |
| --- | ------------------------------------------------------ | ------------ | ---------- | ---------- | -------------------------------- | ------------------------- |
| 17  | **TournamentDashboardScreen** (Dashboard Quản lý giải) | UC-03        | QLGĐ       | ✅         | `/tournament-manager`            | TournamentDashboard.tsx   |
| 18  | **TournamentSetupWizardScreen** (Tạo giải đấu)         | UC-03        | QLGĐ       | ✅         | `/tournament-manager/setup`      | TournamentSetupWizard.tsx |
| 19  | **TournamentListScreen** (Danh sách giải đấu)          | UC-03, UC-04 | QLGĐ       | ✅         | `/tournament-manager/list`       | TournamentList.tsx        |
| 20  | **TournamentDetailScreen** (Chi tiết giải đấu)         | UC-04        | QLGĐ       | ✅         | `/tournament-manager/detail/:id` | TournamentDetail.tsx      |
| 21  | **TournamentUpdateScreen** (Chỉnh sửa giải đấu)        | UC-04        | QLGĐ       | ✅         | `/tournament-manager/update/:id` | TournamentUpdateForm.tsx  |

### 4.2 Delegation & Participants Management

| STT | Tên Màn hình                                                   | Mã Use Case         | Người dùng | Trạng thái | Route                                     | Ghi chú                                |
| --- | -------------------------------------------------------------- | ------------------- | ---------- | ---------- | ----------------------------------------- | -------------------------------------- |
| 22  | **DelegationManagementScreen** (Quản lý đoàn thi đấu)          | UC-06, UC-27        | QLGĐ       | 🔄         | `/tournament-manager/delegations`         | DelegationManagement.tsx - Có team API |
| 23  | **DelegationAccountManagementScreen** (Quản lý tài khoản đoàn) | UC-50, UC-51, UC-52 | QLGĐ       | 🔄         | `/tournament-manager/delegation-accounts` | DelegationAccountManagement.tsx        |

### 4.3 Referee & Schedule Management

| STT | Tên Màn hình                                      | Mã Use Case  | Người dùng | Trạng thái | Route                            | Ghi chú                            |
| --- | ------------------------------------------------- | ------------ | ---------- | ---------- | -------------------------------- | ---------------------------------- |
| 24  | **RefereeAssignmentScreen** (Phân công trọng tài) | UC-05        | QLGĐ       | ✅         | `/tournament-manager/referees`   | RefereeAssignment.tsx              |
| 25  | **ScheduleGeneratorScreen** (Tạo lịch thi đấu)    | UC-07, UC-12 | QLGĐ       | ✅         | `/tournament-manager/scheduling` | ScheduleGenerator.tsx              |
| 26  | **MatchManagementScreen** (Quản lý trận đấu)      | UC-10, UC-11 | QLGĐ       | 🔄         | `/tournament-manager/matches`    | MatchManagement.tsx - Có match API |

### 4.4 Results & Reports (Mock - Hidden)

| STT | Tên Màn hình                                    | Mã Use Case | Người dùng | Trạng thái | Route                              | Ghi chú              |
| --- | ----------------------------------------------- | ----------- | ---------- | ---------- | ---------------------------------- | -------------------- |
| 27  | **ResultCorrectionScreen** (Điều chỉnh kết quả) | UC-13       | QLGĐ       | ⚠️ Mock    | `/tournament-manager/results` (ẩn) | ResultCorrection.tsx |
| 28  | **ReportsCenterScreen** (Trung tâm báo cáo)     | UC-09       | QLGĐ       | ⚠️ Mock    | `/tournament-manager/reports` (ẩn) | ReportsCenter.tsx    |

**Tổng Module Tournament Manager:** 7/12 ✅ | 2 ⚠️ | 3 🔄

---

## 5️⃣ MODULE TỔNG TRỌNG TÀI (CHIEF REFEREE)

### 5.1 Match Supervision (Working)

| STT | Tên Màn hình                                   | Mã Use Case         | Người dùng | Trạng thái | Route                      | Ghi chú                |
| --- | ---------------------------------------------- | ------------------- | ---------- | ---------- | -------------------------- | ---------------------- |
| 29  | **MatchSupervisionScreen** (Giám sát trận đấu) | UC-10, UC-11, UC-12 | Tổng TT    | ✅         | `/chief-referee`           | MatchSupervision.tsx   |
| 30  | **ScheduledMatchesTab** (Trận chờ bắt đầu)     | UC-12               | Tổng TT    | ✅         | Tab trong MatchSupervision | ScheduledMatches.tsx   |
| 31  | **LiveMatchesTab** (Trận đang diễn ra)         | UC-10               | Tổng TT    | ✅         | Tab trong MatchSupervision | LiveMatches.tsx        |
| 32  | **PendingMatchReviewTab** (Duyệt kết quả)      | UC-10, UC-11        | Tổng TT    | ✅         | Tab trong MatchSupervision | PendingMatchReview.tsx |

### 5.2 Complaints & Disputes (Mock - Hidden)

| STT | Tên Màn hình                                        | Mã Use Case                | Người dùng | Trạng thái | Route                            | Ghi chú                   |
| --- | --------------------------------------------------- | -------------------------- | ---------- | ---------- | -------------------------------- | ------------------------- |
| 33  | **ChiefRefereeDashboardScreen** (Dashboard Tổng TT) | UC-08, UC-10               | Tổng TT    | ⚠️ Mock    | `/chief-referee/dashboard` (ẩn)  | ChiefRefereeDashboard.tsx |
| 34  | **ComplaintBoardScreen** (Quản lý khiếu nại)        | UC-08, UC-44, UC-45, UC-46 | Tổng TT    | ⚠️ Mock    | `/chief-referee/complaints` (ẩn) | ComplaintBoard.tsx        |
| 35  | **DisputeResolutionScreen** (Giải quyết tranh chấp) | UC-08, UC-46               | Tổng TT    | ⚠️ Mock    | `/chief-referee/disputes` (ẩn)   | DisputeResolution.tsx     |
| 36  | **DecisionLogScreen** (Nhật ký quyết định)          | UC-13, UC-46               | Tổng TT    | ⚠️ Mock    | `/chief-referee/decisions` (ẩn)  | DecisionLog.tsx           |

**Tổng Module Chief Referee:** 4/8 ✅ | 4 ⚠️

---

## 6️⃣ MODULE TRỌNG TÀI (REFEREE)

### 6.1 Referee Match Management

| STT | Tên Màn hình                                           | Mã Use Case  | Người dùng | Trạng thái | Route               | Ghi chú              |
| --- | ------------------------------------------------------ | ------------ | ---------- | ---------- | ------------------- | -------------------- |
| 37  | **RefereeDashboardScreen** (Dashboard Trọng tài)       | UC-14, UC-15 | Trọng tài  | ✅         | `/referee`          | RefereeDashboard.tsx |
| 38  | **RefereeActiveMatchScreen** (Điều hành trận đấu Live) | UC-14, UC-15 | Trọng tài  | ✅         | Tab trong Dashboard | ActiveMatch.tsx      |
| 39  | **RefereeUpcomingMatchesScreen** (Trận sắp tới)        | UC-14        | Trọng tài  | ✅         | Tab trong Dashboard | UpcomingMatches.tsx  |
| 40  | **RefereeMatchHistoryScreen** (Lịch sử trận đấu)       | UC-15, UC-16 | Trọng tài  | ✅         | `/referee/history`  | MatchHistory.tsx     |

**Tổng Module Referee:** 4/4 ✅

---

## 7️⃣ MODULE TRƯỞNG ĐOÀN (TEAM MANAGER)

### 7.1 Team Management

| STT | Tên Màn hình                                           | Mã Use Case         | Người dùng  | Trạng thái | Route                        | Ghi chú                  |
| --- | ------------------------------------------------------ | ------------------- | ----------- | ---------- | ---------------------------- | ------------------------ |
| 41  | **TeamManagerDashboardScreen** (Dashboard Trưởng đoàn) | UC-27, UC-28        | Trưởng đoàn | ✅         | `/team-manager`              | TeamManagerDashboard.tsx |
| 42  | **MyTeamScreen** (Quản lý đội của tôi)                 | UC-27, UC-48, UC-52 | Trưởng đoàn | ✅         | `/team-manager/my-team`      | MyTeam.tsx               |
| 43  | **TeamRegistrationScreen** (Đăng ký đội thi đấu)       | UC-06, UC-52        | Trưởng đoàn | ✅         | `/team-manager/registration` | TeamRegistration.tsx     |
| 44  | **TeamTournamentsScreen** (Giải đấu của đội)           | UC-03, UC-06        | Trưởng đoàn | ✅         | `/team-manager/tournaments`  | TeamTournaments.tsx      |
| 45  | **TeamScheduleScreen** (Lịch thi đấu đội)              | UC-28, UC-31        | Trưởng đoàn | ✅         | `/team-manager/schedule`     | TeamSchedule.tsx         |

**Tổng Module Team Manager:** 5/5 ✅

---

## 8️⃣ MODULE HUẤN LUYỆN VIÊN (COACH)

### 8.1 Coach Management

| STT | Tên Màn hình                                         | Mã Use Case  | Người dùng | Trạng thái | Route                | Ghi chú              |
| --- | ---------------------------------------------------- | ------------ | ---------- | ---------- | -------------------- | -------------------- |
| 46  | **CoachDashboardScreen** (Dashboard Huấn luyện viên) | UC-18, UC-53 | HLV        | ✅         | `/coach`             | CoachDashboard.tsx   |
| 47  | **CoachAthletesScreen** (Quản lý VĐV)                | UC-18, UC-52 | HLV        | ✅         | `/coach/athletes`    | CoachAthletes.tsx    |
| 48  | **CoachTournamentsScreen** (Giải đấu)                | UC-03        | HLV        | ✅         | `/coach/tournaments` | CoachTournaments.tsx |
| 49  | **CoachScheduleScreen** (Lịch thi đấu)               | UC-17, UC-28 | HLV        | ✅         | `/coach/schedule`    | CoachSchedule.tsx    |
| 50  | **TrainingPlanScreen** (Kế hoạch huấn luyện)         | UC-53, UC-54 | HLV        | ✅         | `/coach/training`    | TrainingPlan.tsx     |

**Tổng Module Coach:** 5/5 ✅

---

## 9️⃣ MODULE VẬN ĐỘNG VIÊN (ATHLETE)

### 9.1 Athlete Profile & Performance

| STT | Tên Màn hình                                               | Mã Use Case         | Người dùng | Trạng thái | Route                     | Ghi chú                                |
| --- | ---------------------------------------------------------- | ------------------- | ---------- | ---------- | ------------------------- | -------------------------------------- |
| 51  | **AthleteDashboardScreen** (Dashboard VĐV)                 | UC-17, UC-18, UC-19 | VĐV        | ✅         | `/athlete`                | AthleteDashboard.tsx                   |
| 52  | **AthleteProfileScreen** (Hồ sơ cá nhân)                   | UC-21, UC-33        | VĐV        | ✅         | `/athlete/profile`        | AthleteProfile.tsx                     |
| 53  | **AthleteTournamentsScreen** (Giải đấu của tôi)            | UC-03, UC-06        | VĐV        | ✅         | `/athlete/tournaments`    | AthleteTournaments.tsx                 |
| 54  | **AthleteScheduleScreen** (Lịch thi đấu cá nhân)           | UC-17, UC-18        | VĐV        | ✅         | `/athlete/schedule`       | AthleteSchedule.tsx                    |
| 55  | **AthleteMatchHistoryScreen** (Lịch sử trận đấu & Kết quả) | UC-19, UC-23        | VĐV        | ✅         | `/athlete/match-history`  | MatchHistory.tsx                       |
| 56  | **EloStatsScreen** (Thống kê ELO)                          | UC-14, UC-40        | VĐV        | ⚠️ Mock    | `/athlete/elo-stats` (ẩn) | EloStats.tsx - Chưa có ELO history API |

**Tổng Module Athlete:** 5/6 ✅ | 1 ⚠️

---

## 🔟 MODULE KHÁN GIẢ (SPECTATOR)

### 10.1 Public Viewing

| STT | Tên Màn hình                                         | Mã Use Case         | Người dùng | Trạng thái | Route                      | Ghi chú                            |
| --- | ---------------------------------------------------- | ------------------- | ---------- | ---------- | -------------------------- | ---------------------------------- |
| 57  | **SpectatorDashboardScreen** (Dashboard Khán giả)    | UC-22, UC-23, UC-24 | Khán giả   | ✅         | `/spectator`               | SpectatorDashboard.tsx             |
| 58  | **SpectatorTournamentsScreen** (Danh sách giải đấu)  | UC-22, UC-36        | Khán giả   | ✅         | `/spectator/tournaments`   | SpectatorTournaments.tsx           |
| 59  | **SpectatorScheduleScreen** (Lịch thi đấu toàn giải) | UC-22, UC-25        | Khán giả   | ✅         | `/spectator/schedule`      | SpectatorSchedule.tsx              |
| 60  | **LiveMatchesScreen** (Trận đấu trực tiếp)           | UC-23, UC-26        | Khán giả   | ✅         | `/spectator/live-matches`  | LiveMatches.tsx                    |
| 61  | **SpectatorRankingsScreen** (Bảng xếp hạng)          | UC-24, UC-40        | Khán giả   | ⚠️ Mock    | `/spectator/rankings` (ẩn) | Rankings.tsx - Chưa có ranking API |

**Tổng Module Spectator:** 4/5 ✅ | 1 ⚠️

---

## 1️⃣1️⃣ CÁC MÀN HÌNH CHUNG (SHARED FEATURES)

### 11.1 Notifications & Communication

| STT | Tên Màn hình                                       | Mã Use Case  | Người dùng | Trạng thái | Route                  | Ghi chú              |
| --- | -------------------------------------------------- | ------------ | ---------- | ---------- | ---------------------- | -------------------- |
| 62  | **NotificationCenterScreen** (Trung tâm thông báo) | UC-30, UC-34 | Tất cả     | ✅         | Component trong Header | NotificationBell.tsx |
| 63  | **NotificationListScreen** (Danh sách thông báo)   | UC-34        | Tất cả     | ✅         | Dropdown trong Header  | NotificationList.tsx |

### 11.2 Complaints & Support

| STT | Tên Màn hình                                     | Mã Use Case         | Người dùng            | Trạng thái | Route          | Ghi chú               |
| --- | ------------------------------------------------ | ------------------- | --------------------- | ---------- | -------------- | --------------------- |
| 64  | **ComplaintTrackingScreen** (Theo dõi khiếu nại) | UC-20, UC-35, UC-43 | VĐV, HLV              | ❌         | Chưa implement | Chưa có complaint API |
| 65  | **SubmitComplaintScreen** (Gửi khiếu nại)        | UC-20, UC-29, UC-43 | VĐV, HLV, Trưởng đoàn | ❌         | Chưa implement | Chưa có complaint API |
| 66  | **ContactSupportScreen** (Liên hệ hỗ trợ)        | UC-16, UC-39        | Tất cả                | ❌         | Chưa implement | Chưa có support API   |

### 11.3 Directory & News

| STT | Tên Màn hình                             | Mã Use Case  | Người dùng | Trạng thái | Route          | Ghi chú               |
| --- | ---------------------------------------- | ------------ | ---------- | ---------- | -------------- | --------------------- |
| 67  | **AthleteDirectoryScreen** (Danh bạ VĐV) | UC-11, UC-38 | Tất cả     | ❌         | Chưa implement | Chưa có directory API |
| 68  | **NewsScreen** (Tin tức & Thông báo)     | UC-09, UC-37 | Tất cả     | ❌         | Chưa implement | Chưa có news API      |

**Tổng Shared Features:** 2/7 ✅ | 5 ❌

---

## 1️⃣2️⃣ CÁC COMPONENT HỖ TRỢ (SUPPORT COMPONENTS)

### 12.1 Layout Components

| STT | Tên Component     | Chức năng                          | Trạng thái | File              | Ghi chú             |
| --- | ----------------- | ---------------------------------- | ---------- | ----------------- | ------------------- |
| 69  | **PublicLayout**  | Layout cho trang công khai         | ✅         | PublicLayout.tsx  | Header + Footer     |
| 70  | **PrivateLayout** | Layout cho người dùng đã đăng nhập | ✅         | PrivateLayout.tsx | Sidebar + Header    |
| 71  | **RoleGuard**     | Bảo vệ route theo vai trò          | ✅         | RoleGuard.tsx     | RBAC implementation |

### 12.2 Sidebar Components

| STT | Tên Component                | Vai trò               | Trạng thái | File                         | Ghi chú      |
| --- | ---------------------------- | --------------------- | ---------- | ---------------------------- | ------------ |
| 72  | **AdminSidebar**             | Sidebar quản trị viên | ✅         | AdminSidebar.tsx             | 3/4 items ẩn |
| 73  | **TournamentManagerSidebar** | Sidebar QLGĐ          | ✅         | TournamentManagerSidebar.tsx | 2 items ẩn   |
| 74  | **ChiefRefereeSidebar**      | Sidebar Tổng TT       | ✅         | ChiefRefereeSidebar.tsx      | 4/5 items ẩn |
| 75  | **RefereeSidebar**           | Sidebar Trọng tài     | ✅         | RefereeSidebar.tsx           | Hoàn chỉnh   |
| 76  | **TeamManagerSidebar**       | Sidebar Trưởng đoàn   | ✅         | TeamManagerSidebar.tsx       | Hoàn chỉnh   |
| 77  | **CoachSidebar**             | Sidebar HLV           | ✅         | CoachSidebar.tsx             | Hoàn chỉnh   |
| 78  | **AthleteSidebar**           | Sidebar VĐV           | ✅         | AthleteSidebar.tsx           | 1 item ẩn    |
| 79  | **SpectatorSidebar**         | Sidebar Khán giả      | ✅         | SpectatorSidebar.tsx         | 1 item ẩn    |

**Tổng Support Components:** 11/11 ✅

---

## 📋 TỔNG KẾT THEO VAI TRÒ

| Vai trò                | Tổng màn hình | Hoàn chỉnh ✅ | Mock ⚠️ | Có API 🔄 | Chưa có ❌ |
| ---------------------- | ------------- | ------------- | ------- | --------- | ---------- |
| **Auth**               | 7             | 7             | 0       | 0         | 0          |
| **Public**             | 4             | 3             | 1       | 0         | 0          |
| **Admin**              | 5             | 2             | 3       | 0         | 0          |
| **Tournament Manager** | 12            | 7             | 2       | 3         | 0          |
| **Chief Referee**      | 8             | 4             | 4       | 0         | 0          |
| **Referee**            | 4             | 4             | 0       | 0         | 0          |
| **Team Manager**       | 5             | 5             | 0       | 0         | 0          |
| **Coach**              | 5             | 5             | 0       | 0         | 0          |
| **Athlete**            | 6             | 5             | 1       | 0         | 0          |
| **Spectator**          | 5             | 4             | 1       | 0         | 0          |
| **Shared Features**    | 7             | 2             | 0       | 0         | 5          |
| **Support Components** | 11            | 11            | 0       | 0         | 0          |
| **TỔNG CỘNG**          | **79**        | **59**        | **12**  | **3**     | **5**      |

---

## 📊 PHÂN TÍCH CHI TIẾT

### ✅ Modules Hoàn Chỉnh (100%)

1. **Authentication** - 7/7 màn hình
2. **Referee** - 4/4 màn hình
3. **Team Manager** - 5/5 màn hình
4. **Coach** - 5/5 màn hình
5. **Support Components** - 11/11 components

### 🟡 Modules Cần Cải Thiện

1. **Admin** - 2/5 (40%) - Thiếu User Management, RBAC, Logs
2. **Chief Referee** - 4/8 (50%) - Thiếu Complaint/Dispute/Decision
3. **Tournament Manager** - 7/12 (58%) - Thiếu Results/Reports, cần tích hợp API

### ⚠️ Features Sử dụng Mock Data (Đã ẩn UI)

1. Rankings/Leaderboard System (3 screens)
2. Admin Management Tools (3 screens)
3. Chief Referee Advanced Features (4 screens)
4. Tournament Reports & Analytics (2 screens)

### 🔄 Screens Có API Nhưng Chưa Tích Hợp

1. DelegationManagement - Có `useTeamQueries`
2. DelegationAccountManagement - Có `useTeamMemberQueries`
3. MatchManagement - Có `useMatchQueries`

### ❌ Features Chưa Implement (Backend + Frontend)

1. Complaint Management System (UC-20, UC-43-47)
2. Support & Contact System (UC-39)
3. News & Announcements (UC-37)
4. Athlete Directory (UC-38)
5. Ranking/Leaderboard System (UC-24, UC-40)

---

## 🎯 ƯU TIÊN PHÁT TRIỂN

### Phase 1: Quick Wins (1-2 tuần)

**Mục tiêu:** Tích hợp API đã có sẵn

1. ✅ MatchManagement (useMatchQueries)
2. ✅ DelegationManagement (useTeamQueries)
3. ✅ DelegationAccountManagement (useTeamMemberQueries)

**Kết quả:** +3 màn hình → 62/79 hoàn chỉnh (78%)

---

### Phase 2: Rankings System (2-3 tuần)

**Mục tiêu:** Implement hệ thống xếp hạng

**Backend API cần phát triển:**

- `GET /rankings` - Lấy bảng xếp hạng
- `GET /rankings/:userId` - Lịch sử ELO
- `GET /statistics/elo-history/:userId` - Biến động ELO

**Frontend Implementation:**

1. Create `useRankingQueries.ts`
2. Refactor PublicRankings + SpectatorRankings
3. Refactor AthleteEloStats

**Kết quả:** +3 màn hình → 65/79 hoàn chỉnh (82%)

---

### Phase 3: Admin Tools (2-3 tuần)

**Mục tiêu:** Hoàn thiện quản trị hệ thống

**Backend API cần phát triển:**

- `POST/GET/PUT/DELETE /users` - User CRUD
- `GET /system/logs` - System logs
- `GET /system/statistics` - Dashboard stats

**Frontend Implementation:**

1. Create `useUserManagementQueries.ts`
2. Refactor UserManagement
3. Integrate RBACSettings với `useRoleQueries`
4. Refactor SystemLogs

**Kết quả:** +3 màn hình → 68/79 hoàn chỉnh (86%)

---

### Phase 4: Chief Referee Advanced (3-4 tuần)

**Mục tiêu:** Unlock complaint & dispute management

**Backend API cần phát triển:**

- `POST/GET/PUT/DELETE /complaints` - Complaint CRUD
- `POST/GET/PUT/DELETE /disputes` - Dispute CRUD
- `POST/GET /decisions` - Decision logging

**Frontend Implementation:**

1. Create `useComplaintQueries.ts`, `useDisputeQueries.ts`
2. Refactor ComplaintBoard
3. Refactor DisputeResolution
4. Refactor DecisionLog

**Kết quả:** +4 màn hình → 72/79 hoàn chỉnh (91%)

---

### Phase 5: Reports & Analytics (2-3 tuần)

**Mục tiêu:** Tournament reports & export

**Backend API cần phát triển:**

- `POST /reports/generate` - Generate reports
- `GET /reports/export` - Export data
- `GET /corrections/history` - Correction history

**Frontend Implementation:**

1. Create `useReportQueries.ts`
2. Refactor ReportsCenter
3. Refactor ResultCorrection

**Kết quả:** +2 màn hình → 74/79 hoàn chỉnh (94%)

---

### Phase 6: Shared Features (3-4 tuần)

**Mục tiêu:** Complete ecosystem features

**Backend API cần phát triển:**

- Complaint tracking system
- Support ticket system
- News & announcements
- Athlete directory

**Frontend Implementation:**

1. ComplaintTracking + SubmitComplaint
2. ContactSupport
3. NewsScreen
4. AthleteDirectory

**Kết quả:** +5 màn hình → 79/79 hoàn chỉnh (100%)

---

## 📝 GHI CHÚ QUAN TRỌNG

### Về Mock Data

- Tất cả các màn hình sử dụng mock data đã được **ẨN KHỎI UI**
- Không ảnh hưởng đến trải nghiệm người dùng
- Sẽ được mở lại khi có API tương ứng

### Về API Integration

- Tất cả màn hình ✅ đều sử dụng **React Query** + **Real API**
- Không có hardcoded data trong production code
- Tuân thủ best practices về state management

### Về RBAC (Role-Based Access Control)

- Tất cả routes đều được bảo vệ bởi **RoleGuard**
- Roles được fetch từ database (không hardcoded)
- Chỉ hiển thị routes nếu role tồn tại trong hệ thống

---

## 🔗 TÀI LIỆU THAM KHẢO

1. **MOCK_DATA_REPORT.md** - Báo cáo chi tiết về mock data
2. **usecase.txt** - Đặc tả use cases
3. **Router files** - Cấu hình routing theo vai trò
4. **Page components** - Implementation các màn hình

---

**Kết luận:** Hệ thống SmashHub Web đã hoàn thành **59/79 màn hình (75%)** với API thực tế. Các màn hình còn lại đang chờ backend API hoặc cần refactor để tích hợp API đã có sẵn.
