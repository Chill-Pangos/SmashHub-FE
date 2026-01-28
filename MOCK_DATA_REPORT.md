# SmashHub-FE Mock Data Analysis Report

**Ngày tạo:** 29/01/2026  
**Cập nhật lần cuối:** 29/01/2026  
**Mục đích:** Phân loại các screen đang sử dụng mock data và chưa có API implementation

---

## 📊 Tổng Quan

### Thống Kê Tổng Hợp

- **Tổng số screens đã phân tích:** ~50+ page components
- **Category A (Mock data, KHÔNG có API):** 20 screens
- **Category B (Mock data, ĐÃ CÓ API nhưng chưa implement):** 5 screens
- **Category C (Đã sử dụng React Query - hoạt động tốt):** 15 screens

### Trạng Thái UI

✅ **Đã ẩn khỏi UI Frontend** - Các screens sử dụng mock data đã được comment out khỏi routes và navigation.

---

## ✅ CATEGORY C - Đã Sử Dụng React Query (Hoạt Động Tốt)

### 🏆 Chief Referee Module - Match Supervision (ĐÃ HOẠT ĐỘNG)

**Trạng thái:** ✅ Module đã mở lại với tính năng **Giám sát trận đấu**

**Các tính năng hoạt động:**

#### ✅ ScheduledMatches (Trận đấu chờ bắt đầu)
- **File:** `src/pages/ChiefReferee/MatchSupervision/components/ScheduledMatches.tsx`
- **Hooks sử dụng:** `useMatchesByStatus("scheduled")`, `useSchedules`, `useStartMatch`
- **Chức năng:** Xem danh sách trận đấu đã lên lịch, bắt đầu trận đấu

#### ✅ LiveMatches (Trận đấu đang diễn ra)
- **File:** `src/pages/ChiefReferee/MatchSupervision/components/LiveMatches.tsx`
- **Hooks sử dụng:** `useMatchesByStatus("in_progress")`, `useSchedules`
- **Chức năng:** Theo dõi trận đấu đang diễn ra theo thời gian thực

#### ✅ PendingMatchReview (Duyệt kết quả trận đấu)
- **File:** `src/pages/ChiefReferee/MatchSupervision/components/PendingMatchReview.tsx`
- **Hooks sử dụng:** `usePendingMatches`, `usePendingMatchWithElo`, `useApproveMatch`, `useRejectMatch`
- **Chức năng:** Xem danh sách trận đấu chờ duyệt, xem preview ELO, phê duyệt/từ chối kết quả

**API Endpoints đang sử dụng:**
- `GET /matches/status/{status}` - Lấy trận đấu theo trạng thái
- `GET /matches/pending` - Lấy trận đấu chờ duyệt
- `POST /matches/{id}/start` - Bắt đầu trận đấu (Chief Referee)
- `GET /matches/{id}/pending-with-elo` - Xem ELO preview
- `POST /matches/{id}/approve` - Phê duyệt kết quả
- `POST /matches/{id}/reject` - Từ chối kết quả

---

## 🚫 CATEGORY A - Mock Data, KHÔNG CÓ API

Các screens này sử dụng hardcoded mock data và **chưa có React Query hooks tương ứng**.

### 🏆 Chief Referee Module - Các Tính Năng Còn Lại (ĐÃ ẨN)

**Trạng thái:** ⚠️ Chỉ giữ lại "Giám sát trận đấu", ẩn Dashboard/Complaint/Dispute/Decision

#### 1. Dashboard Statistics (Tổng quan)
- **File:** `src/pages/ChiefReferee/ChiefRefereeDashboard/ChiefRefereeDashboard.tsx`
- **Mock data:** `statsData` array (hardcoded metrics)
- **Cần API:** Dashboard statistics endpoint
- **Độ ưu tiên:** 🟡 MEDIUM

