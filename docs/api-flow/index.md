# SmashHub API Docs

Base URL: `/api`

These docs are extracted from the current backend routes, controllers, DTOs, models, and the API flowchart. The goal is to give frontend developers a practical reference for request shape, response shape, auth, and usage order.

## Files

- [Auth, Users, Roles, Permissions](auth-users-rbac.md)
- [Tournaments, Categories, Referees, Entries, Payments](tournaments-entries-payments.md)
- [Schedules, Matches, Sub-matches, Group Standings, Knockout, ELO](competition-flow.md)
- [Notifications](notifications.md)

## Conventions

- `skip` and `limit` are the standard pagination query params when an endpoint supports pagination.
- Protected endpoints usually require `Authorization: Bearer <token>` and may also require a permission check.
- Many endpoints return domain entities directly. When the exact response wrapper is not fixed in code, the docs below describe the practical response shape the frontend can expect.
- Flow notes call out where one API must be called before another, or where an endpoint triggers downstream updates automatically.

## Core Flows

1. Auth flow: register or login, then refresh token or change password as needed.
2. Tournament setup flow: create tournament, create categories, optionally assign referees, then open entries.
3. Entry flow: register entries, manage members, review join requests, confirm lineup, and disqualify invalid entries if needed.
4. Competition flow: configure schedule, generate schedules, start matches, submit results, approve or reject results, then update standings, brackets, and ELO.
5. Payment flow: create payment, upload proof if needed, confirm/reject/refund from organizer side.

## Notes For Frontend

- The flowchart is especially important for match approval, group stage progression, knockout advancement, and ELO updates.
- The backend already exposes several read endpoints without auth; frontend can use them for public data views, but should still handle empty states and pagination.
- Some endpoints are aliases of each other or exist to support legacy screens. Keep them in sync with the route files, not only the swagger comments.
