# 📚 Manual Team Registration - Usage Examples

## Quick Start

### For Users (Team Manager)

#### Scenario: Register team manually for tournament

**Step 1: Navigate to Team Registration**

```
1. Click "Team Manager" sidebar
2. Click "Đăng ký tham gia thi đấu"
3. Select tournament from dropdown
4. Click "Bước 1: Đăng ký danh sách đoàn" tab
```

**Step 2: Choose registration method**

```
Option A: Import Excel
  └── Click "Import Excel" tab
      └── Follow template-based import

Option B: Create Manually (NEW)
  └── Click "Tạo Thủ công" tab
      └── Follow steps below
```

**Step 3: Create Team Form**

```
Input Fields:
  - Tên đoàn*: "Đoàn Hà Nội"
  - Mô tả: "Đoàn thi đấu khu vực Bắc" (optional)

Click Button:
  → "Tạo đoàn" (Create Team)
```

**Step 4: Add Team Members**

```
For each member:
  1. Select from dropdown: "Nguyễn Văn A (nguyena@example.com)"
  2. Choose role: Select "HLV" or "VĐV" or "Trưởng đoàn"
  3. Click "Thêm thành viên"

After adding all members:
  4. Click "Xác nhận và lưu"
```

**Step 5: Continue to Next Step**

```
Auto-redirect to Step 2: Đăng ký nội dung thi đấu
```

---

## Code Examples

### Example 1: Using ManualTeamRegistration Component

```typescript
import ManualTeamRegistration from "@/pages/TeamManager/TeamRegistration/components/ManualTeamRegistration";

export default function MyComponent() {
  const tournamentId = 1;

  const handleSuccess = () => {
    console.log("Team created successfully!");
    // Redirect or refresh data
  };

  return (
    <ManualTeamRegistration
      tournamentId={tournamentId}
      onSuccess={handleSuccess}
    />
  );
}
```

### Example 2: Using useUsers Hook

```typescript
import { useUsers } from "@/hooks/queries";

export default function UserSelector() {
  const { data: users = [], isLoading } = useUsers(0, 1000);

  if (isLoading) return <div>Loading users...</div>;

  return (
    <select>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.username} ({user.email})
        </option>
      ))}
    </select>
  );
}
```

### Example 3: Creating Team Manually

```typescript
import { teamService } from "@/services";
import { useCreateTeamMember } from "@/hooks/queries";

async function createTeamWithMembers() {
  // Step 1: Create team
  const team = await teamService.createTeam({
    tournamentId: 1,
    name: "Đoàn Hà Nội",
    description: "Elite team from Hanoi",
  });

  console.log("Team created:", team);
  // Output: { id: 5, tournamentId: 1, name: "Đoàn Hà Nội", ... }

  // Step 2: Add members
  const memberRoles = [
    { userId: 10, role: "team_manager" },
    { userId: 15, role: "coach" },
    { userId: 20, role: "athlete" },
    { userId: 25, role: "athlete" },
  ];

  for (const memberData of memberRoles) {
    await teamMemberService.createTeamMember({
      teamId: team.id,
      userId: memberData.userId,
      role: memberData.role,
    });
  }

  console.log("All members added successfully!");
}
```

### Example 4: Using useCreateTeamMember Mutation

```typescript
import { useCreateTeamMember } from "@/hooks/queries";

export default function AddMemberButton() {
  const { mutateAsync: createTeamMember, isPending } = useCreateTeamMember();

  const handleAddMember = async () => {
    try {
      const member = await createTeamMember({
        teamId: 5,
        userId: 10,
        role: "team_manager"
      });

      console.log("Member added:", member);
      // Queries automatically invalidated by mutation
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  return (
    <button onClick={handleAddMember} disabled={isPending}>
      {isPending ? "Adding..." : "Add Member"}
    </button>
  );
}
```

### Example 5: Fetching Users for Dropdown

```typescript
import { useUsers } from "@/hooks/queries";

export default function UserDropdown() {
  const { data: allUsers = [], isLoading } = useUsers(
    0,      // skip
    1000,   // limit (get all users)
    { enabled: true }  // query options
  );

  const availableUsers = allUsers.filter(
    (user) => !selectedMemberIds.includes(user.id)
  );

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {availableUsers.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            {user.username} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Example 6: Validation Before Saving

```typescript
interface TeamMemberInput {
  userId: number;
  role: "team_manager" | "coach" | "athlete";
}

function validateMembers(members: TeamMemberInput[]) {
  // Check at least one member
  if (members.length === 0) {
    throw new Error("Vui lòng thêm ít nhất một thành viên");
  }

  // Check at least one team_manager
  const hasManager = members.some((m) => m.role === "team_manager");
  if (!hasManager) {
    throw new Error("Đoàn phải có ít nhất một trưởng đoàn");
  }

  // Check no duplicates
  const userIds = members.map((m) => m.userId);
  const uniqueIds = new Set(userIds);
  if (userIds.length !== uniqueIds.size) {
    throw new Error("Không được thêm cùng một thành viên hai lần");
  }

  return true;
}

