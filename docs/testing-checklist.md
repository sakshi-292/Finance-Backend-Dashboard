# Testing Checklist

A step-by-step guide for evaluators to verify the backend end-to-end.

## Prerequisites

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Server runs at `http://localhost:3000` (or configured PORT).

---

## 1. Health check

- [ ] `GET /health` returns `200` with `{ success: true }`

## 2. Authentication

- [ ] `POST /api/v1/auth/login` with admin credentials → returns JWT + user
- [ ] `POST /api/v1/auth/login` with wrong password → returns `401`
- [ ] `GET /api/v1/auth/me` with valid token → returns user profile
- [ ] `GET /api/v1/auth/me` without token → returns `401`

## 3. Dashboard (login as Viewer, Analyst, or Admin)

- [ ] `GET /api/v1/dashboard/summary` → returns aggregate totals
- [ ] `GET /api/v1/dashboard/category-breakdown` → returns grouped categories
- [ ] `GET /api/v1/dashboard/type-breakdown` → returns income/expense totals
- [ ] `GET /api/v1/dashboard/recent-activity` → returns latest 5 records
- [ ] Add `?startDate=2026-01-01&endDate=2026-01-31` to summary → filtered result

## 4. User management (login as Admin)

- [ ] `GET /api/v1/users` → returns all users
- [ ] `POST /api/v1/users` with valid body → creates new user (201)
- [ ] `POST /api/v1/users` with duplicate email → returns `409`
- [ ] `PATCH /api/v1/users/:id` → updates user role or status
- [ ] `PATCH /api/v1/users/:id` (self, status: INACTIVE) → returns `400`

## 5. Records (login as Admin)

- [ ] `POST /api/v1/records` with valid body → creates record (201)
- [ ] `GET /api/v1/records` → returns paginated list
- [ ] `GET /api/v1/records?type=EXPENSE` → filtered by type
- [ ] `GET /api/v1/records?search=rent` → partial match on category/notes
- [ ] `GET /api/v1/records?page=2&limit=5` → pagination works
- [ ] `GET /api/v1/records/:id` → returns single record
- [ ] `PATCH /api/v1/records/:id` → updates record fields
- [ ] `PATCH /api/v1/records/:id` with empty body → returns `400`
- [ ] `DELETE /api/v1/records/:id` → soft-deletes (record hidden from listings)
- [ ] `GET /api/v1/records/:id` on deleted record → returns `404`
- [ ] `DELETE /api/v1/records/:id` on already deleted → returns `404`

## 6. RBAC enforcement

### As Analyst

- [ ] `GET /api/v1/records` → `200` (read allowed)
- [ ] `POST /api/v1/records` → `403` (write denied)
- [ ] `PATCH /api/v1/records/:id` → `403`
- [ ] `DELETE /api/v1/records/:id` → `403`
- [ ] `GET /api/v1/users` → `403` (user management denied)
- [ ] `GET /api/v1/dashboard/summary` → `200` (dashboard allowed)

### As Viewer

- [ ] `GET /api/v1/records` → `403` (record access denied)
- [ ] `GET /api/v1/users` → `403`
- [ ] `GET /api/v1/dashboard/summary` → `200` (dashboard allowed)

## 7. Edge cases

- [ ] Request with expired/malformed JWT → `401`
- [ ] Request to non-existent route → `404` with clean response
- [ ] `GET /api/v1/records?startDate=2026-03-01&endDate=2026-01-01` → `400` (invalid range)
- [ ] `POST /api/v1/records` with amount `0` → `400` (must be positive)
