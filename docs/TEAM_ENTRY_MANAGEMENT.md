# 📚 Team, TeamMember & Entry Management Documentation

Tài liệu hướng dẫn sử dụng các API và components để quản lý Teams, Team Members và Entries trong hệ thống SmashHub.

---

## 📁 Cấu trúc Files

### Types
```
src/types/
├── team.types.ts       # Types cho Team và TeamMember
├── entry.types.ts      # Types cho Entry
└── index.ts            # Export tất cả types
```

### Services
```
src/services/
├── team.service.ts         # Service cho Team API
├── teamMember.service.ts   # Service cho TeamMember API
├── entry.service.ts        # Service cho Entry API
└── index.ts                # Export tất cả services
```

### Components
```
src/components/custom/
├── ExcelFileUpload.tsx     # Component upload file Excel
├── ImportPreview.tsx       # Component xem trước dữ liệu import
├── TeamImportDialog.tsx    # Dialog import teams
└── EntryImportDialog.tsx   # Dialog import entries
```

### Utilities
```
src/utils/
└── file.utils.ts           # Utilities xử lý file Excel
```

### Hooks
```
src/hooks/
└── useExcelFileUpload.ts   # Hook quản lý state upload file
```

### Excel Templates
```
src/assets/
├── DangKyDanhSach.xlsx                    # Mẫu đăng ký teams
├── DangKyNoiDungThiDau_Single.xlsx       # Mẫu đăng ký nội dung đơn
├── DangKyNoiDungThiDau_Double.xlsx       # Mẫu đăng ký nội dung đôi
└── DangKyNoiDungThiDau_Team.xlsx         # Mẫu đăng ký nội dung đội
```

---

## 🚀 Sử dụng Services

### Team Service

#### 1. Tạo Team mới
```typescript
import { teamService } from "@/services";

const newTeam = await teamService.createTeam({
  tournamentId: 1,
  name: "Team Alpha",
  description: "Elite championship team"
});
```

#### 2. Lấy danh sách Teams
```typescript
// Lấy tất cả teams
const teams = await teamService.getAllTeams(0, 20);

// Lấy teams theo tournament
const tournamentTeams = await teamService.getTeamsByTournamentId(1, 0, 50);

// Lấy team theo ID
const team = await teamService.getTeamById(1);
```

#### 3. Cập nhật Team
```typescript
const result = await teamService.updateTeam(1, {
  name: "Team Alpha Elite",
  description: "Championship winning team 2026"
});
```

#### 4. Xóa Team
```typescript
await teamService.deleteTeam(5);
```

#### 5. Import Teams từ Excel
```typescript
// Preview
const preview = await teamService.previewImportTeams(file);

if (preview.data.errors.length === 0) {
  // Confirm import
  const result = await teamService.confirmImportTeams({
    tournamentId: 1,
    teams: preview.data.teams
  });
  
  console.log(`Created ${result.data.created} teams`);
}
```

---

### TeamMember Service

#### 1. Thêm Member vào Team
```typescript
import { teamMemberService } from "@/services";

const member = await teamMemberService.createTeamMember({
  teamId: 1,
  userId: 5,
  role: "team_manager" // hoặc "coach", "athlete"
});
```

#### 2. Lấy danh sách Members
```typescript
// Lấy members của một team
const members = await teamMemberService.getMembersByTeamId(1, 0, 50);

// Lấy teams của một user
const userTeams = await teamMemberService.getTeamsByUserId(5, 0, 50);
```

#### 3. Cập nhật Role
```typescript
const result = await teamMemberService.updateTeamMember(1, {
  role: "team_manager"
});
```

#### 4. Xóa Member
```typescript
await teamMemberService.deleteTeamMember(5);
```

---

### Entry Service

#### 1. Đăng ký Entry (Team Manager)
```typescript
import { entryService } from "@/services";

// Đăng ký nội dung đơn (1 member)
const singleEntry = await entryService.registerEntry({
  contentId: 1,
  teamId: 5,
  memberIds: [10]
});

// Đăng ký nội dung đôi (2 members)
const doubleEntry = await entryService.registerEntry({
  contentId: 2,
  teamId: 5,
  memberIds: [10, 15]
});

// Đăng ký nội dung đội (3-5 members)
const teamEntry = await entryService.registerEntry({
  contentId: 3,
  teamId: 5,
  memberIds: [10, 15, 20, 25]
});
```