#### 2. Complaint Management (Quản lý khiếu nại)
- **File:** `src/pages/ChiefReferee/ComplaintBoard/`
- **Mock data:** Complaint objects, status counts
- **Cần API:** Complaint CRUD operations
- **Độ ưu tiên:** 🔴 HIGH

#### 3. Dispute Resolution (Giải quyết tranh chấp)
- **File:** `src/pages/ChiefReferee/DisputeResolution/`
- **Mock data:** Dispute objects, process history
- **Cần API:** Dispute management APIs
- **Độ ưu tiên:** 🔴 HIGH

#### 4. Decision Log (Nhật ký quyết định)
- **File:** `src/pages/ChiefReferee/DecisionLog/`
- **Mock data:** Decision log entries
- **Cần API:** Decision logging APIs
- **Độ ưu tiên:** 🟡 MEDIUM

#### 5. Incident Report (Báo cáo sự cố)
- **File:** `src/pages/ChiefReferee/MatchSupervision/components/IncidentReport.tsx`
- **Mock data:** Static form (no API integration)
- **Cần API:** Incident reporting APIs
- **Độ ưu tiên:** 🟢 LOW

---

### 👨‍💼 Admin Module (Một Phần Mock Data - ĐÃ ẨN 3/4 SCREENS)

**Trạng thái:** ⚠️ Chỉ giữ lại "Tổng quan hệ thống", ẩn Users/RBAC/Logs

#### 6. User Management (Quản lý người dùng)
- **File:** `src/pages/Admin/UserManagement/components/UserTable.tsx`
- **Mock data:** `mockUsers` array (user management data)
- **Hiện có:** `useAuthQueries`, `useRoleQueries` (CHƯA ĐỦ)
- **Cần API:** User CRUD operations, user search, user role assignment
- **Độ ưu tiên:** 🔴 HIGH
- **Ghi chú:** Có auth hooks nhưng thiếu user management hooks riêng

#### 7. RBAC Settings (Cài đặt phân quyền)

- **Files:**
  - `src/pages/Admin/RBACSettings/components/RoleCards.tsx`
  - `src/pages/Admin/RBACSettings/components/PermissionMatrix.tsx`
  - `src/pages/Admin/RBACSettings/components/RoleDialog.tsx`
- **Mock data:** Role configurations, permission matrices
- **Hiện có:** `useRoleQueries` (CHƯA SỬ DỤNG)
- **Cần làm:** Implement `useRoleQueries` vào các components này
- **Độ ưu tiên:** 🟡 MEDIUM
- **Ghi chú:** ✅ Hook đã có, chỉ cần refactor component

#### 8. System Logs (Nhật ký hệ thống)

- **Files:**
  - `src/pages/Admin/SystemLogs/components/LogsTable.tsx`
  - `src/pages/Admin/SystemLogs/components/LogDetailDialog.tsx`
- **Mock data:** System log entries, detailed log objects
- **Cần API:** System logging, audit trail APIs
- **Độ ưu tiên:** 🟢 LOW (chức năng monitoring, không cấp thiết)

#### 9. System Dashboard Statistics

- **Files:**
  - `src/pages/Admin/SystemDashboard/SystemDashboard.tsx`
  - `src/pages/Admin/SystemDashboard/components/ActivityChart.tsx`
  - `src/pages/Admin/SystemDashboard/components/RecentActivities.tsx`
- **Mock data:** System statistics, activity metrics, recent activities
- **Cần API:** System dashboard statistics endpoint
- **Độ ưu tiên:** 🟡 MEDIUM

**Cách mở lại Admin screens:**

```typescript
// File: src/pages/Admin/Admin.tsx
// Uncomment các case trong renderContent():
case "users":
  return <UserManagement />;
case "rbac":
  return <RBACSettings />;
case "logs":
  return <SystemLogs />;

// File: src/components/custom/AdminSidebar.tsx
// Uncomment menuItems:
{ id: "users", label: "Quản lý người dùng", icon: Users },
{ id: "rbac", label: "Cài đặt phân quyền", icon: Award },
{ id: "logs", label: "Nhật ký hệ thống", icon: Calendar },
```