// Usage
try {
  validateMembers(members);
  // Save to server
} catch (error) {
  showToast.error("Lỗi", error.message);
}
```

---

## Common Patterns

### Pattern 1: Team Registration Workflow

```typescript
const handleCompleteTeamRegistration = async (
  tournamentId: number,
  teamData: { name: string; description?: string },
  membersData: { userId: number; role: string }[],
) => {
  try {
    // 1. Create team
    const team = await teamService.createTeam({
      tournamentId,
      ...teamData,
    });

    // 2. Add all members in parallel
    await Promise.all(
      membersData.map((member) =>
        teamMemberService.createTeamMember({
          teamId: team.id,
          ...member,
        }),
      ),
    );

    // 3. Success
    showToast.success("Thành công", "Đã tạo đoàn");
    onSuccess?.();
  } catch (error) {
    showToast.error("Lỗi", "Không thể tạo đoàn");
  }
};
```

### Pattern 2: Filtering Available Users

```typescript
// Keep track of already added members
const addedUserIds = new Set(members.map((m) => m.userId));

// Filter dropdown options
const availableUsers = allUsers.filter(
  (user) => !addedUserIds.has(user.id)
);

// Usage
<SelectContent>
  {availableUsers.map((user) => (
    <SelectItem key={user.id} value={user.id.toString()}>
      {user.username}
    </SelectItem>
  ))}
</SelectContent>
```

### Pattern 3: Two-Step Form Navigation

```typescript
type FormStep = "form" | "members";

const [step, setStep] = useState<FormStep>("form");

// Navigate forward
if (teamId) {
  setStep("members");
}

// Navigate backward
const goBack = () => setStep("form");

// Render based on step
{step === "form" && <TeamForm />}
{step === "members" && <MembersForm teamId={teamId} />}
```

---

## Testing Examples

### Test 1: Create Team Successfully

```typescript
test("should create team successfully", async () => {
  const { getByText, getByPlaceholderText } = render(
    <ManualTeamRegistration tournamentId={1} onSuccess={mockOnSuccess} />
  );

  // Fill form
  const teamNameInput = getByPlaceholderText("Nhập tên đoàn");
  fireEvent.change(teamNameInput, { target: { value: "Test Team" } });

  // Submit
  const createButton = getByText("Tạo đoàn");
  fireEvent.click(createButton);

  // Wait for submission
  await waitFor(() => {
    expect(teamService.createTeam).toHaveBeenCalledWith({
      tournamentId: 1,
      name: "Test Team",
      description: undefined
    });
  });
});
```

### Test 2: Validate Team Manager Required

```typescript
test("should show error if no team_manager", async () => {
  // Add only coach and athlete members
  addMember(15, "coach");
  addMember(20, "athlete");

  // Try to save
  const saveButton = getByText("Xác nhận và lưu");
  fireEvent.click(saveButton);

  // Should show error
  expect(getByText("Đoàn phải có ít nhất một trưởng đoàn")).toBeInTheDocument();
});
```

### Test 3: Prevent Duplicate Members

```typescript
test("should prevent adding same user twice", async () => {
  // Add user 15
  selectUser(15);
  fireEvent.click(getByText("Thêm thành viên"));

  // Try to add same user again
  selectUser(15);
  fireEvent.click(getByText("Thêm thành viên"));

  // Should show error
  expect(getByText("Thành viên này đã được thêm")).toBeInTheDocument();
});
```

---

## API Integration Checklist

- [ ] Backend implements `GET /api/users` endpoint
- [ ] Backend implements `POST /api/teams` endpoint
- [ ] Backend implements `POST /api/team-members` endpoint
- [ ] All endpoints require proper authorization
- [ ] Response payloads match User/Team/TeamMember types
- [ ] Error responses include proper HTTP status codes
- [ ] Pagination works correctly for users endpoint
- [ ] Team creation is transactional
- [ ] Duplicate member detection works
- [ ] Team manager role validation works

---

## Troubleshooting

### Issue: Users dropdown is empty

```
Solution:
  1. Check users endpoint returns data
  2. Verify limit=1000 is sufficient
  3. Check user records exist in database
  4. Check filter logic (addedUserIds)
```

### Issue: Team creation fails

```
Solution:
  1. Check tournament ID is valid
  2. Check team name is not empty
  3. Check authorization token is valid
  4. Check backend logs for error details
```

### Issue: Members not added after save

```
Solution:
  1. Check Promise.all() completes without error
  2. Check team ID is returned from team creation
  3. Check user IDs are valid
  4. Check roles are valid ("team_manager", "coach", "athlete")
```

### Issue: No loading state visible

```
Solution:
  1. Check isCreatingTeam state updates
  2. Check isSavingMembers state updates
  3. Check buttons have disabled={isLoading} attribute
  4. Check spinners are conditionally rendered
```

---

## Performance Tips

1. **Limit users fetch**: Only fetch users when needed
2. **Use Set for lookups**: O(1) vs O(n) for duplicate checks
3. **Parallel member creation**: Use Promise.all()
4. **Query caching**: React Query handles stale data
5. **Debounce search**: If adding search feature

---

## Migration from Excel Import

**If users are switching from Excel to manual registration:**

```
Old Flow:
  1. Download template Excel
  2. Edit in spreadsheet app
  3. Upload file
  4. Wait for validation
  5. Confirm import

New Flow:
  1. Fill form directly
  2. Select users from dropdown
  3. Assign roles immediately
  4. Instant feedback
  5. No file validation needed
```

**Benefits:**

- ✅ Faster for small teams (1-10 members)
- ✅ Real-time validation
- ✅ No file handling needed
- ✅ Better UX for complex setups
