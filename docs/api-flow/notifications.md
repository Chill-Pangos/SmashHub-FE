# Notifications

Base path: `/api`

These endpoints support the realtime notification system backed by Socket.IO.

## `POST /notifications/send`

Send notification to one or many users, a room, or broadcast.

Request body:

```json
{
  "userId": "1",
  "type": "match_result",
  "title": "Match result approved",
  "message": "Your match result has been approved.",
  "data": { "matchId": 99 }
}
```

Alternatives: `userIds`, `roomId`, or `broadcast: true`.

Response body:

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "recipientCount": 1,
  "timestamp": "2026-04-27T00:00:00.000Z"
}
```

Notes:

- Use this for explicit user-facing pushes from admin or backend tooling.
- If broadcast is used, `recipientCount` reflects the current connected user count.

## `POST /notifications/event`

Send a custom Socket.IO event to a user or room.

Request body:

```json
{
  "userId": "1",
  "event": "match:update",
  "data": { "matchId": 99, "status": "approved" }
}
```

Notes: use this when the frontend listens for a custom event name instead of a generic notification payload.

## `GET /notifications/connected-users`

Get total connected users and their IDs.

Response body:

```json
{
  "totalConnectedUsers": 2,
  "connectedUserIds": ["1", "5"]
}
```

## `GET /notifications/status/{userId}`

Check if a user is connected.

Response body:

```json
{ "userId": "1", "isConnected": true }
```

## `POST /notifications/disconnect/{userId}`

Disconnect a specific user.

## `GET /notifications/status`

Get service status.

Response body contains `success`, `status`, `connectedUsers`, and `timestamp`.

## Notes

- This area is operational and not a CRUD-style resource API.
- Frontend should treat these endpoints as admin/debug or system integration APIs, not normal end-user flows.