---

### 📊 Tournament Manager Module (Result & Reports - ĐÃ ẨN 2 SCREENS)

#### 10. Result Correction (Điều chỉnh kết quả)

- **Files:**
  - `src/pages/TournamentManager/ResultCorrection/components/HistoryLog.tsx`
  - `src/pages/TournamentManager/ResultCorrection/components/CorrectionRequestList.tsx`
- **Mock data:** Correction history, correction request lists
- **Cần API:** Result correction workflow, approval system
- **Độ ưu tiên:** 🟡 MEDIUM

#### 11. Reports Center (Trung tâm báo cáo)

- **File:** `src/pages/TournamentManager/ReportsCenter/components/ReportList.tsx`
- **Mock data:** Tournament reports, export data
- **Cần API:** Report generation, export APIs
- **Độ ưu tiên:** 🟢 LOW

#### 12. Tournament Dashboard Statistics

- **File:** `src/pages/TournamentManager/TournamentDashboard/components/ActivityChart.tsx`
- **Mock data:** Activity metrics over time
- **Cần API:** Tournament manager dashboard statistics
- **Độ ưu tiên:** 🟡 MEDIUM

**Cách mở lại screens:**

```typescript
// File: src/pages/TournamentManager/TournamentManagerPage.tsx
case "results":
  return <ResultCorrection />;
case "reports":
  return <ReportsCenter />;

// File: src/components/custom/TournamentManagerSidebar.tsx
// Competition group:
{ id: "results", label: "Điều chỉnh kết quả", icon: Edit },
// Single items:
{ id: "reports", label: "Trung tâm báo cáo", icon: FileText },
```

---

### 🏅 Rankings & Statistics (ĐÃ ẨN 3 SCREENS)

#### 13. Public Rankings (Bảng xếp hạng công khai)

- **File:** `src/pages/Rankings/Rankings.tsx`
- **Mock data:** `topPlayers`, `allPlayers` arrays (player rankings with ELO)
- **Cần API:** Player ranking/leaderboard system
- **Độ ưu tiên:** 🔴 HIGH (tính năng quan trọng cho người dùng)

#### 14. Spectator Rankings

- **File:** `src/pages/Spectator/Rankings/Rankings.tsx`
- **Mock data:** Same as public rankings
- **Cần API:** Player ranking/leaderboard system
- **Độ ưu tiên:** 🔴 HIGH

#### 15. Athlete ELO Statistics

- **File:** `src/pages/Athlete/EloStats/EloStats.tsx`
- **Mock data:** `mockEloData` array (ELO history over time)
- **Cần API:** ELO statistics, ranking history
- **Độ ưu tiên:** 🔴 HIGH

**Cách mở lại screens:**

```typescript
// File: src/router/PublicRoutes.tsx
<Route path="/rankings" element={<Rankings />} />

// File: src/pages/Spectator/SpectatorPage.tsx
case "rankings":
  return <Rankings />;

// File: src/pages/Athlete/AthletePage.tsx
case "elo-stats":
  return <EloStats />;

// Sidebars:
// SpectatorSidebar.tsx, AthleteSidebar.tsx - uncomment menu items
```

---

## ⚠️ CATEGORY B - Mock Data, ĐÃ CÓ API Nhưng Chưa Implement

Các screens này sử dụng mock data nhưng **ĐÃ CÓ React Query hooks** tương ứng. Chỉ cần refactor để sử dụng hooks.

### 🎯 Quick Wins (Dễ Implement)

#### 16. Delegation Management - Delegation Table

