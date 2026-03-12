# 📘 Manual Entry Registration - Feature Guide

## Overview

Trưởng đoàn (Team Manager) có thể đăng ký thành viên tham gia nội dung thi đấu (entries) **thủ công** mà không cần phải import file Excel.

## Feature Location

**Component**: [ManualEntryRegistration.tsx](./src/pages/TeamManager/TeamRegistration/components/ManualEntryRegistration.tsx)

**Page**: [TeamRegistration.tsx](./src/pages/TeamManager/TeamRegistration/TeamRegistration.tsx) - Step 2: Đăng ký nội dung thi đấu

## How to Use

### Step 1: Go to Team Registration Page

- Navigate to "Đăng ký tham gia giải đấu" in Team Manager menu
- Select a tournament
- Go to Step 2: "Đăng ký nội dung thi đấu"

### Step 2: Select Team

- Choose your team from the dropdown
- Two registration methods will appear as tabs:
  - **Import Excel** - Import danh sách từ file
  - **Chọn thủ công** - Select members manually

### Step 3: Choose Manual Registration Tab

- Click on "Chọn thủ công" tab
- Tournament contents will appear as clickable cards

### Step 4: Select Tournament Content

- Click on any content card (Đơn/Đôi/Đoàn)
- The card will be highlighted with a checkmark
- Content details displayed:
  - Loại (Type)
  - Giới tính (Gender) if applicable
  - ELO requirements if applicable

### Step 5: Select Team Members

- A table with team's athletes will appear
- Use checkboxes to select members
  - For Singles (Đơn): Select 1 athlete
  - For Doubles (Đôi): Select 2 athletes
  - For Team (Đoàn): Select 3-5 athletes
- Real-time validation shows:
  - ✅ Đã chọn đủ thành viên (if selection is valid)
  - ⚠️ Need X more athletes (if selection is incomplete)

### Step 6: Confirm Registration

- Review selected members in confirmation dialog
- Click "Xác nhận đăng ký" to register
- Success message will appear

## Key Features

### 1. **Content Type Validation**

Automatically validates the number of selected members based on content type:

- **Single** (Đơn): Requires exactly 1 athlete
- **Double** (Đôi): Requires exactly 2 athletes
- **Team** (Đoàn): Requires 3-5 athletes

### 2. **Member Selection**

- Only displays **athletes** from the team (role = 'athlete')
- Shows member information:
  - Username
  - Full name (if available)
  - Email
  - ELO rating

### 3. **Real-time Validation**

- Visual feedback as you select members
- Can't submit if selection doesn't match content requirement
- Confirmation dialog shows selected members for review

### 4. **Error Handling**

- Comprehensive error messages for:
  - No team selected
  - No content selected
  - Wrong number of members
  - API registration failures

## API Integration

### Endpoint Used

```
POST /api/entries/register
```

### Request Body

```typescript
{
  contentId: number;      // Tournament content ID
  teamId: number;         // Team ID
  memberIds: number[];    // Array of selected athlete user IDs
}
```

### Response

```typescript
{
  id: number;
  contentId: number;
  teamId: number;
  members: EntryMember[];
  createdAt: string;
  updatedAt: string;
}
```

## Component Props

```typescript
interface ManualEntryRegistrationProps {
  selectedTeamId: number | null; // Selected team ID
  selectedTournament: Tournament | undefined; // Tournament data with contents
  onSuccess: () => void; // Callback when registration succeeds
}
```

## State Management

**Local State:**

- `selectedContent`: Current selected tournament content
- `selectedMembers`: Array of selected athlete user IDs
- `isRegistering`: Loading state during API call
- `confirmDialogOpen`: Confirmation dialog visibility

**External State (React Query):**

- `useMembersByTeam()`: Fetch team members
- `useRegisterEntry()`: Mutation to register entry

## UI Components Used

- **Card**: Display content options and member selection
- **Button**: Select content, confirm registration
- **Badge**: Show ELO rating, content type
- **Checkbox**: Member selection
- **Table**: Display athlete list
- **AlertDialog**: Confirmation before submission
- **Icons**: Trophy, Users, Loader2, Check, AlertCircle

## Validation Rules

### Member Requirements

1. At least one athlete must be in the team
2. Selected members must match content type requirement
3. Members must be of role 'athlete' (not team_manager or coach)

### Content Requirements

- Content must have valid ID and type
- Tournament must have at least one content available

## Error Messages

| Error                             | Trigger                 | Solution                          |
| --------------------------------- | ----------------------- | --------------------------------- |
| "Không có vận động viên"          | Team has no athletes    | Add athletes to team first        |
| "Vui lòng chọn đoàn"              | No team selected        | Select team from dropdown         |
| "Vui lòng chọn nội dung"          | No content selected     | Click on a content card           |
| "Nội dung X yêu cầu Y thành viên" | Wrong number of members | Select correct number of athletes |
| "Không thể đăng ký"               | API error               | Check network and try again       |

## Related Features

- **Import Excel Entries**: [EntryImportDialog](./src/components/custom/EntryImportDialog.tsx)
- **Manual Team Registration**: [ManualTeamRegistration](./src/pages/TeamManager/TeamRegistration/components/ManualTeamRegistration.tsx)
- **Entry Service**: [entry.service.ts](./src/services/entry.service.ts)
- **Entry Queries**: [useEntryQueries.ts](./src/hooks/queries/useEntryQueries.ts)

## API Documentation

For detailed API information, see:

- [API_ENTRY_OPERATIONS.md](../../docs/API_ENTRY_OPERATIONS.md) - Entry registration endpoints
- [API_TEAM_OPERATIONS.md](../../docs/API_TEAM_OPERATIONS.md) - Team management
- [API_TEAMMEMBER_OPERATIONS.md](../../docs/API_TEAMMEMBER_OPERATIONS.md) - Team member management

## Testing Checklist

- [ ] Create a team with athletes (via manual or import)
- [ ] Go to team registration -> Step 2
- [ ] Test single registration (select 1 athlete)
- [ ] Test double registration (select 2 athletes)
- [ ] Test team registration (select 3-5 athletes)
- [ ] Verify error messages appear correctly
- [ ] Confirm registration updates team entry data
- [ ] Check success toast notification appears
- [ ] Verify page refreshes after successful registration

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Future Enhancements

1. **Multi-Entry Support**: Register same team for multiple contents at once
2. **Edit Registration**: Allow changing members after registration
3. **Bulk Import**: Register multiple teams at once
4. **Schedule Registration**: Auto-register members based on team composition
5. **Member ELO Filter**: Auto-filter members by ELO requirements