#### 2. Lấy danh sách Entries
```typescript
// Lấy entries của một content
const entries = await entryService.getEntriesByContentId(1, 0, 50);

// Lấy entry theo ID
const entry = await entryService.getEntryById(1);
```

#### 3. Cập nhật Entry
```typescript
const result = await entryService.updateEntry(1, {
  memberIds: [10, 15, 20]
});
```

#### 4. Xóa Entry
```typescript
await entryService.deleteEntry(1);
```

#### 5. Import Entries từ Excel
```typescript
// Preview Single Entries
const preview = await entryService.previewImportSingleEntries(file, contentId);

if (preview.data.errors.length === 0) {
  // Confirm import
  const result = await entryService.confirmImportSingleEntries({
    contentId,
    entries: preview.data.entries
  });
}

// Tương tự cho Double và Team Entries
```

---

## 🎨 Sử dụng Components

### 1. ExcelFileUpload Component

Component để upload file Excel với validation và drag-and-drop.

```typescript
import ExcelFileUpload from "@/components/custom/ExcelFileUpload";

function MyComponent() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ExcelFileUpload
      templateType="registration" // hoặc "single", "double", "team"
      showTemplateDownload={true}
      onFileSelected={(file) => setFile(file)}
      onFileRemoved={() => setFile(null)}
    />
  );
}
```

**Props:**
- `templateType`: Loại template ("registration", "single", "double", "team")
- `showTemplateDownload`: Hiển thị nút tải file mẫu (default: true)
- `onFileSelected`: Callback khi file được chọn
- `onFileRemoved`: Callback khi file bị xóa
- `disabled`: Disable upload (default: false)

---

### 2. ImportPreview Component

Component hiển thị preview dữ liệu import với validation errors.

```typescript
import ImportPreview from "@/components/custom/ImportPreview";

function MyComponent() {
  return (
    <ImportPreview
      entries={previewData.entries}
      errors={previewData.errors}
      columns={[
        { key: "name", label: "Tên" },
        { key: "email", label: "Email" },
        {
          key: "role",
          label: "Vai trò",
          render: (value) => roleLabels[value]
        }
      ]}
      showRowNumbers={true}
    />
  );
}
```

**Props:**
- `entries`: Danh sách dữ liệu preview
- `errors`: Danh sách lỗi validation
- `columns`: Định nghĩa các cột hiển thị
- `showRowNumbers`: Hiển thị số thứ tự (default: true)

---

### 3. TeamImportDialog Component

Dialog đầy đủ để import teams với preview và validation.

```typescript
import TeamImportDialog from "@/components/custom/TeamImportDialog";

function MyComponent() {
  return (
    <TeamImportDialog
      tournamentId={1}
      onImportSuccess={() => {
        // Refresh data
        console.log("Import success!");
      }}
      trigger={
        <Button>Import Teams</Button>
      }
    />
  );
}
```

**Props:**
- `tournamentId`: ID của tournament
- `onImportSuccess`: Callback sau khi import thành công
- `trigger`: Custom trigger button (optional)

---

### 4. EntryImportDialog Component

Dialog đầy đủ để import entries với preview và validation.

```typescript
import EntryImportDialog from "@/components/custom/EntryImportDialog";

function MyComponent() {
  return (
    <EntryImportDialog
      contentId={1}
      contentType="single" // hoặc "double", "team"
      onImportSuccess={() => {
        // Refresh data
        console.log("Import success!");
      }}
      trigger={
        <Button>Import Entries</Button>
      }
    />
  );
}
```

**Props:**
- `contentId`: ID của tournament content
- `contentType`: Loại content ("single", "double", "team")
- `onImportSuccess`: Callback sau khi import thành công
- `trigger`: Custom trigger button (optional)

---

## 🛠️ Sử dụng Utilities

### File Utilities

```typescript
import {
  validateExcelFile,
  formatFileSize,
  downloadTemplateByType,
  getExcelTemplatePath,
  EXCEL_TEMPLATES
} from "@/utils/file.utils";

// Validate Excel file
const validation = validateExcelFile(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Format file size
const size = formatFileSize(file.size); // "2.5 MB"

// Download template
downloadTemplateByType("registration"); // Tải file mẫu đăng ký teams
downloadTemplateByType("single");       // Tải file mẫu đăng ký đơn
downloadTemplateByType("double");       // Tải file mẫu đăng ký đôi
downloadTemplateByType("team");         // Tải file mẫu đăng ký đội

// Get template path
const path = getExcelTemplatePath("registration");
```

---

### useExcelFileUpload Hook

