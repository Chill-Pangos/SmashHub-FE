# 📊 Manual Team Registration - Architecture & Component Flow

## Component Hierarchy

```
TeamManagerPage
  └── TeamRegistration (Main Page)
       └── Tournament Selection
            ├── Step Selector (Tab Navigation)
            │
            └── Step 1: Team Registration ✨ UPDATED
                 ├── Tabs Container
                 │   ├── Tab 1: "Import Excel"
                 │   │   ├── Download Template Button
                 │   │   ├── Upload File Button
                 │   │   └── Instructions
                 │   │
                 │   └── Tab 2: "Tạo Thủ công" ✨ NEW
                 │       └── ManualTeamRegistration Component
                 │           ├── Step 1: Form
                 │           │   ├── Team Name Input
                 │           │   ├── Team Description Input
                 │           │   └── Create Team Button
                 │           │
                 │           └── Step 2: Members
                 │               ├── Add Member Section
                 │               │   ├── User Select Dropdown
                 │               │   ├── Role Select Dropdown
                 │               │   └── Add Member Button
                 │               │
                 │               ├── Members List Table
                 │               │   ├── Member Name
                 │               │   ├── Email
                 │               │   ├── Role Badge
                 │               │   └── Delete Button
                 │               │
                 │               └── Save Button
                 │
                 └── Continue to Step 2 Button

            └── Step 2: Entry Registration
                 └── [Existing Implementation]
```

---

## Data Flow Diagram

```
User Action                      API Call                    State Update
───────────────────────────────────────────────────────────────────────
1. Input team info
   ↓
2. Click "Tạo đoàn"
   ├──────→ POST /api/teams ────→ setTeamId(newTeam.id)
   │                              setStep("members")
   └──────────────────────────────→ refetch teams list

3. Select user + role
   ↓
4. Click "Thêm thành viên"       [Client-side]
   ├──────────────────────→ setMembers([...members, newMember])
   └──────────────────────→ Update dropdown (exclude added users)

5. Repeat 3-4 for all members
   ↓
6. Click "Xác nhận và lưu"
   ├──────→ POST /api/team-members ────→ Create all members
   │        (for each member in array)   (Promise.all)
   │
   ├──────→ Invalidate Queries ─────→ Refresh data
   │        • teamMembers.all
   │        • teamMembers.byTeam
   │        • teams.detail
   │
   └──────→ onSuccess() callback ───→ Close dialog + redirect
```

---

## File Structure

### New Files

```
src/
├── services/
│   └── user.service.ts (38 lines)
│       ├── getUsers()
│       ├── getUserById()
│       └── searchUsers()
│
└── hooks/queries/
    └── useUserQueries.ts (38 lines)
        ├── useUsers()
        ├── useUser()
        └── useSearchUsers()
```

### New Component

```
src/pages/TeamManager/TeamRegistration/components/
└── ManualTeamRegistration.tsx (370+ lines)
    ├── TeamMemberInput interface
    ├── ManualTeamRegistrationProps interface
    ├── Step 1: Form (tạo đoàn)
    ├── Step 2: Members (thêm thành viên)
    ├── Delete confirmation dialog
    └── Exported in index.ts
```

### Modified Files

```
src/
├── services/index.ts
│   └── +export userService
│
├── hooks/queries/
│   ├── queryKeys.ts
│   │   └── +users object with query keys
│   │
│   └── index.ts
│       └── +export useUserQueries
│
└── pages/TeamManager/TeamRegistration/
    ├── TeamRegistration.tsx
    │   ├── +Tabs import from ui/tabs
    │   ├── +ManualTeamRegistration component
    │   ├── Tab structure in JSX
    │   └── onSuccess callback to redirect
    │
    └── components/index.ts
        └── +export ManualTeamRegistration
```

---

## State Management

### Local State in ManualTeamRegistration

```typescript
// Form Step 1
const [teamName, setTeamName] = useState<string>("");
const [teamDescription, setTeamDescription] = useState<string>("");
const [teamId, setTeamId] = useState<number | null>(null);

// Form Step 2
const [members, setMembers] = useState<TeamMemberInput[]>([]);
const [selectedUserId, setSelectedUserId] = useState<string>("");
const [selectedRole, setSelectedRole] = useState<
  "team_manager" | "coach" | "athlete"
>("coach");

// UI State
const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(false);
const [isSavingMembers, setIsSavingMembers] = useState<boolean>(false);
const [step, setStep] = useState<"form" | "members">("form");
```

