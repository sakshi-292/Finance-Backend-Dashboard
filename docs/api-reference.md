# API Reference

Base URL: `http://localhost:<PORT>`

All authenticated endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

---

## Health

| Method | Route    | Auth | Roles | Purpose              |
| ------ | -------- | ---- | ----- | -------------------- |
| GET    | /health  | No   | —     | Server health check  |

---

## Auth

| Method | Route                 | Auth | Roles | Purpose                        |
| ------ | --------------------- | ---- | ----- | ------------------------------ |
| POST   | /api/v1/auth/login    | No   | —     | Authenticate and receive JWT   |
| GET    | /api/v1/auth/me       | Yes  | Any   | Get current user profile       |

### POST /api/v1/auth/login

Request body:

| Field    | Type   | Required | Constraints       |
| -------- | ------ | -------- | ----------------- |
| email    | string | Yes      | Valid email, max 255 |
| password | string | Yes      | Min 1, max 128    |

Success response (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
}
```

### GET /api/v1/auth/me

Success response (200):

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

## Users (Admin only)

| Method | Route                 | Auth | Roles | Purpose            |
| ------ | --------------------- | ---- | ----- | ------------------ |
| POST   | /api/v1/users         | Yes  | ADMIN | Create a user      |
| GET    | /api/v1/users         | Yes  | ADMIN | List all users     |
| PATCH  | /api/v1/users/:id     | Yes  | ADMIN | Update a user      |

### POST /api/v1/users

Request body:

| Field    | Type   | Required | Constraints                          |
| -------- | ------ | -------- | ------------------------------------ |
| name     | string | Yes      | Trimmed, min 1, max 100              |
| email    | string | Yes      | Valid email, max 255                  |
| password | string | Yes      | Min 6, max 128                       |
| role     | string | Yes      | `VIEWER`, `ANALYST`, or `ADMIN`      |
| status   | string | No       | `ACTIVE` or `INACTIVE` (default: `ACTIVE`) |

### PATCH /api/v1/users/:id

Request body (all optional, at least one required):

| Field  | Type   | Constraints                     |
| ------ | ------ | ------------------------------- |
| name   | string | Trimmed, min 1, max 100         |
| role   | string | `VIEWER`, `ANALYST`, or `ADMIN` |
| status | string | `ACTIVE` or `INACTIVE`          |

Guards:
- Admin cannot deactivate their own account
- Admin cannot remove their own admin role

---

## Records

| Method | Route                   | Auth | Roles          | Purpose              |
| ------ | ----------------------- | ---- | -------------- | -------------------- |
| POST   | /api/v1/records         | Yes  | ADMIN          | Create a record      |
| GET    | /api/v1/records         | Yes  | ADMIN, ANALYST | List records (paginated) |
| GET    | /api/v1/records/:id     | Yes  | ADMIN, ANALYST | Get record by ID     |
| PATCH  | /api/v1/records/:id     | Yes  | ADMIN          | Update a record      |
| DELETE | /api/v1/records/:id     | Yes  | ADMIN          | Soft-delete a record |

### POST /api/v1/records

Request body:

| Field    | Type   | Required | Constraints                              |
| -------- | ------ | -------- | ---------------------------------------- |
| amount   | number | Yes      | Positive, max 9,999,999,999.99           |
| type     | string | Yes      | `INCOME` or `EXPENSE`                    |
| category | string | Yes      | Trimmed, min 1, max 50                   |
| date     | string | Yes      | Valid date (ISO 8601)                     |
| notes    | string | No       | Trimmed, max 500                         |

### GET /api/v1/records — Query params

| Param     | Type   | Default | Constraints                      |
| --------- | ------ | ------- | -------------------------------- |
| type      | string | —       | `INCOME` or `EXPENSE`            |
| category  | string | —       | Exact match, trimmed, max 50     |
| startDate | string | —       | Valid date (ISO 8601)            |
| endDate   | string | —       | Valid date, must be >= startDate  |
| search    | string | —       | Partial match on category/notes, case-insensitive, max 100 |
| page      | number | 1       | Positive integer                 |
| limit     | number | 10      | Positive integer, max 100        |

Success response (200):

```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "amount": 8500,
        "type": "INCOME",
        "category": "Salary",
        "date": "2026-01-15T00:00:00.000Z",
        "notes": "January salary",
        "createdById": "uuid",
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

### PATCH /api/v1/records/:id

Request body (all optional, at least one required):

| Field    | Type        | Constraints                    |
| -------- | ----------- | ------------------------------ |
| amount   | number      | Positive, max 9,999,999,999.99 |
| type     | string      | `INCOME` or `EXPENSE`          |
| category | string      | Trimmed, min 1, max 50         |
| date     | string      | Valid date (ISO 8601)           |
| notes    | string/null | Trimmed, max 500 (null clears) |

### DELETE /api/v1/records/:id

Performs a soft delete. The record is marked as deleted but remains in the database. Soft-deleted records are excluded from all list, get, and dashboard queries.

---

## Dashboard

| Method | Route                                | Auth | Roles                  | Purpose                     |
| ------ | ------------------------------------ | ---- | ---------------------- | --------------------------- |
| GET    | /api/v1/dashboard/summary            | Yes  | VIEWER, ANALYST, ADMIN | Aggregate financial summary |
| GET    | /api/v1/dashboard/category-breakdown | Yes  | VIEWER, ANALYST, ADMIN | Totals grouped by category  |
| GET    | /api/v1/dashboard/type-breakdown     | Yes  | VIEWER, ANALYST, ADMIN | Totals grouped by type      |
| GET    | /api/v1/dashboard/recent-activity    | Yes  | VIEWER, ANALYST, ADMIN | Latest 5 records            |

### Query params (summary, category-breakdown, type-breakdown)

| Param     | Type   | Required | Constraints            |
| --------- | ------ | -------- | ---------------------- |
| startDate | string | No       | Valid date (ISO 8601)  |
| endDate   | string | No       | Valid date, >= startDate |

### GET /api/v1/dashboard/summary — Response (200)

```json
{
  "success": true,
  "message": "Summary retrieved successfully",
  "data": {
    "totalIncome": 25500,
    "totalExpense": 12725,
    "netBalance": 12775,
    "totalRecords": 16
  }
}
```

---

## Error responses

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Short error description",
  "data": {}
}
```

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 400    | Validation failed or invalid request     |
| 401    | Missing or invalid authentication token  |
| 403    | Insufficient permissions for this role   |
| 404    | Resource not found                       |
| 409    | Conflict (e.g. duplicate email)          |
| 500    | Internal server error                    |

---

## Seed credentials

| Email                 | Password    | Role    |
| --------------------- | ----------- | ------- |
| admin@example.com     | admin123    | ADMIN   |
| analyst@example.com   | analyst123  | ANALYST |
| viewer@example.com    | viewer123   | VIEWER  |
