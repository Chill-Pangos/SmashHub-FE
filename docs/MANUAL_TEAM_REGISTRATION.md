# 🎯 Manual Team Registration Feature

## Tổng Quan

Đã thêm tính năng **đăng ký tham gia thi đấu thủ công** vào trang TeamRegistration. Người dùng bây giờ có 2 lựa chọn để đăng ký đoàn:

### 1. **Import Excel** (Cũ)

- Tải file mẫu Excel
- Import danh sách đoàn với nhiều thành viên cùng lúc

### 2. **Tạo Thủ công** (Mới) ✨

- Tạo đoàn một cách interactif
- Thêm thành viên từng người một
- Quản lý vai trò (team_manager, coach, athlete)

---

## Cấu Trúc Files

### New Files Created:

```
src/
├── services/
│   └── user.service.ts                    # User API service
├── hooks/queries/
│   └── useUserQueries.ts                  # useUsers, useUser hooks
└── pages/TeamManager/TeamRegistration/
    └── components/
        └── ManualTeamRegistration.tsx     # Manual registration component
```

### Modified Files:

```
src/
├── services/index.ts                      # Added userService export
├── hooks/queries/
│   ├── queryKeys.ts                       # Added users query keys
│   └── index.ts                           # Added useUserQueries export
└── pages/TeamManager/TeamRegistration/
    ├── TeamRegistration.tsx               # Added Tabs with Import/Manual
    └── components/index.ts                # Added ManualTeamRegistration export
```

---

## Implementation Details

### 1. ManualTeamRegistration Component

**Location**: `src/pages/TeamManager/TeamRegistration/components/ManualTeamRegistration.tsx`

**Flow**:

1. **Step 1: Form** - Nhập tên đoàn và mô tả
2. **Step 2: Members** - Thêm thành viên và gán vai trò

**API Calls**:

- `POST /api/teams` - Tạo đoàn mới
- `POST /api/team-members` - Thêm thành viên (multiple calls)

**Features**:

- ✅ Validation: Đoàn phải có ít nhất 1 trưởng đoàn
- ✅ Prevent duplicates: Không cho thêm cùng 1 user 2 lần
- ✅ Member management: Thêm/xóa thành viên trước khi lưu
- ✅ Loading states: UI feedback khi gửi request

### 2. TeamRegistration.tsx Updates

**New Tab Structure**:

```
┌─ Import Excel ────────────────┐
├─────────────────────────────────┤
│ • Tải file mẫu                │
│ • Upload file Excel           │
│ • Preview dữ liệu             │
└─────────────────────────────────┘

┌─ Tạo Thủ công ────────────────┐
├─────────────────────────────────┤
│ • Form tạo đoàn               │
│ • Form thêm thành viên        │
│ • Quản lý vai trò             │
└─────────────────────────────────┘
```

### 3. User Service & Hooks

**user.service.ts**:

```typescript
// GET /api/users - Lấy danh sách tất cả users
async getUsers(skip: number, limit: number): Promise<User[]>

// GET /api/users/:id - Lấy user theo ID
async getUserById(id: number): Promise<User>

// GET /api/users/search - Tìm kiếm users
async searchUsers(query: string, skip: number, limit: number): Promise<User[]>
```

**useUserQueries.ts**:

```typescript
// Hook lấy danh sách users
const { data: users } = useUsers(0, 1000);

// Hook lấy user theo ID
const { data: user } = useUser(userId);

// Hook tìm kiếm users
const { data: searchResults } = useSearchUsers(query);
```

---

## User Flow

### Scenario 1: Import Excel

```
1. TeamManager vào "Team Registration"
2. Chọn giải đấu
3. Click tab "Import Excel"
4. Tải file mẫu → Điền dữ liệu → Upload
5. Preview → Xác nhận import
6. Chuyển sang bước đăng ký nội dung
```

### Scenario 2: Tạo Thủ công (NEW)

```
1. TeamManager vào "Team Registration"
2. Chọn giải đấu
3. Click tab "Tạo Thủ công"
4. Nhập tên đoàn + mô tả → Click "Tạo đoàn"
5. Chọn thành viên từ dropdown
6. Gán vai trò (team_manager/coach/athlete)
7. Click "Thêm thành viên"
8. Repeat 5-7 cho tất cả thành viên
9. Click "Xác nhận và lưu" → Tạo đoàn
10. Tự động chuyển sang bước đăng ký nội dung
```

---

## API Endpoints Used

### Get All Users

```
GET /api/users?skip=0&limit=1000
Response: User[]
```

### Create Team

```
POST /api/teams
Body: {
  "tournamentId": number,
  "name": string,
  "description"?: string
}
Response: Team
```

### Create Team Member

```
POST /api/team-members
Body: {
  "teamId": number,
  "userId": number,
  "role": "team_manager" | "coach" | "athlete"
}
Response: TeamMember
```

---

## Type Definitions

### User Type

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  roles: number[];
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Team Member Input

```typescript
interface TeamMemberInput {
  userId: number;
  role: "team_manager" | "coach" | "athlete";
}
```

---

## Error Handling

| Scenario         | Error                                  | Action                       |
| ---------------- | -------------------------------------- | ---------------------------- |
| No team name     | "Vui lòng nhập tên đoàn"               | Toast error                  |
| No team_manager  | "Đoàn phải có ít nhất một trưởng đoàn" | Toast error + disable button |
| Duplicate member | "Thành viên này đã được thêm"          | Toast error                  |
| API failure      | Show error toast                       | Retry available              |

---

## Query Invalidation

After creating members, these queries are invalidated:

- `queryKeys.teamMembers.all`
- `queryKeys.teamMembers.byTeam(teamId)`
- `queryKeys.teamMembers.byUser(userId)`
- `queryKeys.teams.detail(teamId)`

---

## Styling & UX

- ✅ Responsive grid layout (col-span-2 + col-span-1 for form)
- ✅ Loading spinners on all async operations
- ✅ Success/error toast notifications
- ✅ Color-coded role badges (default/secondary/outline)
- ✅ Confirmation dialogs for destructive actions
- ✅ Info boxes with guidelines and validation rules
- ✅ Disabled states on buttons during loading

---

## Future Enhancements

1. **Search users** - Add search input instead of full dropdown
2. **Edit members** - Allow changing member roles after creation
3. **Bulk import** - Support CSV alongside Excel
4. **Member templates** - Save/reuse member lists
5. **Team cloning** - Copy members from previous tournament
6. **Invitation system** - Invite users by email

---

## Testing Checklist

- [ ] Create team with manual registration
- [ ] Add multiple team members with different roles
- [ ] Validation: Prevent team without manager
- [ ] Validation: Prevent duplicate members
- [ ] Delete member from list before saving
- [ ] Go back and retry team creation
- [ ] Success notification after creation
- [ ] Auto-redirect to entry registration
- [ ] Team appears in "My Team" page
- [ ] Team can be used for entry registration
