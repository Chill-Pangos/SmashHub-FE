# Tài Liệu Hệ Thống API SmashHub-BE

**Cập nhật lần cuối**: 31/03/2026
**Phiên bản**: 1.0
**URL cơ sở**: `/api`

---

## Mục Lục

1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Xác Thực & Phân Quyền](#xác-thực--phân-quyền)
3. [Tính Năng & Tài Nguyên API](#tính-năng--tài-nguyên-api)
4. [Quy Trình Kinh Doanh Chính](#quy-trình-kinh-doanh-chính)
5. [Máy Trạng Thái & Luồng Trạng Thái](#máy-trạng-thái--luồng-trạng-thái)
6. [Mô Hình & Liên Kết Dữ Liệu](#mô-hình--liên-kết-dữ-liệu)
7. [Tính Năng Thời Gian Thực](#tính-năng-thời-gian-thực)
8. [Xử Lý Lỗi & Mã Trạng Thái](#xử-lý-lỗi--mã-trạng-thái)

---

## Tổng Quan Hệ Thống

SmashHub-BE là **hệ thống quản lý giải đấu toàn diện** được thiết kế cho các giải đấu bóng bàn cạnh tranh. Hệ thống xử lý:

- **Quản Lý Giải Đấu**: Tạo, lên lịch, quản lý hạng mục
- **Đăng Ký & Quản Lý Dự Vào**: Tăng lực lượng, quản lý thành viên
- **Xử Lý Thanh Toán**: Nhiều phương thức thanh toán với xác minh
- **Quản Lý Trọng Tài & Trận Đấu**: Hệ thống lời mời trọng tài với quy trình trận đấu
- **Lên Lịch**: Tự động tạo bảng tổ hợp và giải đấu loại trực tiếp
- **Hệ Thống ELO**: Xếp hạng người chơi động với tích hợp kết quả trận đấu
- **Thông Báo Thời Gian Thực**: Cập nhật trực tiếp qua Socket.IO

### Kiến Trúc Hệ Thống

```
Người Dùng (Tổ Chức, Vận Động Viên, Trọng Tài)
    ↓
Xác Thực (JWT)
    ↓
Giải Đấu → Hạng Mục → Dự Vào → Trận Đấu → Kết Quả
                                    ↓
                          Xếp Hạng Nhóm / Ngoặc KO
                                    ↓
                          Điểm ELO & Bảng Xếp Hạng
                                    ↓
                          Thông Báo (Thời Gian Thực)
```

---

## Xác Thực & Phân Quyền

### Quy Trình Xác Thực

```
1. Đăng Ký Người Dùng
   POST /auth/register
   → Tạo tài khoản với email/mật khẩu

2. Đăng Nhập Người Dùng
   POST /auth/login
   → Trả về Token Truy Cập + Token Làm Mới

3. Làm Mới Token
   POST /auth/refresh
   → Lấy Token Truy Cập mới mà không cần đăng nhập lại

4. Endpoint Được Bảo Vệ
   Tất cả endpoint (ngoại trừ auth) yêu cầu:
   Header: Authorization: Bearer <access_token>

5. Đăng Xuất
   POST /auth/logout
   → Token được thêm vào danh sách đen
```

### Các Endpoint Xác Thực

| Phương Thức | Endpoint                              | Mục Đích                                     |
| ----------- | ------------------------------------- | -------------------------------------------- |
| `POST`      | `/auth/register`                      | Đăng ký tài khoản người dùng mới             |
| `POST`      | `/auth/login`                         | Đăng nhập người dùng (trả về JWT tokens)     |
| `POST`      | `/auth/refresh`                       | Làm mới token truy cập                       |
| `POST`      | `/auth/logout`                        | Đăng xuất (thêm token vào danh sách đen)     |
| `POST`      | `/auth/change-password`               | Thay đổi mật khẩu (người dùng được xác thực) |
| `POST`      | `/auth/forgot-password`               | Yêu cầu OTP đặt lại mật khẩu                 |
| `POST`      | `/auth/verify-otp`                    | Xác minh mã OTP cho việc đặt lại mật khẩu    |
| `POST`      | `/auth/reset-password`                | Đặt lại mật khẩu bằng OTP                    |
| `POST`      | `/auth/send-email-verification-otp`   | Gửi OTP xác minh email                       |
| `POST`      | `/auth/verify-email-otp`              | Xác minh email bằng OTP                      |
| `POST`      | `/auth/resend-email-verification-otp` | Gửi lại OTP xác minh email                   |

### Mô Hình Phân Quyền

- **Kiểm Soát Truy Cập Dựa Trên Vai Trò (RBAC)**
- **Middleware Dựa Trên Quyền Hạn**
- Vai Trò Chính: `admin`, `organizer`, `athlete`, `referee`, `chief_referee`
- Các endpoint kiểm tra quyền hạn người dùng trước khi cho phép truy cập

---

## Tính Năng & Tài Nguyên API

### 1. Quản Lý Người Dùng (`/users`)

**Tổng Quan**: Quản lý tài khoản và thông tin hồ sơ người dùng

```
Vòng Đời Người Dùng:
┌─────────────────────────────────────────┐
│ Tạo/Đăng Ký → Cập Nhật Hồ Sơ → Sử Dụng │
│     (Auth)      (Profile)       (Tham Gia)
└─────────────────────────────────────────┘
```

| Phương Thức | Endpoint             | Mục Đích                                         | Yêu Cầu Xác Thực |
| ----------- | -------------------- | ------------------------------------------------ | ---------------- |
| `POST`      | `/users`             | Tạo người dùng (admin)                           | ✓                |
| `GET`       | `/users`             | Lấy tất cả người dùng                            | ✓                |
| `GET`       | `/users/:id`         | Lấy người dùng theo ID                           | ✓                |
| `PUT`       | `/users/:id`         | Cập nhật người dùng                              | ✓                |
| `DELETE`    | `/users/:id`         | Xóa người dùng                                   | ✓                |
| `PUT`       | `/users/:id/profile` | Cập nhật hồ sơ (ảnh, DOB, điện thoại, giới tính) | ✓                |

---

### 2. Quản Lý Giải Đấu (`/tournaments`, `/tournament-categories`)

**Tổng Quan**: Tạo và quản lý giải đấu với nhiều hạng mục

```
Vòng Đời Giải Đấu:
┌──────────────┬──────────────────┬─────────────┬──────────────────┐
│   Được Tạo   │  Đăng Ký         │  Đăng Ký    │  Ngoặc KO        │
│   (Thiết Lập)│  Mở (Dự Vào)     │  Đã Đóng    │  Được Tạo        │
└──────────────┴──────────────────┴─────────────┴──────────────────┘
     ↓              ↓                   ↓             ↓
Cập Nhật Trạng Thái Giải Đấu (Theo Lịch hoặc Thủ Công)
```

#### Các Endpoint Giải Đấu

| Phương Thức | Endpoint                        | Mục Đích                               |
| ----------- | ------------------------------- | -------------------------------------- |
| `POST`      | `/tournaments`                  | Tạo giải đấu với hạng mục              |
| `GET`       | `/tournaments`                  | Lấy tất cả giải đấu                    |
| `GET`       | `/tournaments/search`           | Tìm kiếm giải đấu với bộ lọc           |
| `GET`       | `/tournaments/:id`              | Lấy giải đấu theo ID với hạng mục      |
| `PUT`       | `/tournaments/:id`              | Cập nhật thông tin giải đấu & hạng mục |
| `DELETE`    | `/tournaments/:id`              | Xóa giải đấu                           |
| `POST`      | `/tournaments/update-statuses`  | Kích hoạt cập nhật trạng thái thủ công |
| `GET`       | `/tournaments/upcoming-changes` | Lấy các thay đổi trạng thái sắp tới    |

#### Hạng Mục Giải Đấu

| Phương Thức | Endpoint                     | Mục Đích             |
| ----------- | ---------------------------- | -------------------- |
| `POST`      | `/tournament-categories`     | Tạo hạng mục         |
| `GET`       | `/tournament-categories`     | Lấy tất cả hạng mục  |
| `GET`       | `/tournament-categories/:id` | Lấy hạng mục theo ID |
| `PUT`       | `/tournament-categories/:id` | Cập nhật hạng mục    |
| `DELETE`    | `/tournament-categories/:id` | Xóa hạng mục         |

---

### 3. Quản Lý Dự Vào & Đăng Ký (`/entries`)

**Tổng Quan**: Xử lý đăng ký giải đấu, tăng lực lượng, và quản lý thành viên

```
Quy Trình Đăng Ký Dự Vào:
┌──────────────────────────────────────────────┐
│ 1. Tạo Dự Vào (đăng ký cho hạng mục)         │
│    - Tạo Đội HOẶC Tham Gia Đội Hiện Có      │
├──────────────────────────────────────────────┤
│ 2. Quản Lý Đội                               │
│    - Đội trưởng thêm/loại bỏ thành viên     │
│    - Thành viên yêu cầu tham gia / rời đội  │
├──────────────────────────────────────────────┤
│ 3. Xác Nhận Đội Hình                         │
│    - Đội trưởng xác nhận thành viên cuối     │
├──────────────────────────────────────────────┤
│ 4. Xử Lý Thanh Toán                          │
│    - Ghi lại thanh toán dự vào              │
├──────────────────────────────────────────────┤
│ 5. Kiểm Tra Đủ Điều Kiện                    │
│    - Xác minh đủ điều kiện dự vào           │
│    - Loại bỏ nếu cần                        │
└──────────────────────────────────────────────┘
```

#### Các Endpoint Dự Vào

| Phương Thức | Endpoint                        | Mục Đích                                       |
| ----------- | ------------------------------- | ---------------------------------------------- |
| `POST`      | `/entries/register`             | Đăng ký giải đấu (tạo đội hoặc tham gia)       |
| `GET`       | `/entries/category/:categoryId` | Lấy dự vào theo hạng mục với bộ lọc            |
| `GET`       | `/entries/:entryId`             | Lấy dự vào theo ID                             |
| `PUT`       | `/entries/:entryId`             | Cập nhật dự vào (chỉ đội trưởng)               |
| `DELETE`    | `/entries/:entryId`             | Xóa dự vào (chỉ đội trưởng)                    |
| `GET`       | `/entries/me`                   | Lấy dự vào của người dùng hiện tại với vai trò |
| `GET`       | `/entries/:entryId/my-role`     | Lấy vai trò của người dùng trong dự vào cụ thể |

#### Quản Lý Thành Viên Đội

| Phương Thức | Endpoint                                 | Mục Đích                                 |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| `GET`       | `/entries/:entryId/members`              | Lấy tất cả thành viên của dự vào         |
| `POST`      | `/entries/:entryId/add-member`           | Thêm thành viên (đội trưởng)             |
| `POST`      | `/entries/:entryId/remove-member`        | Loại bỏ thành viên (đội trưởng)          |
| `POST`      | `/entries/:entryId/leave`                | Rời khỏi dự vào (thành viên)             |
| `POST`      | `/entries/:entryId/transfer-captaincy`   | Chuyển quyền đội trưởng                  |
| `POST`      | `/entries/:entryId/set-required-members` | Đặt số thành viên bắt buộc (dự vào đội)  |
| `POST`      | `/entries/:entryId/confirm-lineup`       | Xác nhận đội hình cuối cùng (đội trưởng) |

#### Yêu Cầu Tham Gia (cho dự vào đội)

| Phương Thức | Endpoint                                        | Mục Đích                          |
| ----------- | ----------------------------------------------- | --------------------------------- |
| `GET`       | `/entries/:entryId/join-requests`               | Lấy yêu cầu tham gia (đội trưởng) |
| `POST`      | `/entries/join-requests/:joinRequestId/respond` | Phản hồi yêu cầu tham gia         |

#### Quản Lý Đủ Điều Kiện

| Phương Thức | Endpoint                                   | Mục Đích                          |
| ----------- | ------------------------------------------ | --------------------------------- |
| `GET`       | `/entries/category/:categoryId/eligible`   | Lấy dự vào đủ điều kiện           |
| `POST`      | `/entries/category/:categoryId/disqualify` | Loại bỏ dự vào không đủ điều kiện |

#### Nhập Dự Vào

| Phương Thức | Endpoint          | Mục Đích              |
| ----------- | ----------------- | --------------------- |
| `POST`      | `/entries/import` | Nhập hàng loạt dự vào |

---

### 4. Hệ Thống Thanh Toán (`/payments`)

**Tổng Quan**: Xử lý thanh toán dự vào giải đấu với nhiều phương thức

```
Quy Trình Thanh Toán:
┌─────────────────────────────────────────────────┐
│ 1. Tạo Bản Ghi Thanh Toán (Dự Vào → Thanh Toán)│
├─────────────────────────────────────────────────┤
│ 2. Chọn Phương Thức Thanh Toán:                 │
│    - Tiền Mặt (Thanh toán trực tiếp)           │
│    - Chuyển Khoản Ngân Hàng (Tải lên bằng chứng)│
│    - Trực Tuyến (Thẻ tín dụng, v.v.)           │
├─────────────────────────────────────────────────┤
│ 3. Xác Minh Thanh Toán (Tổ Chức)               │
│    - Xác Nhận → Thanh toán hoàn tất             │
│    - Từ Chối → Thanh toán không thành công     │
│    - Hoàn Tiền → Trả lại thanh toán            │
├─────────────────────────────────────────────────┤
│ 4. Theo Dõi Thống Kê Thanh Toán                │
└─────────────────────────────────────────────────┘

Luồng Trạng Thái Thanh Toán:
pending → completed/failed/refunded
```

#### Các Endpoint Thanh Toán

| Phương Thức | Endpoint                               | Mục Đích                                     |
| ----------- | -------------------------------------- | -------------------------------------------- |
| `POST`      | `/payments`                            | Tạo thanh toán cho dự vào                    |
| `GET`       | `/payments/entry/:entryId`             | Lấy thanh toán theo dự vào                   |
| `GET`       | `/payments/category/:categoryId`       | Lấy thanh toán theo hạng mục (admin/tổ chức) |
| `GET`       | `/payments/category/:categoryId/stats` | Lấy thống kê thanh toán theo hạng mục        |
| `GET`       | `/payments/pending/:categoryId`        | Lấy thanh toán đang chờ xác nhận             |
| `GET`       | `/payments/:paymentId`                 | Lấy thanh toán theo ID                       |
| `POST`      | `/payments/cash`                       | Ghi lại thanh toán tiền mặt                  |
| `POST`      | `/payments/online`                     | Ghi lại thanh toán trực tuyến                |
| `PUT`       | `/payments/:paymentId/proof`           | Tải lên ảnh bằng chứng thanh toán            |
| `POST`      | `/payments/:paymentId/confirm`         | Xác nhận thanh toán (tổ chức)                |
| `POST`      | `/payments/:paymentId/reject`          | Từ chối thanh toán (tổ chức)                 |
| `POST`      | `/payments/:paymentId/refund`          | Hoàn tiền thanh toán (tổ chức)               |

**Phương Thức Thanh Toán**: `cash`, `bank_transfer`, `online`
**Trạng Thái Thanh Toán**: `pending`, `completed`, `failed`, `refunded`

---

### 5. Quản Lý Trọng Tài (`/tournament-referees`)

**Tổng Quan**: Quản lý trọng tài giải đấu thông qua hệ thống lời mời

```
Quy Trình Quản Lý Trọng Tài:
┌──────────────────────────────────────────────────┐
│ 1. Tổ Chức Gửi Lời Mời                          │
│    - Chọn vai trò: referee HOẶC chief_referee   │
├──────────────────────────────────────────────────┤
│ 2. Phản Hồi Của Trọng Tài:                       │
│    - Chấp Nhận → Trở Thành Trọng Tài Hoạt Động  │
│    - Từ Chối → Lời Mời Bị Từ Chối              │
│    - (Không Phản Hồi) → Hết Hạn Sau N Giờ     │
├──────────────────────────────────────────────────┤
│ 3. Quản Lý Trọng Tài Hoạt Động:                 │
│    - Tổ chức có thể cập nhật vai trò            │
│    - Tổ chức có thể loại bỏ trọng tài          │
│    - Tổ chức có thể hủy lời mời đang chờ       │
├──────────────────────────────────────────────────┤
│ 4. Hạn Chế:                                      │
│    - Chỉ 1 chief_referee mỗi giải đấu          │
│    - Không thể vừa làm trọng tài vừa cạnh tranh │
│    - Lời mời hết hạn (số giờ có thể cấu hình)  │
└──────────────────────────────────────────────────┘

Máy Trạng Thái Lời Mời:
pending → (accept/reject/expire/cancel)
  accept → accepted
  reject → rejected
  cancel → cancelled
  expire → expired
```

#### Các Endpoint Trọng Tài

| Phương Thức | Endpoint                                                    | Mục Đích                                 |
| ----------- | ----------------------------------------------------------- | ---------------------------------------- |
| `POST`      | `/tournament-referees/invite`                               | Gửi lời mời trọng tài                    |
| `POST`      | `/tournament-referees/accept-invitation`                    | Chấp nhận lời mời (trọng tài)            |
| `POST`      | `/tournament-referees/reject-invitation`                    | Từ chối lời mời (trọng tài)              |
| `POST`      | `/tournament-referees/cancel-invitation`                    | Hủy lời mời đang chờ (tổ chức)           |
| `POST`      | `/tournament-referees/remove`                               | Loại bỏ trọng tài khỏi giải (tổ chức)    |
| `POST`      | `/tournament-referees/update-role`                          | Cập nhật vai trò trọng tài (tổ chức)     |
| `GET`       | `/tournament-referees/tournament/:tournamentId`             | Lấy trọng tài theo giải (bộ lọc vai trò) |
| `GET`       | `/tournament-referees/tournament/:tournamentId/invitations` | Lấy lời mời (chỉ tổ chức)                |

**Vai Trò Trọng Tài**: `referee`, `chief_referee`
**Trạng Thái Lời Mời**: `pending`, `accepted`, `rejected`, `cancelled`, `expired`

---

### 6. Hệ Thống Lên Lịch (`/schedules`)

**Tổng Quan**: Tạo và quản lý lịch biểu giải đấu (vòng bảng & ngoặc KO)

```
Quy Trình Lên Lịch:

Tùy Chọn 1: Toàn Bộ Giải Đấu (Vòng Bảng + Ngoặc KO)
┌────────────────────────────────────────────────┐
│ Tạo Lịch Toàn Bộ                              │
├────────────────────────────────────────────────┤
│ ↓ Thiết Lập Vòng Bảng                         │
│   - Xếp đội vào các bảng                      │
│   - Tạo trận vòng tròn                        │
│   - Tính toán xếp hạng                        │
│ ↓ Thiết Lập Ngoặc KO                          │
│   - Tạo ngoặc từ đội hạng nhất bảng           │
│   - Tạo trận ngoặc KO                         │
└────────────────────────────────────────────────┘

Tùy Chọn 2: Chỉ Vòng Bảng
┌────────────────────────────────────────────────┐
│ Tạo Lịch Vòng Bảng                             │
├────────────────────────────────────────────────┤
│ - Xếp đội ngẫu nhiên vào các bảng              │
│ - Tạo trận vòng tròn trong các bảng            │
│ - Quản lý khung giờ & giờ nghỉ trưa            │
└────────────────────────────────────────────────┘

Tùy Chọn 3: Chỉ Ngoặc KO
┌────────────────────────────────────────────────┐
│ Tạo Lịch Ngoặc KO                              │
├────────────────────────────────────────────────┤
│ - Tạo ngoặc từ dự vào trực tiếp                │
│ - Tạo trận ngoặc KO                            │
└────────────────────────────────────────────────┘
```

#### Các Endpoint Lịch Biểu

| Phương Thức | Endpoint                             | Mục Đích                                    |
| ----------- | ------------------------------------ | ------------------------------------------- |
| `POST`      | `/schedules/generate`                | Tạo lịch biểu giải đấu                      |
| `POST`      | `/schedules/generate-complete`       | Tạo giải đấu toàn bộ (vòng bảng + ngoặc KO) |
| `POST`      | `/schedules/generate-group-stage`    | Tạo lịch vòng bảng                          |
| `POST`      | `/schedules/generate-knockout-only`  | Tạo lịch chỉ ngoặc KO                       |
| `POST`      | `/schedules/generate-knockout-stage` | Tạo lịch giai đoạn ngoặc KO                 |
| `POST`      | `/schedules/update-knockout`         | Cập nhật dự vào ngoặc KO                    |
| `GET`       | `/schedules`                         | Lấy tất cả lịch biểu                        |
| `GET`       | `/schedules/:id`                     | Lấy lịch biểu theo ID                       |
| `GET`       | `/schedules/category/:categoryId`    | Lấy lịch theo hạng mục (bộ lọc giai đoạn)   |
| `PUT`       | `/schedules/:id`                     | Cập nhật lịch biểu                          |
| `DELETE`    | `/schedules/:id`                     | Xóa lịch biểu                               |

**Tính Năng**:

- Phân bổ khung giờ tự động
- Hỗ trợ giờ nghỉ trưa (mặc định 12:00-14:00)
- Nhiều bàn chơi song song
- Vòng tròn trong các bảng
- Tạo ngoặc KO

---

### 7. Quản Lý Trận Đấu (`/matches`)

**Tổng Quan**: Tạo, quản lý, và theo dõi kết quả trận đấu với quy trình trọng tài

```
Vòng Đời Trận Đấu:
┌───────────────────────────────────────────────────────┐
│ 1. Tạo Trận Đấu (từ lịch biểu)                       │
├───────────────────────────────────────────────────────┤
│ 2. Bắt Đầu Trận Đấu                                  │
│    - Trọng tài xác nhận bắt đầu trận               │
│    - Tự động gán 2 trọng tài từ nhóm              │
├───────────────────────────────────────────────────────┤
│ 3. Kết Thúc Trận Đấu (Trọng tài gửi kết quả)        │
│    - Nhập điểm số, kết quả set                     │
│    - Tạo xem trước ELO                             │
│    - Trạng thái: pending (chờ phê duyệt)           │
├───────────────────────────────────────────────────────┤
│ 4. Phê Duyệt Trọng Tài Trưởng                        │
│    - Xem xét kết quả và thay đổi ELO              │
│    - Phê Duyệt → Kết quả được hoàn tất             │
│    - Từ Chối → Trả lại để xem xét                 │
├───────────────────────────────────────────────────────┤
│ 5. Cập Nhật Xếp Tầng Khi Phê Duyệt:                 │
│    - Cập nhật xếp hạng nhóm (nếu vòng bảng)       │
│    - Đội thắng tiến bảng ngoặc KO                  │
│    - Cập nhật điểm ELO người chơi                 │
│    - Gửi thông báo                                 │
└───────────────────────────────────────────────────────┘

Luồng Trạng Thái Trận Đấu:
created → started → finalized & pending → approved
                              ↘ rejected ↗
```

#### Các Endpoint Trận Đấu

| Phương Thức | Endpoint                        | Mục Đích                                       |
| ----------- | ------------------------------- | ---------------------------------------------- |
| `POST`      | `/matches`                      | Tạo trận đấu                                   |
| `GET`       | `/matches`                      | Lấy tất cả trận đấu                            |
| `GET`       | `/matches/pending`              | Lấy trận chờ phê duyệt (trọng tài trưởng)      |
| `GET`       | `/matches/schedule/:scheduleId` | Lấy trận theo lịch biểu                        |
| `GET`       | `/matches/status/:status`       | Lấy trận theo trạng thái                       |
| `GET`       | `/matches/:id`                  | Lấy trận đấu theo ID                           |
| `PUT`       | `/matches/:id`                  | Cập nhật trận đấu                              |
| `DELETE`    | `/matches/:id`                  | Xóa trận đấu                                   |
| `POST`      | `/matches/:id/start`            | Bắt đầu trận (tự động gán 2 trọng tài)         |
| `POST`      | `/matches/:id/finalize`         | Gửi kết quả trận (trọng tài)                   |
| `POST`      | `/matches/:id/approve`          | Phê duyệt kết quả (trọng tài trưởng)           |
| `POST`      | `/matches/:id/reject`           | Từ chối kết quả với ghi chú (trọng tài trưởng) |
| `GET`       | `/matches/:id/elo-preview`      | Xem trước thay đổi ELO                         |
| `GET`       | `/matches/:id/pending-with-elo` | Lấy trận chờ với xem trước ELO                 |

#### Lịch Sử Trận Đấu Vận Động Viên

| Phương Thức | Endpoint                            | Mục Đích                           |
| ----------- | ----------------------------------- | ---------------------------------- |
| `GET`       | `/matches/athlete/:userId/upcoming` | Lấy trận sắp tới cho vận động viên |
| `GET`       | `/matches/athlete/:userId/history`  | Lấy lịch sử trận cho vận động viên |

#### Các Set Trận Đấu

| Phương Thức | Endpoint          | Mục Đích        |
| ----------- | ----------------- | --------------- |
| `POST`      | `/match-sets`     | Tạo set trận    |
| `GET`       | `/match-sets`     | Lấy tất cả set  |
| `GET`       | `/match-sets/:id` | Lấy set theo ID |
| `PUT`       | `/match-sets/:id` | Cập nhật set    |
| `DELETE`    | `/match-sets/:id` | Xóa set         |

---

### 8. Quản Lý Vòng Bảng (`/group-standings`)

**Tổng Quan**: Quản lý xếp nhóm và theo dõi xếp hạng nhóm

```
Quy Trình Vòng Bảng:
┌─────────────────────────────────────────┐
│ 1. Tạo Nhóm Giữ Chỗ                    │
│    - Tạo các nhóm trống                │
├─────────────────────────────────────────┤
│ 2. Xem Trước Rút Thăm Ngẫu Nhiên       │
│    - Xem trước xếp nhóm                │
├─────────────────────────────────────────┤
│ 3. Lưu Xếp Nhóm                        │
│    - Xác nhận xếp nhóm                 │
├─────────────────────────────────────────┤
│ 4. Tạo Trận Vòng Bảng                  │
│    - Tạo lịch vòng tròn                │
├─────────────────────────────────────────┤
│ 5. Kết Quả & Xếp Hạng                  │
│    - Sau mỗi trận: tính toán xếp hạng │
│    - Cập nhật vị trí đội trong bảng    │
├─────────────────────────────────────────┤
│ 6. Đội Vượt Vòng                        │
│    - Lấy đội hàng đầu từ mỗi bảng     │
│    - Tiến vào giai đoạn ngoặc KO      │
└─────────────────────────────────────────┘
```

#### Các Endpoint Xếp Hạng Nhóm

| Phương Thức | Endpoint                                 | Mục Đích                                |
| ----------- | ---------------------------------------- | --------------------------------------- |
| `POST`      | `/group-standings/generate-placeholders` | Tạo nhóm giữ chỗ cho hạng mục           |
| `POST`      | `/group-standings/random-draw`           | Lấy xem trước rút thăm ngẫu nhiên       |
| `POST`      | `/group-standings/save-assignments`      | Lưu xếp nhóm                            |
| `POST`      | `/group-standings/calculate`             | Tính toán lại vị trí xếp hạng nhóm      |
| `POST`      | `/group-standings/matches/:matchId/sync` | Đồng bộ xếp hạng sau khi phê duyệt trận |
| `GET`       | `/group-standings/:categoryId`           | Lấy xếp hạng nhóm cho hạng mục          |
| `GET`       | `/group-standings/:categoryId/qualified` | Lấy đội vượt vòng bảng                  |

---

### 9. Hệ Thống Ngoặc KO (`/knockout-brackets`)

**Tổng Quan**: Tạo và quản lý các ngoặc giải đấu loại trực tiếp

```
Quy Trình Ngoặc KO:
┌──────────────────────────────────────────────────┐
│ Tùy Chọn 1: Tạo từ Dự Vào (Không Vòng Bảng)     │
│  - Xếp trực tiếp dự vào vào ngoặc               │
└──────────────────────────────────────────────────┘

HOẶC

┌──────────────────────────────────────────────────┐
│ Tùy Chọn 2: Tạo từ Kết Quả Vòng Bảng            │
│  - N đội hàng đầu từ mỗi bảng → ngoặc           │
└──────────────────────────────────────────────────┘

Quản Lý Ngoặc:
┌──────────────────────────────────────────────────┐
│ 1. Xác Minh Ngoặc                                │
│    - Kiểm tra cấu trúc ngoặc                     │
├──────────────────────────────────────────────────┤
│ 2. Chạy Trận Đấu                                 │
│    - Tạo trận cho mỗi vòng                       │
├──────────────────────────────────────────────────┤
│ 3. Đưa Người Thắng Lên                           │
│    - Tự động đưa người thắng lên vòng sau      │
│    - Cập nhật trạng thái ngoặc                   │
├──────────────────────────────────────────────────┤
│ 4. Xếp Hạng Cuối Cùng                            │
│    - Lấy nhà vô địch, á quân, hạng 3           │
└──────────────────────────────────────────────────┘
```

#### Các Endpoint Ngoặc KO

| Phương Thức | Endpoint                                            | Mục Đích                              |
| ----------- | --------------------------------------------------- | ------------------------------------- |
| `POST`      | `/knockout-brackets/generate`                       | Tạo ngoặc từ dự vào (không vòng bảng) |
| `POST`      | `/knockout-brackets/generate-from-group-stage`      | Tạo ngoặc từ đội thắng vòng bảng      |
| `POST`      | `/knockout-brackets/validate`                       | Xác minh cấu trúc ngoặc               |
| `POST`      | `/knockout-brackets/advance-winner`                 | Đưa người thắng lên vòng sau          |
| `GET`       | `/knockout-brackets/category/:categoryId/tree`      | Lấy cấu trúc ngoặc toàn bộ            |
| `GET`       | `/knockout-brackets/category/:categoryId/standings` | Lấy xếp hạng giải (vị trí cuối)       |
| `GET`       | `/knockout-brackets/category/:categoryId/entry`     | Lấy ngoặc theo dự vào (ID hoặc tên)   |

---

### 10. Hệ Thống Xếp Hạng ELO

#### Điểm ELO (`/elo-scores`)

**Tổng Quan**: Quản lý xếp hạng ELO của người chơi

```
Quy Trình Hệ Thống ELO:
┌──────────────────────────────────────────┐
│ 1. Điểm ELO Ban Đầu (1200 mặc định)      │
│    - Tạo khi người dùng chơi lần đầu    │
├──────────────────────────────────────────┤
│ 2. Xử Lý Kết Quả Trận                    │
│    - Tính toán thay đổi ELO dựa trên:   │
│      - Xếp hạng hiện tại                │
│      - Kết quả trận (thắng/thua/hòa)   │
│      - K-factor (mức độ biến động)      │
├──────────────────────────────────────────┤
│ 3. Sau Khi Phê Duyệt Trận                │
│    - Cập nhật điểm ELO người chơi      │
│    - Ghi lại thay đổi ELO               │
├──────────────────────────────────────────┤
│ 4. Tạo Bảng Xếp Hạng                     │
│    - Sắp xếp người chơi theo xếp hạng  │
│    - Hiển thị xếp hạng công khai         │
└──────────────────────────────────────────┘
```

| Phương Thức | Endpoint                  | Mục Đích                                  |
| ----------- | ------------------------- | ----------------------------------------- |
| `POST`      | `/elo-scores`             | Tạo điểm ELO                              |
| `GET`       | `/elo-scores`             | Lấy tất cả điểm ELO                       |
| `GET`       | `/elo-scores/leaderboard` | Lấy bảng xếp hạng (sắp xếp theo xếp hạng) |
| `GET`       | `/elo-scores/:id`         | Lấy điểm ELO theo ID                      |
| `PUT`       | `/elo-scores/:id`         | Cập nhật điểm ELO                         |
| `DELETE`    | `/elo-scores/:id`         | Xóa điểm ELO                              |

#### Lịch Sử ELO (`/elo-histories`)

| Phương Thức | Endpoint             | Mục Đích                |
| ----------- | -------------------- | ----------------------- |
| `POST`      | `/elo-histories`     | Tạo mục lịch sử ELO     |
| `GET`       | `/elo-histories`     | Lấy tất cả mục lịch sử  |
| `GET`       | `/elo-histories/:id` | Lấy mục lịch sử theo ID |

---

### 11. Quản Lý Hệ Thống

#### Vai Trò & Quyền Hạn

| Phương Thức | Endpoint            | Mục Đích              |
| ----------- | ------------------- | --------------------- |
| `POST`      | `/roles`            | Tạo vai trò           |
| `GET`       | `/roles`            | Lấy tất cả vai trò    |
| `GET`       | `/roles/:id`        | Lấy vai trò theo ID   |
| `GET`       | `/roles/name/:name` | Lấy vai trò theo tên  |
| `PUT`       | `/roles/:id`        | Cập nhật vai trò      |
| `DELETE`    | `/roles/:id`        | Xóa vai trò           |
| `POST`      | `/permissions`      | Tạo quyền hạn         |
| `GET`       | `/permissions`      | Lấy tất cả quyền hạn  |
| `GET`       | `/permissions/:id`  | Lấy quyền hạn theo ID |
| `PUT`       | `/permissions/:id`  | Cập nhật quyền hạn    |
| `DELETE`    | `/permissions/:id`  | Xóa quyền hạn         |

---

### 12. Thông Báo Thời Gian Thực (`/notifications`)

**Tổng Quan**: Gửi thông báo thời gian thực qua Socket.IO

```
Luồng Thông Báo:
┌──────────────────────────────────────────┐
│ Sự Kiện Xảy Ra (kết thúc, thanh toán, etc) │
├──────────────────────────────────────────┤
│ ↓ Tạo Bản Ghi Thông Báo                  │
├──────────────────────────────────────────┤
│ ↓ Gửi đến Người Dùng Kết Nối             │
│   (qua Socket.IO nếu kết nối)            │
├──────────────────────────────────────────┤
│ ↓ Người Dùng Ngắt Kết Nối?               │
│   (Thông báo được lưu trong DB)          │
└──────────────────────────────────────────┘
```

| Phương Thức | Endpoint                            | Mục Đích                                   |
| ----------- | ----------------------------------- | ------------------------------------------ |
| `POST`      | `/notifications/send`               | Gửi thông báo đến người dùng               |
| `POST`      | `/notifications/event`              | Gửi sự kiện tùy chỉnh                      |
| `GET`       | `/notifications/connected-users`    | Lấy tất cả người dùng kết nối              |
| `GET`       | `/notifications/status/:userId`     | Kiểm tra trạng thái kết nối của người dùng |
| `POST`      | `/notifications/disconnect/:userId` | Ngắt kết nối người dùng                    |
| `GET`       | `/notifications/status`             | Lấy trạng thái dịch vụ                     |

**Các Sự Kiện Socket.IO**:

- `notification:match_result` - Kết quả trận được cập nhật
- `notification:payment_confirmed` - Thanh toán được xác nhận
- `notification:referee_invitation` - Lời mời trọng tài được gửi
- `notification:entry_joined` - Thành viên tham gia đội
- Các loại sự kiện tùy chỉnh khác

---

## Quy Trình Kinh Doanh Chính

### Quy Trình 1: Thiết Lập & Thực Hiện Giải Đấu Toàn Bộ

```
Giai Đoạn 1: Thiết Lập (Trước Đăng Ký)
┌─────────────────────────────────────────────┐
│ 1. Tạo Giải Đấu                            │
│    - Tên, ngày, địa điểm, số lượng bàn    │
│    - Trạng thái: created                    │
│ 2. Tạo Hạng Mục                            │
│    - Tên, loại, số lượng người dự vào      │
└─────────────────────────────────────────────┘
         ↓ (Cập nhật trạng thái thủ công hoặc theo lịch)

Giai Đoạn 2: Đăng Ký
┌─────────────────────────────────────────────┐
│ Trạng Thái Giải: registration_open         │
│ 1. Người Dùng Đăng Ký                      │
│    - Tạo đội hoặc tham gia đội             │
│ 2. Tăng Lực Lượng                           │
│    - Thêm thành viên, chuyển quyền          │
│ 3. Xử Lý Thanh Toán                         │
│    - Xác nhận thanh toán dự vào             │
│ 4. Kiểm Tra Đủ Điều Kiện                   │
│    - Loại bỏ dự vào không đủ               │
└─────────────────────────────────────────────┘
         ↓ (Cập nhật trạng thái khi sẵn sàng)

Giai Đoạn 3: Lên Lịch
┌─────────────────────────────────────────────┐
│ Trạng Thái Giải: registration_closed       │
│ 1. Mời Trọng Tài                           │
│    - Gửi lời mời trọng tài                 │
│ 2. Tạo Lịch Biểu                            │
│    - Vòng bảng + ngoặc KO                  │
│ 3. Tạo Trận Đấu                             │
│    - Từ lịch biểu, chờ chơi                │
└─────────────────────────────────────────────┘
         ↓ (Cập nhật trạng thái khi sẵn sàng)

Giai Đoạn 4: Thực Hiện
┌─────────────────────────────────────────────┐
│ Trạng Thái Giải: brackets_generated        │
│ 1. Chạy Trận Đấu                            │
│    - Bắt Đầu → Kết Thúc → Phê Duyệt → Kết │
│ 2. Cập Nhật Xếp Hạng                        │
│    - Đồng bộ xếp hạng vòng bảng            │
│    - Đưa người thắng ngoặc KO              │
│ 3. Cập Nhật Xếp Hạng ELO                    │
│    - Cập nhật xếp hạng mỗi trận            │
│ 4. Tạo Kết Quả Cuối                        │
│    - Nhà vô địch, á quân, xếp hạng        │
└─────────────────────────────────────────────┘
```

### Quy Trình 2: Đăng Ký Dự Vào & Tăng Lực Lượng

```
Đăng Ký Cá Nhân
┌─────────────────────────────────────────┐
│ 1. POST /entries/register (cá nhân)     │
│    - Tạo dự vào làm thành viên duy nhất│
│ 2. Thanh Toán (POST /payments)          │
│ 3. Dự vào sẵn sàng cho giải             │
└─────────────────────────────────────────┘

Đăng Ký Đội (Tạo Đội)
┌──────────────────────────────────────────┐
│ 1. POST /entries/register (đội)         │
│    - Tổ chức tạo dự vào                 │
│ 2. Thêm Thành Viên Đội:                  │
│    - POST /:entryId/add-member           │
│    - Thành viên xác nhận                 │
│ 3. Đội trưởng xác nhận đội hình          │
│    - POST /:entryId/confirm-lineup       │
│ 4. Thanh Toán (POST /payments)           │
└──────────────────────────────────────────┘

Đăng Ký Đội (Tham Gia Đội)
┌──────────────────────────────────────────┐
│ 1. Lấy đội có sẵn                         │
│    - GET /entries/category/:categoryId   │
│ 2. POST /join-request cho đội            │
│ 3. Đội trưởng xem xét yêu cầu            │
│    - GET /:entryId/join-requests         │
│ 4. Đội trưởng chấp thuận                  │
│    - POST /join-requests/:id/respond     │
│ 5. Thành viên tham gia đội                │
│ 6. Đội trưởng xác nhận đội hình          │
│ 7. Thanh Toán (POST /payments)           │
└──────────────────────────────────────────┘
```

### Quy Trình 3: Thực Hiện Trận Đấu Với Phê Duyệt Trọng Tài

```
┌──────────────────────────────────────────────────┐
│ 1. Tạo Trận Đấu (từ lịch biểu)                  │
│    - Giờ, địa điểm, đội được lên lịch           │
├──────────────────────────────────────────────────┤
│ 2. Trọng Tài Bắt Đầu Trận                        │
│    - POST /matches/:id/start                    │
│    - Trạng thái: started                        │
│    - 2 trọng tài được gán tự động              │
├──────────────────────────────────────────────────┤
│ 3. Kết Thúc Trận (Trọng Tài)                     │
│    - POST /matches/:id/finalize                 │
│    - Nhập điểm số, kết quả set                 │
│    - Lấy xem trước ELO                          │
│    - Trạng thái: pending (chờ phê duyệt)       │
├──────────────────────────────────────────────────┤
│ 4. Trọng Tài Trưởng Xem Xét                      │
│    - GET /matches/:id/pending-with-elo          │
│    - Xem xét tác động ELO                       │
├──────────────────────────────────────────────────┤
│ 5a. Phê Duyệt Kết Quả (Trọng Tài Trưởng)       │
│    - POST /matches/:id/approve                  │
│    - Cập nhật liên tục:                         │
│      - Cập nhật xếp hạng (nếu vòng bảng)      │
│      - Đưa người thắng ngoặc KO                │
│      - Cập nhật điểm ELO                        │
│      - Gửi thông báo                            │
├──────────────────────────────────────────────────┤
│ 5b. Từ Chối Kết Quả (Trọng Tài Trưởng)         │
│    - POST /matches/:id/reject                   │
│    - Trạng thái: rejected                       │
│    - Trả lại trọng tài để xem xét              │
└──────────────────────────────────────────────────┘
```

### Quy Trình 4: Xử Lý Xác Nhận Thanh Toán

```
┌──────────────────────────────────────────┐
│ 1. Người Dùng Tạo Thanh Toán             │
│    (POST /payments)                      │
│    - Dự vào: thanh toán được tạo         │
│    - Trạng thái: pending                 │
├──────────────────────────────────────────┤
│ 2. Gửi Thanh Toán Qua:                   │
│    - Tiền Mặt: POST /payments/cash       │
│    - Trực Tuyến: POST /payments/online   │
│    - Ngân Hàng: PUT /payments/:id/proof  │
├──────────────────────────────────────────┤
│ 3. Tổ Chức Xem Xét Thanh Toán Chờ        │
│    - GET /payments/pending/:categoryId   │
├──────────────────────────────────────────┤
│ 4a. Xác Nhận Thanh Toán (Tổ Chức)        │
│    - POST /payments/:id/confirm          │
│    - Trạng thái: completed               │
│    - Dự vào có đủ điều kiện               │
├──────────────────────────────────────────┤
│ 4b. Từ Chối Thanh Toán (Tổ Chức)         │
│    - POST /payments/:id/reject           │
│    - Trạng thái: failed                  │
│    - Thông báo & có thể gửi lại         │
├──────────────────────────────────────────┤
│ 4c. Hoàn Tiền Thanh Toán (Tổ Chức)      │
│    - POST /payments/:id/refund           │
│    - Trạng thái: refunded                │
│    - Dùng cho hủy bỏ                     │
└──────────────────────────────────────────┘
```

---

## Máy Trạng Thái & Luồng Trạng Thái

### Luồng Trạng Thái Giải Đấu

```
created → registration_open → registration_closed → brackets_generated → completed

Chuyển Đổi:
- Thủ Công: POST /tournaments/update-statuses
- Tự Động: Lên Lịch (cron jobs)
- Ngược Lại: Cho Phép (xây dựng lại lịch biểu)
```

### Luồng Trạng Thái Dự Vào

```
pending → confirmed → disqualified (tùy chọn)

Chuyển Đổi:
- Pending: Chờ xác nhận thanh toán
- Confirmed: Thanh toán được xác minh, đủ điều kiện
- Disqualified: Không vượt qua kiểm tra đủ điều kiện
```

### Luồng Trạng Thái Trận Đấu

```
created → started → finalized
            ↓        ├→ pending → approved ✓
            └────────┴→ pending → rejected ↻

Chuyển Đổi:
- created → started: Trọng tài khởi tạo
- started → finalized: Trọng tài gửi kết quả
- finalized → pending: Kết quả chờ phê duyệt
- pending → approved: Trọng tài trưởng xác nhận (liên tục)
- pending → rejected: Trọng tài trưởng trả lại để xem xét
```

### Luồng Trạng Thái Thanh Toán

```
pending → completed (✓ dự vào đủ điều kiện)
    ├→ failed (✗ tổ chức từ chối)
    └→ refunded (✗ hủy thanh toán)
```

### Luồng Trạng Thái Lời Mời Trọng Tài

```
pending → accepted (✓ trọng tài hoạt động)
    ├→ rejected (✗ trọng tài từ chối)
    ├→ cancelled (✗ tổ chức hủy)
    └→ expired (✗ không phản hồi sau N giờ)
```

### Tác Động Xếp Hạng ELO

```
Phê Duyệt Trận
    ↓
Tính Toán Delta ELO:
  - Người Thắng: +N điểm
  - Người Thua: -N điểm
  - Dựa trên: xếp hạng hiện tại, K-factor, kết quả
    ↓
Cập Nhật Điểm ELO Người Chơi
    ↓
Ghi Lại Mục Lịch Sử ELO
    ↓
Cập Nhật Bảng Xếp Hạng
```

---

## Mô Hình & Liên Kết Dữ Liệu

### Liên Kết Thực Thể Chính

```
Người Dùng
  ├─ Dự Vào (1→N): Tham gia giải đấu
  ├─ Trọng Tài Giải (1→N): Gán trọng tài
  ├─ Thanh Toán (1→N): Thanh toán dự vào
  ├─ Điểm ELO (1→N): Xếp hạng theo trò chơi
  └─ Lịch Sử ELO (1→N): Nhật ký thay đổi xếp hạng

Giải Đấu
  ├─ Hạng Mục (1→N): Nhiều hạng mục
  ├─ Lịch Biểu (1→N): Lịch biểu trận đấu
  ├─ Trận Đấu (1→N): Trận giải đấu
  └─ Trọng Tài Giải (1→N): Trọng tài được gán

Hạng Mục
  ├─ Dự Vào (1→N): Đội/người
  ├─ Thanh Toán (1→N): Phí dự vào
  ├─ Lịch Biểu (1→N): Lịch hạng mục
  ├─ Xếp Hạng Nhóm (1→N): Vòng bảng
  └─ Ngoặc KO (1→N): Ngoặc KO

Dự Vào
  ├─ Thành Viên Dự Vào (1→N): Thành viên đội
  ├─ Trận Đấu (1→N): Trận với dự vào này
  ├─ Thanh Toán (1→N): Bản ghi thanh toán
  └─ Yêu Cầu Tham Gia (1→N): Yêu cầu thành viên

Lịch Biểu
  └─ Trận Đấu (1→N): Trận trong lịch

Trận Đấu
  ├─ Set Trận (1→N): Các set/trò chơi riêng lẻ
  ├─ Trọng Tài (N→M): 2 trọng tài được gán
  └─ Delta ELO (tính toán): Thay đổi xếp hạng

Xếp Hạng Nhóm
  └─ Đội Nhóm (1→N): Đội trong nhóm với xếp hạng

Ngoặc KO
  └─ Trận Ngoặc (1→N): Trận ngoặc
```

### Thực Thể Dữ Liệu Chính

```
Người Dùng
├─ id, email, mật khẩu, firstName, lastName
├─ avatar, dateOfBirth, điện thoại, giới tính
├─ emailVerified, createdAt, vai trò

Giải Đấu
├─ id, tên, mô tả
├─ startDate, endDate, địa điểm
├─ numberOfTables, maxTeamSize
├─ status (created, registration_open, registration_closed, brackets_generated)

Hạng Mục
├─ id, tournamentId, tên, mô tả
├─ participantCount, giải thưởng

Dự Vào
├─ id, categoryId, tên đội (nếu đội), đội trưởng
├─ status (pending, confirmed, disqualified)

Trận Đấu
├─ id, categoryId, scheduleId
├─ team1Id, team2Id (HOẶC team1-solo, team2-solo)
├─ score, sets, status
├─ referee1Id, referee2Id (được gán tự động)

Thanh Toán
├─ id, entryId, số tiền
├─ phương thức (tiền_mặt, chuyển_khoản, trực_tuyến)
├─ status (pending, completed, failed, refunded)
├─ proofImageUrl

Trọng Tài Giải
├─ id, tournamentId, userId
├─ vai trò (referee, chief_referee)
├─ status (active)

Lời Mời Trọng Tài
├─ id, tournamentId, userId, refereeRole
├─ status (pending, accepted, rejected, cancelled, expired)
├─ expiryDate

Điểm ELO
├─ id, userId, gameType
├─ xếp hạng (ban đầu: 1200)
├─ lastUpdated

Lịch Sử ELO
├─ id, userId, matchId
├─ previousRating, newRating, delta
├─ timestamp
```

---

## Tính Năng Thời Gian Thực

### Tích Hợp Socket.IO

**Kết Nối**: Namespace `/api/notifications`

**Các Sự Kiện**:

```javascript
// Client phát
socket.emit("join:room", { userId: "user_123" });

// Server phát
io.to(userId).emit("notification:match_result", {
  matchId: "match_123",
  team1Score: 2,
  team2Score: 1,
  người_chiến_thắng: "team1",
  timestamp: Date.now(),
});

io.to(userId).emit("notification:referee_invitation", {
  tournamentId: "tour_123",
  tên_giải: "Giải Xuân 2026",
  vai_trò: "referee",
  expiryDate: "2026-04-07",
});

io.to(userId).emit("notification:payment_confirmed", {
  entryId: "entry_123",
  số_tiền: 500000,
  timestamp: Date.now(),
});
```

**Các Sự Kiện Chính**:

- `notification:match_result` - Kết quả trận được hoàn tất & phê duyệt
- `notification:referee_invitation` - Lời mời trọng tài mới
- `notification:payment_confirmed` - Thanh toán được phê duyệt
- `notification:entry_member_joined` - Thành viên mới tham gia đội
- `notification:group_standings_updated` - Xếp hạng vòng bảng thay đổi
- `notification:knockout_advanced` - Tiến lên trong ngoặc
- Các sự kiện tùy chỉnh khác

---

## Xử Lý Lỗi & Mã Trạng Thái

### Mã Trạng Thái HTTP Được Sử Dụng

| Mã    | Ý Nghĩa         | Ví Dụ                                               |
| ----- | --------------- | --------------------------------------------------- |
| `200` | OK              | Yêu cầu GET thành công                              |
| `201` | Được Tạo        | Tài nguyên được tạo thành công                      |
| `400` | Yêu Cầu Sai     | Dữ liệu đầu vào không hợp lệ                        |
| `401` | Không Được Phép | Token xác thực thiếu/không hợp lệ                   |
| `403` | Bị Cấm          | Người dùng thiếu quyền                              |
| `404` | Không Tìm Thấy  | Tài nguyên không tồn tại                            |
| `409` | Xung Đột        | Không thể hoàn thành (trùng lặp, vi phạm ràng buộc) |
| `422` | Không Thể Xử Lý | Lỗi xác thực                                        |
| `500` | Lỗi Máy Chủ     | Lỗi máy chủ nội bộ                                  |

### Các Tình Huống Lỗi Phổ Biến

```json
{
  "error": "NOT_FOUND",
  "message": "Giải đấu không tìm thấy",
  "statusCode": 404
}

{
  "error": "VALIDATION_ERROR",
  "message": "Dữ liệu dự vào không hợp lệ",
  "details": ["Tên đội bắt buộc", "ID đội trưởng không hợp lệ"]
}

{
  "error": "PERMISSION_DENIED",
  "message": "Chỉ đội trưởng mới có thể thêm thành viên",
  "statusCode": 403
}

{
  "error": "CONFLICT",
  "message": "Chỉ cho phép 1 trọng tài trưởng mỗi giải",
  "statusCode": 409
}
```

---

## Mô Hình Sử Dụng API

### Mô Hình Xác Thực

```
1. Đăng Ký: POST /auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

2. Đăng Nhập: POST /auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Phản Hồi:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}

3. Sử Dụng Token: Thêm vào tất cả yêu cầu được bảo vệ
Header: Authorization: Bearer eyJhbGc...

4. Làm Mới: POST /auth/refresh
Header: Authorization: Bearer <refresh_token>
```

### Mô Hình Tạo Giải Đấu

```
POST /tournaments
{
  "name": "Giải Vô Địch Xuân 2026",
  "startDate": "2026-04-15",
  "endDate": "2026-04-17",
  "location": "Thi Đấu A",
  "numberOfTables": 4,
  "categories": [
    {
      "name": "Nam Đơn",
      "participantCount": 32,
      "prizePool": 10000000
    },
    {
      "name": "Nữ Đôi",
      "participantCount": 16,
      "prizePool": 5000000
    }
  ]
}
```

### Mô Hình Đăng Ký Dự Vào

```
POST /entries/register
{
  "categoryId": "cat_123",
  "teamName": "Đội Alpha", // tùy chọn cho đội
  "captainId": "user_456",
  "members": ["user_456", "user_789"] // cho đội
}

// Tổ chức xác minh thanh toán
POST /payments/:paymentId/confirm

// Dự vào có đủ điều kiện
POST /entries/:entryId // status: confirmed
```

### Mô Hình Kết Quả Trận Đấu

```
1. Trọng tài bắt đầu trận
POST /matches/:id/start

2. Trọng tài gửi kết quả
POST /matches/:id/finalize
{
  "team1Score": 12,
  "team2Score": 8,
  "sets": [
    { "team1": 6, "team2": 4 },
    { "team1": 6, "team2": 4 }
  ]
}

3. Trọng tài trưởng xem trước
GET /matches/:id/pending-with-elo
// Hiển thị delta ELO

4. Trọng tài trưởng phê duyệt
POST /matches/:id/approve

// Cập nhật liên tục xảy ra tự động
// - Xếp hạng nhóm được cập nhật (nếu áp dụng)
// - Xử lý tiến lên ngoặc KO (nếu áp dụng)
// - Điểm ELO được cập nhật
// - Thông báo được gửi
```

---

## Cấu Hình & Giá Trị Mặc Định

```
INVITATION_EXPIRY_HOURS = 48 giờ (trọng tài)
DEFAULT_ELO_RATING = 1200
DEFAULT_K_FACTOR = 32 (mức độ biến động ELO)
LUNCH_BREAK_START = 12:00
LUNCH_BREAK_END = 14:00
REFEREES_PER_MATCH = 2
MAX_CHIEF_REFEREES = 1 (mỗi giải)
```

---

## Tóm Tắt

SmashHub-BE cung cấp hệ thống quản lý giải đấu hoàn chỉnh với:

- **Thiết Lập Giải**: Tạo, hạng mục, quản lý trạng thái
- **Đăng Ký**: Tăng lực lượng, quản lý thành viên, thanh toán
- **Lên Lịch**: Tạo vòng bảng + ngoặc KO tự động
- **Quản Lý Trận Đấu**: Quy trình trọng tài với phê duyệt nhiều cấp
- **Hệ Thống Xếp Hạng**: Điểm ELO động với bảng xếp hạng công khai
- **Cập Nhật Thời Gian Thực**: Thông báo Socket.IO cho các sự kiện trực tiếp
- **Phân Quyền**: Middleware quyền hạn dựa trên vai trò trong toàn bộ

Hệ thống nhấn mạnh tính toàn vẹn dữ liệu với máy trạng thái, cập nhật liên tục và nhật ký kiểm toán toàn diện.
