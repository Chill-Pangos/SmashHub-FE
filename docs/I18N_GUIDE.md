# Hệ Thống I18n - SmashHub

## Cấu Trúc

```
src/
├── locales/
│   ├── i18n.ts          # Cấu hình i18n
│   ├── vi.ts            # Tiếng Việt (mặc định)
│   └── en.ts            # Tiếng Anh
├── hooks/
│   └── useTranslation.ts # Hook custom
└── components/
    └── custom/
        └── LanguageSwitcher.tsx # Component chuyển ngôn ngữ
```

## Cách Sử Dụng

### 1. Import hook

```tsx
import { useTranslation } from "@/hooks/useTranslation";
```

### 2. Sử dụng trong component

```tsx
function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("tournament.tournamentName")}</h1>
      <button>{t("common.save")}</button>
      <p>{t("message.saveSuccess")}</p>
    </div>
  );
}
```

### 3. Sử dụng với biến

```tsx
// Trong file ngôn ngữ
validation: {
  minLength: "Độ dài tối thiểu là {{min}} ký tự";
}

// Trong component
t("validation.minLength", { min: 8 });
// Output: "Độ dài tối thiểu là 8 ký tự"
```

### 4. Component chuyển ngôn ngữ

```tsx
import LanguageSwitcher from "@/components/custom/LanguageSwitcher";

// Thêm vào Header hoặc Navbar
<LanguageSwitcher />;
```

## Cấu Trúc Keys

### Common (Chung)

- `common.save` - Lưu
- `common.cancel` - Hủy
- `common.delete` - Xóa
- `common.edit` - Chỉnh sửa
- ...

### Auth (Xác thực)

- `auth.signIn` - Đăng nhập
- `auth.signUp` - Đăng ký
- `auth.email` - Email
- `auth.password` - Mật khẩu
- ...

### Tournament (Giải đấu)

- `tournament.tournament` - Giải đấu
- `tournament.createTournament` - Tạo giải đấu
- `tournament.tournamentList` - Danh sách giải đấu
- ...

### Match (Trận đấu)

- `match.match` - Trận đấu
- `match.liveMatches` - Trận đấu trực tiếp
- `match.matchResults` - Kết quả trận đấu
- ...

### Team (Đội)

- `team.team` - Đội
- `team.myTeam` - Đội của tôi
- `team.teamManager` - Trưởng đoàn
- ...

### Athlete (Vận động viên)

- `athlete.athlete` - Vận động viên
- `athlete.athleteProfile` - Hồ sơ vận động viên
- `athlete.eloRating` - Điểm ELO
- ...

### Referee (Trọng tài)

- `referee.referee` - Trọng tài
- `referee.chiefReferee` - Tổng trọng tài
- `referee.matchSupervision` - Giám sát trận đấu
- ...

### Validation (Kiểm tra)

- `validation.required` - Trường này là bắt buộc
- `validation.invalidEmail` - Email không hợp lệ
- `validation.passwordTooShort` - Mật khẩu quá ngắn
- ...

### Messages (Thông báo)

- `message.saveSuccess` - Lưu thành công
- `message.deleteSuccess` - Xóa thành công
- `message.confirmDelete` - Bạn có chắc muốn xóa?
- ...

### Placeholders

- `placeholder.search` - Tìm kiếm...
- `placeholder.selectDate` - Chọn ngày
- `placeholder.enterEmail` - Nhập email
- ...

## Thêm Key Mới

### Trong file vi.ts hoặc en.ts:

```typescript
export default {
  // ... existing keys
  myNewSection: {
    myKey: "Giá trị tiếng Việt",
    anotherKey: "Giá trị khác",
  },
};
```

### Sử dụng:

```tsx
t("myNewSection.myKey");
```

## Ngôn Ngữ Mặc Định

- **Mặc định**: Tiếng Việt (`vi`)
- **Fallback**: Tiếng Việt (nếu key không tìm thấy)
- **Lưu trữ**: LocalStorage (tự động nhớ lựa chọn)

## Best Practices

1. **Luôn sử dụng keys có ý nghĩa**: `tournament.createTournament` thay vì `t1.c1`

2. **Nhóm keys theo chức năng**: `auth.*`, `tournament.*`, `match.*`

3. **Tái sử dụng keys chung**: Dùng `common.*` cho các từ xuất hiện nhiều

4. **Kiểm tra keys**: IDE sẽ gợi ý nếu dùng TypeScript

5. **Thêm context khi cần**:
   ```tsx
   t("validation.minLength", { min: 8 });
   ```

## Migration Plan

Để migrate các màn hình hiện tại:

1. **Tìm tất cả hardcoded text**
2. **Thay thế bằng `t()` function**
3. **Thêm keys mới vào vi.ts và en.ts nếu cần**

Ví dụ:

```tsx
// Before
<button>Lưu</button>

// After
<button>{t("common.save")}</button>
```

## Hỗ Trợ

- File cấu hình: `src/locales/i18n.ts`
- File tiếng Việt: `src/locales/vi.ts`
- File tiếng Anh: `src/locales/en.ts`
- Hook: `src/hooks/useTranslation.ts`