```typescript
import { useExcelFileUpload } from "@/hooks/useExcelFileUpload";

function MyComponent() {
  const {
    uploadState,
    handleFileSelect,
    handleFileDrop,
    resetUpload,
    isFileReady
  } = useExcelFileUpload();

  return (
    <div>
      <input
        type="file"
        onChange={handleFileSelect}
        accept=".xlsx,.xls"
      />
      
      {uploadState.file && (
        <div>
          <p>File: {uploadState.fileName}</p>
          <p>Size: {uploadState.fileSize}</p>
          <button onClick={resetUpload}>Remove</button>
        </div>
      )}
      
      {uploadState.error && (
        <p className="error">{uploadState.error}</p>
      )}
    </div>
  );
}
```

---

## 📊 Excel File Format

### 1. Team Registration (DangKyDanhSach.xlsx)

| Team Name | Description | Member Name | Email | Role |
|-----------|-------------|-------------|-------|------|
| Team Alpha | Best team | John Doe | john@example.com | team_manager |
| Team Alpha | Best team | Jane Smith | jane@example.com | athlete |

**Quy tắc:**
- Team Name bắt buộc
- Mỗi team phải có ít nhất 1 team_manager
- Email phải hợp lệ và user phải tồn tại trong hệ thống
- Role: team_manager, coach, hoặc athlete

---

### 2. Single Entry (DangKyNoiDungThiDau_Single.xlsx)

| STT | Name | Email |
|-----|------|-------|
| 1 | John Doe | john@example.com |
| 2 | Jane Smith | jane@example.com |

**Quy tắc:**
- Name và Email bắt buộc
- Email phải hợp lệ và user phải tồn tại
- User phải đáp ứng yêu cầu về giới tính, tuổi, ELO của content

---

### 3. Double Entry (DangKyNoiDungThiDau_Double.xlsx)

| STT | Player 1 Name | Player 1 Email | Player 2 Name | Player 2 Email |
|-----|---------------|----------------|---------------|----------------|
| 1 | John Doe | john@example.com | Jane Smith | jane@example.com |

**Quy tắc:**
- Thông tin cả 2 players bắt buộc
- Email phải hợp lệ và users phải tồn tại
- Cả 2 users phải đáp ứng yêu cầu của content

---

### 4. Team Entry (DangKyNoiDungThiDau_Team.xlsx)

| Team Name | Member 1 Name | Member 1 Email | Member 2 Name | Member 2 Email | ... |
|-----------|---------------|----------------|---------------|----------------|-----|
| Team A | John | john@example.com | Jane | jane@example.com | ... |

**Quy tắc:**
- Team Name và ít nhất 3 members bắt buộc
- Tối đa 5 members
- Email phải hợp lệ và users phải tồn tại
- Tất cả members phải đáp ứng yêu cầu của content

---

## 🔐 Authentication

Các API sau yêu cầu authentication (Bearer token):

- `POST /api/entries/register` - Đăng ký entry (team manager only)
- `POST /api/teams/import/preview` - Preview import teams
- `POST /api/teams/import/confirm` - Confirm import teams
- `POST /api/entries/import/preview` - Preview import entries
- `POST /api/entries/import/confirm` - Confirm import entries

Token được tự động thêm vào headers bởi `axiosInstance`.

---

## ⚠️ Error Handling

Tất cả services đều throw errors khi có lỗi xảy ra. Sử dụng try-catch để xử lý:

```typescript
try {
  const teams = await teamService.getAllTeams();
  // Success
} catch (error: any) {
  console.error(error);
  showErrorToast(error.response?.data?.message || "Có lỗi xảy ra");
}
```

---

## 📝 Notes

1. **File Validation**: Tất cả file upload đều được validate về:
   - Loại file (phải là .xlsx hoặc .xls)
   - Kích thước (tối đa 5MB)
   - Định dạng dữ liệu trong file

2. **Preview Before Import**: Luôn preview trước khi import để kiểm tra lỗi

3. **Error Messages**: Lỗi được hiển thị theo từng dòng với thông tin chi tiết

4. **Template Files**: Luôn sử dụng file mẫu để đảm bảo định dạng đúng

5. **Team Manager Role**: Chỉ team manager mới có thể đăng ký entries cho team

---

## 🎯 Best Practices

1. Validate file trước khi upload
2. Hiển thị loading state khi đang xử lý
3. Hiển thị toast messages cho user feedback
4. Handle errors gracefully
5. Refresh data sau khi import thành công
6. Sử dụng TypeScript types để type-safe

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team development.