- **File:** `src/pages/TournamentManager/DelegationManagement/components/DelegationTable.tsx`
- **Mock data:** `mockDelegations` array
- **✅ Hook available:** `useTeamQueries` (`useTeams`, `useTeam`)
- **Cần làm:** Replace mock data với `useTeams()` hook
- **Độ ưu tiên:** 🔴 HIGH (đã có API, chỉ cần refactor)
- **Ước tính:** 1-2 hours

#### 17. Delegation Management - Athlete List Dialog

- **File:** `src/pages/TournamentManager/DelegationManagement/components/AthleteListDialog.tsx`
- **Mock data:** `mockAthletes` array
- **✅ Hook available:** `useTeamMemberQueries` (`useMembersByTeam`)
- **Cần làm:** Replace mock data với `useMembersByTeam(teamId)` hook
- **Độ ưu tiên:** 🔴 HIGH
- **Ước tính:** 1 hour

#### 18. Delegation Account Management

- **File:** `src/pages/TournamentManager/DelegationAccountManagement/components/AccountTable.tsx`
- **Mock data:** `mockAccounts` array (delegation accounts)
- **✅ Hook available:** `useTeamMemberQueries`
- **Cần làm:** Fetch team member accounts via `useTeamMemberQueries`
- **Độ ưu tiên:** 🟡 MEDIUM
- **Ước tính:** 2 hours

#### 19. Match Management - Match Table

- **File:** `src/pages/TournamentManager/MatchManagement/components/MatchTable.tsx`
- **Mock data:** `mockMatches` array
- **✅ Hook available:** `useMatchQueries` (`useMatches`, `useMatch`)
- **Cần làm:** Replace mock data với `useMatches()` hook + filtering
- **Độ ưu tiên:** 🔴 HIGH (core functionality)
- **Ước tính:** 2-3 hours

#### 20. Tournament Setup Wizard - Delegation Selection

- **File:** `src/pages/TournamentManager/TournamentSetupWizard/components/DelegationSelection.tsx`
- **Mock data:** `mockDelegations` array
- **✅ Hook available:** `useTeamQueries` (`useTeams`)
- **Cần làm:** Fetch available teams/delegations
- **Độ ưu tiên:** 🟡 MEDIUM
- **Ước tính:** 1-2 hours

**Ước tính tổng thời gian implement Category B:** 7-10 hours

---

## ✅ CATEGORY C - Đã Sử Dụng React Query (Hoạt Động Tốt)

Các screens này **ĐÃ ĐƯỢC REFACTOR** và sử dụng React Query hooks. Không cần thay đổi.

### 👀 Spectator Module (Hoàn Thiện)

1. ✅ **SpectatorDashboard** - `useTournaments`, `useSchedules`
2. ✅ **SpectatorTournaments** - `useTournaments`
3. ✅ **SpectatorSchedule** - `useTournaments`, `useSchedules`

### 👥 Team Manager Module (Hoàn Thiện)

4. ✅ **TeamManagerDashboard** - `useTeamsByUser`, `useTournaments`
5. ✅ **TeamTournaments** - `useTournaments`, `useEntriesByTeam`
6. ✅ **TeamSchedule** - `useTournaments`, `useSchedules`, `useEntriesByTeam`
7. ✅ **MyTeam** - `useTeamsByUser`, `useMembersByTeam`

### 🏟️ Tournament Manager Module (Một Phần)

8. ✅ **TournamentList** - `useTournaments`, `useDeleteTournament`
9. ✅ **RecentTournaments** - `useTournaments`
10. ✅ **RefereeAssignment** - `useTournaments`, `useAvailableReferees`
11. ✅ **ScheduleGenerator** - `useTournaments`, `useGenerateSchedule`

---

## 📋 Implementation Roadmap

### Phase 1: Quick Wins (Category B) - 1-2 tuần

**Mục tiêu:** Implement các screens đã có API hooks

1. **Week 1:**
   - ✅ Match Management (`useMatchQueries`)
   - ✅ Delegation Table (`useTeamQueries`)
   - ✅ Athlete List Dialog (`useTeamMemberQueries`)