### React Query State

```typescript
// Query Hooks
const { data: users = [], isLoading: isLoadingUsers } = useUsers(0, 1000);

// Mutation Hooks
const { mutateAsync: createTeamMember } = useCreateTeamMember();
// Automatically invalidates:
// - queryKeys.teamMembers.all
// - queryKeys.teamMembers.byTeam(teamId)
// - queryKeys.teamMembers.byUser(userId)
// - queryKeys.teams.detail(teamId)
```

---

## Query Key Patterns

### New Users Query Keys

```typescript
queryKeys.users = {
  all: ["users"],
  lists: () => ["users", "list"],
  list: (filters) => ["users", "list", { skip, limit }],
  details: () => ["users", "detail"],
  detail: (id) => ["users", "detail", id],
  search: (filters) => ["users", "search", { query, skip, limit }],
};
```

### Existing Team Member Keys (Invalidated)

```typescript
queryKeys.teamMembers.all;
queryKeys.teamMembers.byTeam(teamId);
queryKeys.teamMembers.byUser(userId);
queryKeys.teams.detail(teamId);
```

---

## API Contract

### GET /api/users

```
Query Params:
  - skip?: number = 0
  - limit?: number = 10

Response: User[]
  [
    {
      id: number,
      username: string,
      email: string,
      roles: number[],
      isEmailVerified: boolean,
      createdAt?: string,
      updatedAt?: string
    },
    ...
  ]
```

### POST /api/teams

```
Body: {
  tournamentId: number,
  name: string,
  description?: string
}

Response: Team
  {
    id: number,
    tournamentId: number,
    name: string,
    description?: string,
    createdAt: string,
    updatedAt: string
  }
```

### POST /api/team-members (Called Multiple Times)

```
Body: {
  teamId: number,
  userId: number,
  role: "team_manager" | "coach" | "athlete"
}

Response: TeamMember
  {
    id: number,
    teamId: number,
    userId: number,
    role: string,
    createdAt: string,
    updatedAt: string
  }
```

---

## Validation Rules

### Team Creation

```
✓ Name is required and non-empty
✓ Description is optional
✓ At least 1 team_manager required
✓ Cannot create team without manager role
```

### Member Addition

```
✓ User must be selected
✓ User must exist in system
✓ User cannot be added twice
✓ At least 1 member required to save
✓ At least 1 team_manager required to save
```

### Form State

```
✓ Delete button always enabled
✓ Add member button disabled if no user selected
✓ Save button disabled if:
  - No members added
  - No team_manager in members
  - Currently saving (loading)
```

---

## Error Handling

### Service Layer (user.service.ts)

```
No custom error handling
→ Errors bubble up to component
```

### Component Layer

```
Try-catch blocks around:
  - createTeam() → teamService.createTeam()
  - saveMembers() → createTeamMember() mutation

On Error:
  - Log to console
  - Show error toast
  - Keep loading state false
  - Allow user to retry
```

### Toast Messages

```
Success:
  - "Tạo đoàn thành công"
  - "Đã thêm {username}"
  - "Đã xác nhận và lưu"

Error:
  - "Vui lòng nhập tên đoàn"
  - "Đoàn phải có ít nhất một trưởng đoàn"
  - "Vui lòng chọn thành viên"
  - "Thành viên này đã được thêm"
  - "Không thể tạo đoàn. Vui lòng thử lại."
  - "Không thể thêm thành viên. Vui lòng thử lại."
```

---

## Performance Considerations

### Query Optimization

```
✓ Users fetched once with limit=1000
  - Cached by React Query
  - No refetch on mount (stale time)

✓ Manual search filtering (client-side)
  - Excludes already added members
  - Fast: Set lookup O(1) vs O(n)

✓ Batch member creation
  - Promise.all() for parallel requests
  - All or nothing transaction pattern
```

### Memory

```
✓ memberDetails Map removed (simpler implementation)
✓ loadingMembers Set removed (simplified state)
✓ members array: max ~50-100 typical
✓ users array: cached by React Query
```

---

## Browser Compatibility

All modern browsers supported:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Uses:

- ES2020 async/await
- Template literals
- Destructuring assignment
- Optional chaining (?.)
- TypeScript strict mode
