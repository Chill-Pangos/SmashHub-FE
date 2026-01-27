# SmashHub Authentication Flow Documentation

## 📋 Mục lục
- [Tổng quan Authentication](#tổng-quan-authentication)
- [1. Flow Đăng ký (Register)](#1-flow-đăng-ký-register)
- [2. Flow Đăng nhập (Login)](#2-flow-đăng-nhập-login)
- [3. Flow Làm mới Token (Token Refresh)](#3-flow-làm-mới-token-token-refresh)
- [4. Flow Lấy thông tin User (Get Profile)](#4-flow-lấy-thông-tin-user-get-profile)
- [5. Flow Đổi mật khẩu (Change Password)](#5-flow-đổi-mật-khẩu-change-password)
- [6. Flow Quên mật khẩu (Password Reset với OTP)](#6-flow-quên-mật-khẩu-password-reset-với-otp)
- [7. Flow Xác thực Email (Email Verification)](#7-flow-xác-thực-email-email-verification)
- [8. Flow Đăng xuất (Logout)](#8-flow-đăng-xuất-logout)
- [Cấu trúc Response](#cấu-trúc-response)
- [Xử lý Errors](#xử-lý-errors)

---

## Tổng quan Authentication

### Kiến trúc
SmashHub sử dụng **JWT (JSON Web Tokens)** cho authentication với 2 loại tokens:

| Token Type | Thời hạn | Mục đích |
|------------|----------|----------|
| **Access Token** | 1 giờ | Xác thực các API requests |
| **Refresh Token** | 7 ngày | Lấy Access Token mới khi hết hạn |

### Base URLs
- **Development**: `http://localhost:3000/api/auth`
- **Production**: `https://api.smashhub.com/api/auth`

### Response Format chuẩn
Tất cả API responses đều có format:
```json
{
  "success": true/false,
  "message": "Mô tả kết quả",
  "data": { ... } // Chỉ có khi success: true
}
```

---

## 1. Flow Đăng ký (Register)

### Endpoint
```
POST /api/auth/register
```

### Mô tả Flow
```
User                          Frontend                       Backend                      Database
 |                               |                             |                              |
 |--1. Điền form đăng ký-------->|                             |                              |
 |                               |--2. POST /register--------->|                              |
 |                               |    {username, email,        |                              |
 |                               |     password, role}         |                              |
 |                               |                             |--3. Validate input---------->|
 |                               |                             |                              |
 |                               |                             |--4. Check email exists------>|
 |                               |                             |<--5. Email available---------|
 |                               |                             |                              |
 |                               |                             |--6. Hash password----------->|
 |                               |                             |                              |
 |                               |                             |--7. Create user------------->|
 |                               |                             |--8. Create role------------->|
 |                               |                             |<--9. User created------------|
 |                               |                             |                              |
 |                               |                             |--10. Generate Access Token-->|
 |                               |                             |--11. Generate Refresh Token->|
 |                               |                             |--12. Save tokens to DB------>|
 |                               |                             |                              |
 |                               |<--13. Return tokens---------|                              |
 |<--14. Success message---------|    + user data              |                              |
 |                               |                              |                              |
 |--15. Lưu tokens local-------->|                              |                              |
 |--16. Redirect to dashboard--->|                              |                              |
```

### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| username | string | ✅ | Tên đăng nhập (unique) |
| email | string | ✅ | Email (unique, format hợp lệ) |
| password | string | ✅ | Mật khẩu (sẽ được hash) |
| role | string | ❌ | Role: `spectator`, `player`, `organizer` (default: spectator) |

### Success Response (201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "roles": [8],
      "isEmailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 409 | EMAIL_ALREADY_EXISTS | Email đã được đăng ký |
| 409 | USERNAME_ALREADY_EXISTS | Username đã được sử dụng |
| 404 | ROLE_NOT_FOUND | Role không hợp lệ |
| 400 | BAD_REQUEST | Dữ liệu đầu vào không hợp lệ |

### Frontend cần làm gì?
1. ✅ Validate input trước khi gửi (email format, password strength)
2. ✅ Gửi POST request với data
3. ✅ Nếu success: Lưu `accessToken`, `refreshToken`, `user` vào localStorage/sessionStorage
4. ✅ Redirect user đến dashboard/home
5. ✅ Nếu error: Hiển thị error message cho user

---

## 2. Flow Đăng nhập (Login)

### Endpoint
```
POST /api/auth/login
```

### Mô tả Flow
```
User                    Frontend                 Backend                  Database
 |                         |                        |                          |
 |--1. Nhập email/pass---->|                        |                          |
 |                         |--2. POST /login------->|                          |
 |                         |    {email, password}   |                          |
 |                         |                        |--3. Find user by email-->|
 |                         |                        |<--4. User found----------|
 |                         |                        |                          |
 |                         |                        |--5. Compare password---->|
 |                         |                        |    (bcrypt.compare)      |
 |                         |                        |                          |
 |                         |                        |--6. Get user roles------>|
 |                         |                        |<--7. Roles data----------|
 |                         |                        |                          |
 |                         |                        |--8. Generate tokens----->|
 |                         |                        |--9. Save tokens to DB--->|
 |                         |                        |                          |
 |                         |<--10. Return response--|                          |
 |<--11. Login success-----|    {tokens, user}      |                          |
 |                         |                        |                          |
 |--12. Lưu tokens-------->|                        |                          |
 |--13. Access app-------->|                        |                          |
```

### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email đã đăng ký |
| password | string | ✅ | Mật khẩu |

### Success Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 401 | INVALID_CREDENTIALS | Email hoặc password sai |
| 400 | BAD_REQUEST | Thiếu email hoặc password |

### Frontend cần làm gì?
1. ✅ Gửi POST request với email & password
2. ✅ Nếu success: Lưu tokens và user data vào storage
3. ✅ Set axios/fetch interceptor để tự động thêm token vào headers
4. ✅ Nếu error: Hiển thị thông báo lỗi đăng nhập

---

## 3. Flow Làm mới Token (Token Refresh)

### Endpoint
```
POST /api/auth/refresh
```

### Khi nào cần refresh token?
- ⏰ Access token hết hạn (nhận 401 từ API)
- 🔄 Proactive refresh: Trước khi token hết hạn 5 phút (recommended)

### Mô tả Flow
```
Frontend                    Backend                      Database
   |                          |                              |
   |--1. API call với-------->| (Bất kỳ API nào)            |
   |   expired access token   |                              |
   |                          |--2. Verify token------------>|
   |<--3. 401 Unauthorized----|    (Token expired)           |
   |                          |                              |
   |--4. POST /refresh------->|                              |
   |   {refreshToken}         |                              |
   |                          |--5. Verify refresh token---->|
   |                          |<--6. Token valid-------------|
   |                          |                              |
   |                          |--7. Check if blacklisted---->|
   |                          |<--8. Not blacklisted---------|
   |                          |                              |
   |                          |--9. Generate new tokens----->|
   |                          |--10. Save new tokens-------->|
   |                          |--11. Blacklist old tokens--->|
   |                          |                              |
   |<--12. Return new tokens--|                              |
   |                          |                              |
   |--13. Update storage----->|                              |
   |--14. Retry original----->|                              |
   |    API với new token     |                              |
```

### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| refreshToken | string | ✅ | Refresh token đang có |

### Success Response (200)
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token..."
  }
}
```

### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 401 | INVALID_TOKEN | Token không hợp lệ hoặc đã hết hạn |
| 401 | TOKEN_REVOKED | Token đã bị vô hiệu hóa |

### Frontend cần làm gì?
1. ✅ Setup axios/fetch interceptor để catch 401 responses
2. ✅ Khi nhận 401: Tự động call refresh endpoint
3. ✅ Nếu refresh success: Lưu tokens mới, retry request gốc
4. ✅ Nếu refresh fail: Clear storage, redirect to login
5. ✅ Tránh infinite loop bằng cách đánh dấu request đã retry

---

## 4. Flow Lấy thông tin User (Get Profile)

### Endpoint
```
GET /api/auth/profile
```

### Mô tả Flow
```
Frontend                    Backend                      Database
   |                          |                              |
   |--1. GET /profile-------->|                              |
   |   Header: Bearer token   |                              |
   |                          |--2. Verify access token----->|
   |                          |                              |
   |                          |--3. Check if blacklisted---->|
   |                          |<--4. Token valid-------------|
   |                          |                              |
   |                          |--5. Extract userId---------->|
   |                          |    from token                |
   |                          |                              |
   |                          |--6. Get user by ID---------->|
   |                          |<--7. User data---------------|
   |                          |                              |
   |<--8. Return user data----|                              |
   |    {id, username, email} |                              |
```

### Headers Required
```
Authorization: Bearer <access_token>
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 401 | NO_TOKEN_PROVIDED | Thiếu authorization header |
| 401 | INVALID_TOKEN | Token không hợp lệ hoặc hết hạn |
| 404 | USER_NOT_FOUND | User đã bị xóa |

### Frontend cần làm gì?
1. ✅ Gửi GET request với Bearer token trong header
2. ✅ Hiển thị thông tin user
3. ✅ Cache data để tránh call nhiều lần
4. ✅ Update cache khi user thay đổi thông tin

---

## 5. Flow Đổi mật khẩu (Change Password)

### Endpoint
```
POST /api/auth/change-password
```

### Mô tả Flow
```
User                 Frontend                Backend                 Database
 |                      |                       |                        |
 |--1. Nhập old/new---->|                       |                        |
 |    password          |                       |                        |
 |                      |--2. POST /change----->|                        |
 |                      |   + Bearer token      |                        |
 |                      |   {oldPassword,       |                        |
 |                      |    newPassword}       |                        |
 |                      |                       |--3. Verify token------>|
 |                      |                       |--4. Get user---------->|
 |                      |                       |<--5. User data---------|
 |                      |                       |                        |
 |                      |                       |--6. Compare old------->|
 |                      |                       |    password            |
 |                      |                       |                        |
 |                      |                       |--7. Hash new pass----->|
 |                      |                       |--8. Update password--->|
 |                      |                       |                        |
 |                      |<--9. Success----------|                        |
 |<--10. Confirmation---|                       |                        |
```

### Headers Required
```
Authorization: Bearer <access_token>
```

### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| oldPassword | string | ✅ | Mật khẩu hiện tại |
| newPassword | string | ✅ | Mật khẩu mới (phải khác old) |

### Success Response (200)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 400 | INVALID_OLD_PASSWORD | Old password không đúng |
| 400 | BAD_REQUEST | New password yếu |
| 401 | UNAUTHORIZED | Không có token hoặc expired |

### Frontend cần làm gì?
1. ✅ Validate new password strength trước khi gửi
2. ✅ Confirm new password (nhập 2 lần)
3. ✅ Gửi POST với Bearer token
4. ✅ Nếu success: Hiển thị success message
5. ✅ Recommend: Logout và yêu cầu login lại với password mới

---

## 6. Flow Quên mật khẩu (Password Reset với OTP)

### Flow Tổng quan
```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PASSWORD RESET FLOW (3 STEPS)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  STEP 1: Request OTP                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ User nhập email → Backend generate OTP 6 số → Gửi email         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                               ↓                                           │
│  STEP 2: Verify OTP (Optional)                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ User nhập OTP → Backend verify → Cho phép tiếp tục              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                               ↓                                           │
│  STEP 3: Reset Password                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ User nhập OTP + password mới → Backend verify & update          │  │
│  │ → Blacklist all tokens → User login lại                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Request OTP

#### Endpoint
```
POST /api/auth/forgot-password
```

#### Mô tả Flow chi tiết
```
User                Frontend            Backend                Email Service         Database
 |                     |                   |                         |                    |
 |--1. Click---------->|                   |                         |                    |
 |   "Forgot Pass"     |                   |                         |                    |
 |                     |                   |                         |                    |
 |<--2. Show form------|                   |                         |                    |
 |                     |                   |                         |                    |
 |--3. Enter email---->|                   |                         |                    |
 |                     |--4. POST--------->|                         |                    |
 |                     | /forgot-password  |                         |                    |
 |                     |                   |--5. Find user---------->|                    |
 |                     |                   |<--6. User exists--------|                    |
 |                     |                   |                         |                    |
 |                     |                   |--7. Generate OTP------->|                    |
 |                     |                   |   (6 random digits)     |                    |
 |                     |                   |                         |                    |
 |                     |                   |--8. Calculate expiry--->|                    |
 |                     |                   |   (current time + 10min)|                    |
 |                     |                   |                         |                    |
 |                     |                   |--9. Invalidate old----->|                    |
 |                     |                   |   OTPs for this user    |                    |
 |                     |                   |                         |                    |
 |                     |                   |--10. Save OTP to DB---->|                    |
 |                     |                   |   {userId, code,        |                    |
 |                     |                   |    type, expiresAt}     |                    |
 |                     |                   |                         |                    |
 |                     |                   |--11. Send email-------->|                    |
 |                     |                   |    with OTP             |                    |
 |                     |                   |                         |--12. Email sent--->|
 |                     |                   |                         |    Subject:        |
 |                     |                   |                         |    "Reset Password"|
 |                     |                   |                         |    Code: 123456    |
 |                     |                   |                         |                    |
 |                     |<--13. Success-----|                         |                    |
 |<--14. Show OTP------|   message         |                         |                    |
 |   input form        |                   |                         |                    |
 |                     |                   |                         |                    |
 |<--15. Check email---|                   |                         |                    |
 |   (OTP: 123456)     |                   |                         |                    |
```

#### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email đã đăng ký |

#### Success Response (200)
```json
{
  "success": true,
  "message": "OTP has been sent to your email"
}
```

#### OTP Details
- **Format**: 6 chữ số (VD: 123456)
- **Thời hạn**: 10 phút
- **Type**: `password_reset`
- **Một lần dùng**: Sau khi dùng sẽ được mark `isUsed = true`

---

### Step 2: Verify OTP (Optional)

#### Endpoint
```
POST /api/auth/verify-otp
```

#### Mô tả Flow
```
User                Frontend            Backend                 Database
 |                     |                   |                        |
 |--1. Enter OTP------>|                   |                        |
 |   (123456)          |                   |                        |
 |                     |--2. POST--------->|                        |
 |                     | /verify-otp       |                        |
 |                     | {email, otp}      |                        |
 |                     |                   |--3. Find user--------->|
 |                     |                   |<--4. User found--------|
 |                     |                   |                        |
 |                     |                   |--5. Find OTP---------->|
 |                     |                   |   WHERE userId = X     |
 |                     |                   |   AND code = "123456"  |
 |                     |                   |   AND type = "reset"   |
 |                     |                   |   AND isUsed = false   |
 |                     |                   |<--6. OTP found---------|
 |                     |                   |                        |
 |                     |                   |--7. Check expiry------>|
 |                     |                   |   (now < expiresAt)    |
 |                     |                   |                        |
 |                     |<--8. OTP valid----|                        |
 |<--9. Show new-------|                   |                        |
 |   password form     |                   |                        |
```

#### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email của user |
| otp | string | ✅ | Mã OTP 6 số |

#### Success Response (200)
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

#### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 404 | USER_NOT_FOUND | Email không tồn tại |
| 400 | INVALID_OTP | OTP không đúng |
| 400 | EXPIRED_OTP | OTP quá 10 phút |

#### Note
- Step này là **optional** 
- Có thể skip và verify OTP trực tiếp ở Step 3
- Recommend sử dụng để UX tốt hơn (báo lỗi sớm)

---

### Step 3: Reset Password

#### Endpoint
```
POST /api/auth/reset-password
```

#### Mô tả Flow chi tiết
```
User                Frontend            Backend                 Database
 |                     |                   |                        |
 |--1. Enter new------>|                   |                        |
 |   password          |                   |                        |
 |                     |--2. POST--------->|                        |
 |                     | /reset-password   |                        |
 |                     | {email, otp,      |                        |
 |                     |  newPassword}     |                        |
 |                     |                   |--3. Find user--------->|
 |                     |                   |<--4. User found--------|
 |                     |                   |                        |
 |                     |                   |--5. Verify OTP-------->|
 |                     |                   |   (same as Step 2)     |
 |                     |                   |<--6. OTP valid---------|
 |                     |                   |                        |
 |                     |                   |--7. Hash new pass----->|
 |                     |                   |   (bcrypt)             |
 |                     |                   |                        |
 |                     |                   |--8. Update user------->|
 |                     |                   |   password = hash      |
 |                     |                   |                        |
 |                     |                   |--9. Mark OTP used----->|
 |                     |                   |   isUsed = true        |
 |                     |                   |   usedAt = now         |
 |                     |                   |                        |
 |                     |                   |--10. Blacklist-------->|
 |                     |                   |   all access tokens    |
 |                     |                   |                        |
 |                     |                   |--11. Blacklist-------->|
 |                     |                   |   all refresh tokens   |
 |                     |                   |                        |
 |                     |<--12. Success-----|                        |
 |<--13. Show success--|                   |                        |
 |   message           |                   |                        |
 |                     |                   |                        |
 |--14. Redirect to--->|                   |                        |
 |   login page        |                   |                        |
```

#### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email của user |
| otp | string | ✅ | Mã OTP 6 số |
| newPassword | string | ✅ | Mật khẩu mới |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

#### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 404 | USER_NOT_FOUND | Email không tồn tại |
| 400 | INVALID_OTP | OTP không đúng |
| 400 | EXPIRED_OTP | OTP quá 10 phút |
| 400 | SAME_PASSWORD | Password mới trùng với password cũ |
| 400 | BAD_REQUEST | Password không đủ mạnh |

#### Important Security Notes
1. 🔒 Sau khi reset password, **TẤT CẢ tokens cũ bị blacklist**
2. 🔑 User phải login lại với password mới
3. ⏰ OTP hết hạn sau 10 phút
4. 1️⃣ Mỗi OTP chỉ dùng được 1 lần
5. 🔄 Request OTP mới sẽ invalidate OTP cũ

---

## 7. Flow Xác thực Email (Email Verification)

### Tổng quan
Email verification là bước bảo mật bổ sung để xác nhận email của người dùng là thật. Một số tính năng có thể yêu cầu email đã được xác thực.

### 7.1. Gửi OTP Xác thực Email

#### Endpoint
```
POST /api/auth/send-email-verification
```

#### Mô tả Flow
```
User                Frontend            Backend                Email Service         Database
 |                     |                   |                         |                    |
 |--1. Request-------->|                   |                         |                    |
 |   Verification      |                   |                         |                    |
 |                     |--2. POST--------->|                         |                    |
 |                     | /send-email-      |                         |                    |
 |                     | verification      |                         |                    |
 |                     | {email}           |                         |                    |
 |                     |                   |--3. Find user---------->|                    |
 |                     |                   |<--4. User found---------|                    |
 |                     |                   |                         |                    |
 |                     |                   |--5. Generate OTP------->|                    |
 |                     |                   |   (6 random digits)     |                    |
 |                     |                   |                         |                    |
 |                     |                   |--6. Save OTP to DB----->|                    |
 |                     |                   |   {userId, code,        |                    |
 |                     |                   |    type: "email_verify"|                    |
 |                     |                   |    expiresAt}           |                    |
 |                     |                   |                         |                    |
 |                     |                   |--7. Send email--------->|                    |
 |                     |                   |    with OTP             |                    |
 |                     |                   |                         |--8. Email sent---->|
 |                     |                   |                         |    Subject:        |
 |                     |                   |                         |    "Verify Email"  |
 |                     |                   |                         |    Code: 123456    |
 |                     |                   |                         |                    |
 |                     |<--9. Success------|                         |                    |
 |<--10. Show OTP------|   message         |                         |                    |
 |   input form        |                   |                         |                    |
```

#### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email cần xác thực |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Verification OTP has been sent to your email"
}
```

#### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 404 | USER_NOT_FOUND | Email không tồn tại |
| 500 | EMAIL_SEND_ERROR | Không thể gửi email |

---

### 7.2. Xác thực Email

#### Endpoint
```
POST /api/auth/verify-email-otp
```

#### Mô tả Flow
```
User                Frontend            Backend                 Database
 |                     |                   |                        |
 |--1. Enter OTP------>|                   |                        |
 |   from email        |                   |                        |
 |                     |--2. POST--------->|                        |
 |                     | /verify-email-otp |                        |
 |                     | {email, otp}      |                        |
 |                     |                   |--3. Find user--------->|
 |                     |                   |<--4. User found--------|
 |                     |                   |                        |
 |                     |                   |--5. Find OTP---------->|
 |                     |                   |   WHERE userId = X     |
 |                     |                   |   AND code = "123456"  |
 |                     |                   |   AND type = "email_   |
 |                     |                   |   verify"              |
 |                     |                   |   AND isUsed = false   |
 |                     |                   |<--6. OTP found---------|
 |                     |                   |                        |
 |                     |                   |--7. Verify OTP-------->|
 |                     |                   |   (check expiry)       |
 |                     |                   |                        |
 |                     |                   |--8. Update user------->|
 |                     |                   |   isEmailVerified=true |
 |                     |                   |                        |
 |                     |                   |--9. Mark OTP used----->|
 |                     |                   |   isUsed = true        |
 |                     |                   |                        |
 |                     |<--10. Success-----|                        |
 |<--11. Email---------|                   |                        |
 |   verified          |                   |                        |
```

#### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email của user |
| otp | string | ✅ | Mã OTP 6 số nhận từ email |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Email has been verified successfully"
}
```

#### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 404 | USER_NOT_FOUND | Email không tồn tại |
| 400 | INVALID_OTP | OTP không đúng |
| 400 | EXPIRED_OTP | OTP quá 10 phút |

#### Frontend cần làm gì?
1. ✅ Sau khi user nhập OTP, gửi POST request
2. ✅ Nếu success: Hiển thị success message, update user state
3. ✅ Update `isEmailVerified` trong local storage
4. ✅ Nếu error: Cho phép retry hoặc resend OTP

---

### 7.3. Gửi lại OTP Xác thực Email

#### Endpoint
```
POST /api/auth/resend-email-verification
```

#### Mô tả Flow
```
User                Frontend            Backend                Email Service         Database
 |                     |                   |                         |                    |
 |--1. Click---------->|                   |                         |                    |
 |   "Resend OTP"      |                   |                         |                    |
 |                     |--2. POST--------->|                         |                    |
 |                     | /resend-email-    |                         |                    |
 |                     | verification      |                         |                    |
 |                     | {email}           |                         |                    |
 |                     |                   |--3. Find user---------->|                    |
 |                     |                   |<--4. User found---------|                    |
 |                     |                   |                         |                    |
 |                     |                   |--5. Invalidate old----->|                    |
 |                     |                   |   OTPs                  |                    |
 |                     |                   |                         |                    |
 |                     |                   |--6. Generate new OTP--->|                    |
 |                     |                   |                         |                    |
 |                     |                   |--7. Save to DB--------->|                    |
 |                     |                   |                         |                    |
 |                     |                   |--8. Send email--------->|                    |
 |                     |                   |                         |--9. Email sent---->|
 |                     |                   |                         |                    |
 |                     |<--10. Success-----|                         |                    |
 |<--11. Show msg------|                   |                         |                    |
 |   "New OTP sent"    |                   |                         |                    |
```

#### Request Body
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| email | string | ✅ | Email cần xác thực |

#### Success Response (200)
```json
{
  "success": true,
  "message": "A new OTP code has been sent to your email"
}
```

#### Error Cases
| Status | Error Code | Khi nào xảy ra |
|--------|------------|----------------|
| 404 | USER_NOT_FOUND | Email không tồn tại |
| 500 | EMAIL_SEND_ERROR | Không thể gửi email |

#### Frontend cần làm gì?
1. ✅ Hiển thị nút "Resend OTP" sau một khoảng thời gian (VD: 60 giây)
2. ✅ Gửi POST request khi user click
3. ✅ Hiển thị countdown timer cho lần resend tiếp theo
4. ✅ Show success message khi OTP mới được gửi

#### Important Notes về Email Verification
1. ⏰ OTP hết hạn sau **10 phút**
2. 1️⃣ Mỗi OTP chỉ dùng được **1 lần**
3. 🔄 Resend OTP sẽ **invalidate OTP cũ**
4. ✉️ Type của OTP này là `email_verify` (khác với `password_reset`)
5. 🔒 Một số API có thể require `isEmailVerified = true`

---

## 8. Flow Đăng xuất (Logout)

### Endpoint
```
POST /api/auth/logout
```

### Mô tả Flow
```
User                Frontend            Backend                 Database
 |                     |                   |                        |
 |--1. Click Logout--->|                   |                        |
 |                     |--2. POST--------->|                        |
 |                     | /logout           |                        |
 |                     | + Bearer token    |                        |
 |                     |                   |--3. Verify token------>|
 |                     |                   |--4. Extract userId---->|
 |                     |                   |                        |
 |                     |                   |--5. Blacklist all----->|
 |                     |                   |   access tokens        |
 |                     |                   |   WHERE userId = X     |
 |                     |                   |                        |
 |                     |                   |--6. Blacklist all----->|
 |                     |                   |   refresh tokens       |
 |                     |                   |   WHERE userId = X     |
 |                     |                   |                        |
 |                     |<--7. Success------|                        |
 |                     |                   |                        |
 |--8. Clear storage-->|                   |                        |
 |   (tokens, user)    |                   |                        |
 |                     |                   |                        |
 |--9. Redirect to---->|                   |                        |
 |   login page        |                   |                        |
```

### Headers Required
```
Authorization: Bearer <access_token>
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Điều gì xảy ra khi logout?
1. 🚫 **Tất cả Access Tokens** của user bị blacklist
2. 🚫 **Tất cả Refresh Tokens** của user bị blacklist
3. 🔒 User không thể sử dụng bất kỳ token cũ nào
4. 🔑 Phải login lại để lấy tokens mới

### Frontend cần làm gì?
1. ✅ Gửi POST `/logout` với Bearer token
2. ✅ **Bất kể response thế nào**, luôn clear storage:
   - Remove `accessToken`
   - Remove `refreshToken`
   - Remove `user` data
3. ✅ Redirect to login page
4. ✅ Clear bất kỳ cached data nào (Redux, Context, etc.)

---

## Cấu trúc Response

### Success Response
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {
    // Response data (nếu có)
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

---

## Xử lý Errors

### HTTP Status Codes

| Status Code | Ý nghĩa | Khi nào xảy ra | Frontend action |
|-------------|---------|----------------|-----------------|
| **200** | OK | Request thành công | Process data |
| **201** | Created | Resource được tạo thành công | Process data |
| **400** | Bad Request | Input không hợp lệ | Hiển thị error message |
| **401** | Unauthorized | Token invalid/expired | Refresh token hoặc logout |
| **403** | Forbidden | Không có quyền | Hiển thị access denied |
| **404** | Not Found | Resource không tồn tại | Hiển thị not found |
| **409** | Conflict | Resource đã tồn tại (duplicate) | Hiển thị conflict error |
| **500** | Server Error | Lỗi server | Hiển thị generic error |

### Common Error Codes

| HTTP Status | Error Code | Mô tả | Xử lý |
|-------------|------------|-------|-------|
| 400 | BAD_REQUEST | Dữ liệu đầu vào không hợp lệ | Validate và hiển thị lỗi |
| 400 | INVALID_OTP | Mã OTP không đúng | Cho phép nhập lại |
| 400 | EXPIRED_OTP | OTP đã hết hạn | Cho phép gửi lại OTP |
| 400 | INVALID_OLD_PASSWORD | Mật khẩu hiện tại sai | Yêu cầu nhập lại |
| 400 | SAME_PASSWORD | Password mới trùng password cũ | Yêu cầu password khác |
| 401 | UNAUTHORIZED | Chưa xác thực | Redirect to login |
| 401 | INVALID_CREDENTIALS | Email/password sai | Hiển thị lỗi đăng nhập |
| 401 | INVALID_TOKEN | Token không hợp lệ/hết hạn | Refresh token hoặc logout |
| 401 | TOKEN_REVOKED | Token đã bị thu hồi | Logout và clear storage |
| 401 | NO_TOKEN_PROVIDED | Thiếu authorization header | Redirect to login |
| 403 | FORBIDDEN | Không có quyền truy cập | Hiển thị access denied |
| 403 | EMAIL_NOT_VERIFIED | Email chưa xác thực | Yêu cầu xác thực email |
| 404 | USER_NOT_FOUND | Không tìm thấy user | Hiển thị user not found |
| 404 | ROLE_NOT_FOUND | Role không hợp lệ | Hiển thị invalid role |
| 409 | EMAIL_ALREADY_EXISTS | Email đã được đăng ký | Yêu cầu email khác |
| 409 | USERNAME_ALREADY_EXISTS | Username đã tồn tại | Yêu cầu username khác |
| 500 | INTERNAL_ERROR | Lỗi server | Hiển thị generic error |
| 500 | EMAIL_SEND_ERROR | Không gửi được email | Cho phép thử lại |

### Recommended Error Messages cho User

| Error Code | User-Friendly Message |
|------------|----------------------|
| INVALID_TOKEN / TOKEN_REVOKED | Your session has expired. Please login again. |
| INVALID_CREDENTIALS | Email or password is incorrect. |
| EMAIL_ALREADY_EXISTS | This email is already registered. |
| USERNAME_ALREADY_EXISTS | This username is already taken. |
| EMAIL_NOT_VERIFIED | Please verify your email to continue. |
| INVALID_OTP | The code you entered is incorrect. |
| EXPIRED_OTP | This code has expired. Please request a new one. |
| INVALID_OLD_PASSWORD | Your current password is incorrect. |
| SAME_PASSWORD | New password must be different from current password. |
| USER_NOT_FOUND | Account not found. Please check your email. |
| EMAIL_SEND_ERROR | Unable to send email. Please try again later. |
| Network error | Please check your internet connection. |
| INTERNAL_ERROR | Something went wrong. Please try again later. |

---

**Version**: 2.0.0  
**Last Updated**: January 12, 2026  
**Author**: SmashHub Development Team

---

## Changelog

### Version 2.0.0 (January 12, 2026)
- ✨ Added email verification flow with 3 new endpoints
- 📝 Updated error response format with error codes
- 🆕 Added `isEmailVerified` field to user object
- 📊 Added comprehensive error codes table
- 🔒 Added `EMAIL_NOT_VERIFIED` and `USERNAME_ALREADY_EXISTS` error handling
- 📧 Added email verification OTP type (`email_verify`)
- 🔄 Updated all error cases to use structured error codes

### Version 1.0.0 (January 10, 2026)
- 🎉 Initial authentication flow documentation