2. **Week 2:**
   - ✅ Delegation Account Management
   - ✅ Tournament Setup Wizard - Delegation Selection

**Kết quả:** +5 screens hoạt động với real API

---

### Phase 2: Rankings & Statistics - 2-3 tuần

**Mục tiêu:** Implement hệ thống xếp hạng và ELO

**Backend API cần phát triển:**

- `GET /rankings` - Lấy bảng xếp hạng
- `GET /rankings/:userId` - Lấy lịch sử ELO của user
- `GET /statistics/elo-history/:userId` - Chi tiết biến động ELO

**Frontend Implementation:**

1. **Week 1:** Create `useRankingQueries.ts` hook
2. **Week 2:** Refactor Public Rankings + Spectator Rankings
3. **Week 3:** Refactor Athlete ELO Stats

**Kết quả:** +3 screens với ranking system hoàn chỉnh

---

### Phase 3: Chief Referee Module - 3-4 tuần

**Mục tiêu:** Implement toàn bộ chức năng Chief Referee

**Backend API cần phát triển:**

- `POST/GET/PUT/DELETE /complaints` - Complaint CRUD
- `POST/GET/PUT/DELETE /disputes` - Dispute CRUD
- `GET /disputes/:id/history` - Process history
- `POST/GET /decisions` - Decision logging
- `GET /match-supervision/live` - Live supervision data

**Frontend Implementation:**

1. **Week 1:** Create `useComplaintQueries.ts`, `useDisputeQueries.ts`
2. **Week 2:** Refactor ComplaintBoard, DisputeResolution
3. **Week 3:** Refactor DecisionLog, MatchSupervision
4. **Week 4:** Dashboard integration + testing

**Kết quả:** Unlock toàn bộ Chief Referee module

---

### Phase 4: Admin Module - 2-3 tuần

**Mục tiêu:** Hoàn thiện quản trị hệ thống

**Backend API cần phát triển:**

- `POST/GET/PUT/DELETE /users` - User management
- `GET /system/logs` - System logs
- `GET /system/statistics` - Dashboard stats

**Frontend Implementation:**

1. **Week 1:**
   - Create `useUserManagementQueries.ts`
   - Refactor RBAC Settings (sử dụng `useRoleQueries` hiện có)
2. **Week 2:**
   - Refactor User Management
   - Integrate user CRUD operations
3. **Week 3:**
   - System Logs implementation
   - Dashboard statistics

**Kết quả:** Admin module hoàn chỉnh

---

### Phase 5: Reports & Analytics - 1-2 tuần

**Mục tiêu:** Hệ thống báo cáo và phân tích

**Backend API cần phát triển:**

- `GET /reports/tournament/:id` - Tournament reports
- `POST /reports/generate` - Generate custom reports
- `GET /reports/export/:format` - Export reports
- `GET /statistics/tournament/:id` - Tournament statistics

**Frontend Implementation:**

1. **Week 1:** Create `useReportQueries.ts`
2. **Week 2:** Result Correction, Reports Center

**Kết quả:** Complete reports & analytics system

---

## 🎯 Priority Summary

### 🔴 HIGH Priority (Implement First)

1. **Match Management** - Core tournament functionality
2. **Delegation Management** - Tournament registration
3. **Rankings System** - User engagement feature
4. **User Management** - Admin essential feature
5. **Complaint/Dispute System** - Tournament integrity

### 🟡 MEDIUM Priority (Implement Second)

1. **RBAC Settings** (Hook đã có)
2. **Result Correction**
3. **Dashboard Statistics**
4. **Decision Log**

### 🟢 LOW Priority (Nice to Have)

1. **System Logs**
2. **Reports Center**
3. **Activity Charts**

---

## 📊 API Hooks Inventory

### ✅ Available React Query Hooks (13 modules)

