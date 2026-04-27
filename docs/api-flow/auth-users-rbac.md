# Auth, Users, Roles, Permissions

Base path: `/api`

## Auth

### `POST /auth/register`

Create a new user account.

Request body:

```json
{
  "firstName": "Nguyen",
  "lastName": "Van A",
  "email": "user@test.com",
  "password": "Password123!",
  "role": "spectator"
}
```

Response body:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Nguyen",
      "lastName": "Van A",
      "email": "user@test.com",
      "roles": [8],
      "isEmailVerified": false
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Notes: password must be at least 8 characters and include uppercase, number, and special character. This is the start of the auth flow in the flowchart.

### `POST /auth/login`

Authenticate with email and password.

Request body:

```json
{
  "email": "user@test.com",
  "password": "Password123!"
}
```

Response body contains `accessToken`, `refreshToken`, and `user`.

### `POST /auth/refresh`

Refresh access token using a refresh token.

Request body:

```json
{ "refreshToken": "..." }
```

Response body contains new `accessToken` and `refreshToken`.

### `POST /auth/change-password`

Authenticated user changes password.

Request body:

```json
{
  "oldPassword": "Password123!",
  "newPassword": "NewStrongPass456!"
}
```

Notes: use after login; requires bearer token.

### `POST /auth/logout`

Blacklists all tokens for the current user.

Notes: use after the app clears local tokens on frontend.

### `POST /auth/forgot-password`

Send OTP to email for password reset.

Request body:

```json
{ "email": "user@test.com" }
```

This starts the password reset flow in the flowchart.

### `POST /auth/verify-otp`

Verify password-reset OTP.

Request body:

```json
{ "email": "user@test.com", "otp": "123456" }
```

### `POST /auth/reset-password`

Reset password after OTP verification.

Request body:

```json
{
  "email": "user@test.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

### `POST /auth/send-email-verification-otp`

Send OTP for email verification.

Request body:

```json
{ "email": "user@test.com" }
```

### `POST /auth/verify-email-otp`

Verify email using OTP.

Request body:

```json
{ "email": "user@test.com", "otp": "123456" }
```

### `POST /auth/resend-email-verification-otp`

Resend email verification OTP.

Request body:

```json
{ "email": "user@test.com" }
```

Flow note: use this after the user has already requested verification and the OTP expired or was lost.

## Users

### `POST /users`

Create a user. Protected by `users:create`.

Request body fields: `firstName`, `lastName`, `email`, `password`, optional `avatarUrl`, `dob`, `phoneNumber`, `gender`.

### `GET /users`

Paginated list of users. Query: `skip`, `limit`.

Response body:

```json
{
  "users": [],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### `GET /users/{id}`

Get user details by ID.

### `PUT /users/{id}`

Update user. Protected by `users:update`.

### `DELETE /users/{id}`

Delete user. Protected by `users:delete`.

### `PUT /users/{id}/profile`

Update profile-only fields: `avatarUrl`, `dob`, `phoneNumber`, `gender`.

Notes: useful for profile edit screen when password/email do not need to change.

## Roles

### `POST /roles`

Create role. Protected by `roles:create`.

Request body: `name`, optional `description`.

### `GET /roles`

List roles with pagination.

### `GET /roles/{id}`

Get role by ID.

### `PUT /roles/{id}`

Update role. Protected by `roles:update`.

### `DELETE /roles/{id}`

Delete role. Protected by `roles:delete`.

### `GET /roles/name/{name}`

Get role by name.

## Permissions

### `POST /permissions`

Create permission. Protected by `permissions:manage`.

Request body: `name` in `resource:action` form such as `match:read`.

### `GET /permissions`

List permissions with pagination.

### `GET /permissions/{id}`

Get permission by ID.

### `PUT /permissions/{id}`

Update permission. Protected by `permissions:manage`.

### `DELETE /permissions/{id}`

Delete permission. Protected by `permissions:manage`.

## RBAC Notes

- Permission checks are enforced in middleware, so frontend should not rely on route availability alone.
- `user`, `referee`, `chief_referee`, and `organizer` are meaningful system roles in the backend model, and several competition flows depend on them.
- Role changes matter for downstream flows like referee invitation, chief referee approval, and organizer-only tournament setup.
