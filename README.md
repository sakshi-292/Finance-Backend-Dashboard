# Finance Data Processing and Access Control Backend

## Overview

This project is a backend system built for a finance dashboard where different users interact with financial data based on their roles.

The system focuses on clean API design, proper access control, and reliable data handling. It supports managing users, storing financial records, and generating summary insights for a dashboard.

The implementation prioritizes clarity, maintainability, and correctness over unnecessary complexity.

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Zod (validation)
* JWT (authentication)

---

## Key Features

### Authentication

* Login using email and password
* JWT-based authentication
* Endpoint to fetch current user (`/api/v1/auth/me`)

---

### Role-Based Access Control (RBAC)

The system defines three roles:

| Role    | Access                               |
| ------- | ------------------------------------ |
| Viewer  | Dashboard only                       |
| Analyst | View financial records and dashboard |
| Admin   | Full access (users + records)        |

Access is enforced at the backend using middleware.

---

### User Management (Admin Only)

* Create users
* List all users
* Update user role and status (active/inactive)

---

### Financial Records Management

Each financial record includes:

* amount
* type (income / expense)
* category
* date
* notes

Supported operations:

* Create record (Admin)
* View records (Admin, Analyst)
* Update record (Admin)
* Delete record (Admin)

---

### Filtering, Pagination and Search

The records API supports:

* Filtering by type, category, and date range
* Pagination (`page`, `limit`)
* Search across category and notes

Records can be filtered by exact category using the `category` query parameter.

For broader matching, the `search` query parameter performs a case-insensitive partial match across `category` and `notes`.

---

### Soft Delete

Records are not permanently deleted.

* Deleted records are marked internally
* They are excluded from all queries and dashboard calculations

---

### Dashboard APIs

Provides aggregated insights:

* Total income
* Total expenses
* Net balance
* Category breakdown
* Type breakdown
* Recent activity

---

### Validation and Error Handling

* Input validation using Zod
* Consistent API response structure
* Proper status codes:

  * 400 → validation error
  * 401 → unauthorized
  * 403 → forbidden
  * 404 → not found
  * 409 → conflict

---

## API Base URL

```
http://localhost:3000/api/v1
```

---

## Setup Instructions

### 1. Install dependencies

```
npm install
```

### 2. Setup environment variables

```
cp .env.example .env
```

Update the `.env` file with your database and JWT configuration.

---

### 3. Run database migrations

```
npx prisma migrate dev
```

---

### 4. Seed the database

```
npm run seed
```

---

### 5. Start the server

```
npm run dev
```

---

## Test Credentials

| Role    | Email                | Password   |
| ------- | -------------------- | ---------- |
| Admin   | admin@example.com    | admin123   |
| Analyst | analyst@example.com  | analyst123 |
| Viewer  | viewer@example.com   | viewer123  |

---

## Example Endpoints

### Login

```
POST /api/v1/auth/login
```

### Get Current User

```
GET /api/v1/auth/me
```

### Get Records (with filters, pagination, search)

```
GET /api/v1/records?page=1&limit=10&search=rent
```

### Dashboard Summary

```
GET /api/v1/dashboard/summary
```

---

## Testing Guide

1. Login as Admin
2. Test dashboard endpoints
3. Create a new user
4. Create and update a record
5. Test filtering, pagination, and search
6. Login as Analyst → verify read-only access
7. Login as Viewer → verify dashboard-only access

---

## Design Decisions

* PostgreSQL is used for structured financial data
* Prisma is used for type-safe database queries
* RBAC is implemented using middleware for clarity and reuse
* Soft delete is used to avoid accidental data loss
* Pagination and search are added to improve API usability

---

## Assumptions

* Viewer users only need dashboard-level access
* Analyst users do not modify financial data
* Admin users manage both users and records
* Deleted records should not appear in normal queries

---

## Summary

This project demonstrates a clean and structured backend system with role-based access control, reliable data handling, and practical features for a finance dashboard.

The focus has been on building a system that is easy to understand, maintain, and extend.
