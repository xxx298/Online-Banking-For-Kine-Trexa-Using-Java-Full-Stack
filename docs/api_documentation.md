# AuraBank REST API Specification

**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer Token (JWT in `Authorization` Header)

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/register`
Registers a new customer or admin user and automatically provisions a primary Checking Account with a $1,000 credit.

- **Request Body**:
  ```json
  {
    "full_name": "Alex Morgan",
    "email": "alex@example.com",
    "password": "Password123!",
    "transaction_pin": "1234",
    "role": "customer"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account created successfully!",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 4,
      "full_name": "Alex Morgan",
      "email": "alex@example.com",
      "role": "customer"
    }
  }
  ```

### POST `/api/auth/login`
Authenticates a user and returns a signed JWT session token.

- **Request Body**:
  ```json
  {
    "email": "john@bank.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@bank.com",
      "role": "customer",
      "status": "active"
    }
  }
  ```

### GET `/api/auth/me`
Retrieves current user details and list of active accounts. Requires `Authorization: Bearer <token>`.

---

## 2. Account Endpoints (`/api/accounts`)

### GET `/api/accounts`
Retrieves all bank accounts owned by the authenticated user and portfolio net worth.

### POST `/api/accounts`
Opens a new account (`checking`, `savings`, or `investment`).

- **Request Body**:
  ```json
  {
    "account_type": "savings",
    "initial_deposit": 500.00
  }
  ```

### PATCH `/api/accounts/:id/toggle-status`
Freezes or unfreezes an account owned by the user.

---

## 3. Transfer Endpoints (`/api/transfers`)

### POST `/api/transfers`
Executes an atomic transfer of funds between accounts with security PIN authorization.

- **Request Body**:
  ```json
  {
    "sender_account_id": 1,
    "recipient_account_number": "200540881920",
    "amount": 150.00,
    "category": "Transfer",
    "description": "Lunch reimbursement",
    "transaction_pin": "1234"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully transferred $150.00 to account 200540881920.",
    "transaction": {
      "reference_id": "TXN-491029",
      "amount": 150.00,
      "sender_account_number": "100120349812",
      "recipient_account_number": "200540881920",
      "new_sender_balance": 8300.75,
      "timestamp": "2026-08-21T10:12:00.000Z"
    }
  }
  ```

---

## 4. Transaction Endpoints (`/api/transactions`)

### GET `/api/transactions`
Retrieves search-filtered and categorized transaction history.

- **Query Parameters**:
  - `search`: String (searches ref ID or description)
  - `category`: String (`Transfer`, `Savings`, `Bills`, `Shopping`, `Salary`)
  - `type`: String (`transfer`, `deposit`, `withdrawal`)
  - `limit`: Number (default: 50)

---

## 5. Administrative Endpoints (`/api/admin`)
*Requires `role === "admin"` in JWT claims.*

### GET `/api/admin/analytics`
Returns aggregate liquidity metrics, transaction volumes, user counts, and recent audit logs.

### GET `/api/admin/users`
Lists all registered users along with their account totals and frozen/active statuses.

### PATCH `/api/admin/users/:userId/status`
Updates user status (`active` | `frozen` | `suspended`).