```typescript
// src/hooks/queries/index.ts
export * from "./useTournamentQueries"; // ✅ READY
export * from "./useTeamQueries"; // ✅ READY
export * from "./useTeamMemberQueries"; // ✅ READY
export * from "./useEntryQueries"; // ✅ READY
export * from "./useMatchQueries"; // ✅ READY
export * from "./useMatchSetQueries"; // ✅ READY
export * from "./useScheduleQueries"; // ✅ READY
export * from "./useGroupStandingQueries"; // ✅ READY
export * from "./useKnockoutBracketQueries"; // ✅ READY
export * from "./useTournamentRefereeQueries"; // ✅ READY
export * from "./useAuthQueries"; // ✅ READY
export * from "./useRoleQueries"; // ✅ READY
export * from "./queryKeys"; // ✅ READY
```

### ❌ Missing API Hooks (Cần Tạo Mới)

```typescript
// Cần phát triển:
export * from "./useComplaintQueries"; // ❌ TODO
export * from "./useDisputeQueries"; // ❌ TODO
export * from "./useDecisionQueries"; // ❌ TODO
export * from "./useRankingQueries"; // ❌ TODO
export * from "./useUserManagementQueries"; // ❌ TODO
export * from "./useSystemLogQueries"; // ❌ TODO
export * from "./useReportQueries"; // ❌ TODO
export * from "./useStatisticsQueries"; // ❌ TODO
```

---

## 🔧 How to Re-enable Hidden Screens

### Quy Trình Mở Lại Screen:

1. **Implement Backend API** (nếu chưa có)
2. **Create React Query Hook** (nếu chưa có)
3. **Refactor Component** - Replace mock data với hooks
4. **Test Functionality** - Đảm bảo hoạt động đúng
5. **Uncomment UI Elements:**
   - Route definitions (trong `src/router/`)
   - Page switch cases (trong Page components)
   - Sidebar menu items (trong Sidebar components)

### Example: Re-enable Chief Referee Module

```typescript
// Step 1: Backend ready ✅
// Step 2: Create hooks ✅
// File: src/hooks/queries/useComplaintQueries.ts
export function useComplaints() {
  /* ... */
}
export function useCreateComplaint() {
  /* ... */
}

// Step 3: Refactor component ✅
// File: src/pages/ChiefReferee/ComplaintBoard/ComplaintBoard.tsx
const { data: complaints, isLoading } = useComplaints();

// Step 4: Test ✅

// Step 5: Uncomment route
// File: src/router/index.tsx
{
  chiefRefereeRole &&
    ChiefRefereeRoutes({ chiefRefereeRoleId: chiefRefereeRole.id });
}
```

---

## 📈 Progress Tracking

**Hiện tại (29/01/2026):**

- ✅ React Query infrastructure: 100%
- ✅ Core tournament features: 80%
- ⚠️ Chief Referee module: 0% (đã ẩn)
- ⚠️ Admin module: 25% (3/4 screens đã ẩn)
- ⚠️ Rankings system: 0% (đã ẩn)
- ⚠️ Reports & Analytics: 0% (đã ẩn)

**Mục tiêu cuối dự án:**

- 🎯 All screens: 100% React Query integration
- 🎯 Zero mock data screens
- 🎯 Complete feature coverage

---

## 📞 Contact & Support

**Lưu ý quan trọng:**

- Tất cả screens bị ẩn đều có comment `// COMMENTED OUT: ...` để dễ tìm kiếm
- Search trong project với keyword: `COMMENTED OUT` để tìm tất cả features bị ẩn
- File này sẽ được cập nhật khi implement thêm features

**Cuối cùng:**
Báo cáo này giúp team nắm rõ:

1. ✅ Những tính năng nào đã hoạt động (Category C)
2. ⚠️ Những tính năng nào cần refactor (Category B)
3. ❌ Những tính năng nào cần phát triển mới (Category A)

---

**Generated by:** SmashHub Development Team  
**Last Updated:** 29/01/2026  
**Version:** 1.0.0
