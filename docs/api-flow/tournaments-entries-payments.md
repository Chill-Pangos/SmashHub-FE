# Tournaments, Categories, Referees, Entries, Payments

Base path: `/api`

## Tournaments

### `POST /tournaments`

Create a tournament and its categories in one transaction.

Request body includes `name`, `tier`, `startDate`, `endDate`, `registrationStartDate`, `registrationEndDate`, `bracketGenerationDate`, `location`, optional `status`, `numberOfTables`, and optional `categories`.

Notes:

- `createdBy` is taken from the authenticated user.
- Dates are validated by the tournament model: start date cannot be in the past on create, registration must close before start, and bracket generation must be at least 48 hours before the start date.
- This is the main setup step before entries are opened.

### `GET /tournaments`

List tournaments.

Query params: `skip`, `limit`.

### `GET /tournaments/search`

List tournaments with filters.

Query params: `skip`, `limit`, `userId`, `createdBy`, `minAge`, `maxAge`, `minElo`, `maxElo`, `gender`, `isGroupStage`.

### `GET /tournaments/{id}`

Get tournament by ID. The response includes the tournament and its categories.

### `PUT /tournaments/{id}`

Update tournament.

### `DELETE /tournaments/{id}`

Delete tournament.

### `POST /tournaments/update-statuses`

Manually trigger status recalculation for tournaments.

### `GET /tournaments/upcoming-changes?hours=24`

Preview upcoming tournament status changes.

Notes: this endpoint is called in the flowchart before bulk status updates so organizers can preview what will change.

## Tournament Categories

### `POST /tournament-categories`

Create category.

Request body: `tournamentId`, `name`, `type`, `maxEntries`, `maxSets`, optional `teamFormat`, age/ELO limits, `gender`, `isGroupStage`, `entryFee`.

Notes:

- `gender = mixed` is only valid when `type = double`.
- `teamFormat` is required for team categories.

### `GET /tournament-categories`

List categories with pagination.

### `GET /tournament-categories/{id}`

Get category by ID.

### `PUT /tournament-categories/{id}`

Update category.

### `DELETE /tournament-categories/{id}`

Delete category.

### `GET /tournament-categories/tournament/{tournamentId}`

List categories by tournament.

## Tournament Referees

### `POST /tournament-referees/invite`

Invite a referee to a tournament.

Request body: `tournamentId`, `refereeId`, `role` (`referee` or `chief`).

Flow note: this is the start of the referee invitation flow in the diagram. Organizers call this first, then the referee accepts or rejects.

### `POST /tournament-referees/accept-invitation`

Referee accepts invitation.

Request body: `invitationId`.

### `POST /tournament-referees/reject-invitation`

Referee rejects invitation.

Request body: `invitationId`, optional `rejectionReason`.

### `POST /tournament-referees/cancel-invitation`

Organizer cancels a pending invitation.

### `POST /tournament-referees/remove`

Organizer removes a referee from a tournament.

### `POST /tournament-referees/update-role`

Organizer updates referee role in a tournament.

### `GET /tournament-referees/tournament/{tournamentId}`

List referees assigned to a tournament.

Query param: optional `role` filter.

### `GET /tournament-referees/tournament/{tournamentId}/invitations`

List invitations for a tournament. Organizer only.

Query param: optional `status` filter.

## Entries

### `POST /entries/register`

Register for a tournament.

Request body:

```json
{
  "categoryId": 1,
  "action": "create_team",
  "targetEntryId": 12
}
```

Notes:

- `action` is used by the backend to distinguish team creation vs joining an existing team.
- This endpoint belongs to the entry registration flow in the flowchart.

### `GET /entries/category/{categoryId}`

List entries in a category.

Query params: `skip`, `limit`, `isFull`, `isAcceptingMembers`, `captainName`.

### `GET /entries/{entryId}`

Get entry by ID.

### `PUT /entries/{entryId}`

Update entry.

### `DELETE /entries/{entryId}`

Delete entry.

### `POST /entries/{entryId}/add-member`

Captain adds a member.

Request body: `newMemberId`.

### `POST /entries/{entryId}/remove-member`

Captain removes a member.

Request body: `memberId`.

### `GET /entries/{entryId}/members`

List entry members with pagination.

### `POST /entries/{entryId}/leave`

Member leaves the entry.

### `POST /entries/{entryId}/set-required-members`

Captain sets the required member count for team entries.

Request body: `count`.

### `POST /entries/{entryId}/transfer-captaincy`

Captain transfers captaincy to another member.

Request body: `newCaptainId`.

### `GET /entries/{entryId}/join-requests`

Captain lists join requests for the entry.

Query param: optional `status` (`pending`, `approved`, `rejected`).

### `POST /entries/join-requests/{joinRequestId}/respond`

Captain approves or rejects a join request.

Request body: `action` (`approve` or `reject`), optional `rejectionReason`.

### `POST /entries/{entryId}/confirm-lineup`

Captain confirms final lineup.

Flow note: this is a prerequisite before entry can be treated as ready for competition scheduling.

### `GET /entries/category/{categoryId}/eligible`

List eligible and ineligible entries for a category.

### `POST /entries/category/{categoryId}/disqualify`

Organizer disqualifies ineligible entries.

### `GET /entries/me`

Get current user entries with role information.

### `GET /entries/{entryId}/my-role`

Get current user's role in a specific entry.

## Entry Import

### `POST /entries/import/preview`

Preview a single-entry Excel file before saving.

Content type: `multipart/form-data`.

Required fields: `file`, `categoryId`.

Response contains `valid`, `entries`, `errors`, and `summary`.

### `POST /entries/import/confirm`

Confirm and save imported single entries.

Request body: `categoryId`, `entries`.

### `POST /entries/import/double/preview`

Preview double-entry Excel file.

### `POST /entries/import/double/confirm`

Confirm and save imported double entries.

Flow note: import should always use preview first so the frontend can surface row-level validation errors before confirm.

## Payments

### `POST /payments`

Create payment for an entry.

Request body:

```json
{
  "entryId": 1,
  "amount": 100000,
  "method": "bank_transfer"
}
```

### `POST /payments/cash`

Record cash payment.

### `POST /payments/online`

Record online payment.

### `GET /payments/{paymentId}`

Get payment by ID.

### `GET /payments/entry/{entryId}`

Get payments by entry.

Query param: optional `status`.

### `GET /payments/category/{categoryId}`

Get payments by category. Organizer/admin view.

Query params: `skip`, `limit`, optional `status`, optional `method`.

### `GET /payments/category/{categoryId}/stats`

Get payment statistics for a category.

### `GET /payments/pending/{categoryId}`

Get pending payments for organizer review.

### `POST /payments/{paymentId}/confirm`

Confirm a payment.

Request body: optional `proofImageUrl`, `transactionRef`.

### `POST /payments/{paymentId}/reject`

Reject a payment.

### `POST /payments/{paymentId}/refund`

Refund a payment.

### `PUT /payments/{paymentId}/proof`

Upload or update proof image URL.

Flow notes:

- For bank transfer, upload proof first, then organizer confirms the payment.
- Payment confirmation is one of the prerequisites for schedule generation in the flowchart.
- Frontend should distinguish user-created payment requests from organizer review actions.
