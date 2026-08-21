# 🏦 Secure Online Banking System (AuraBank)

A production-ready, full-stack Secure Online Banking Web Application engineered with a modern cyber-navy interface (React + Vite), robust RESTful API (Node.js + Express), SQLite database engine, atomic transaction handling, and Role-Based Access Control (RBAC).

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v24.11.0-green.svg)
![React](https://img.shields.io/badge/React-v18.2-cyan.svg)
![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange.svg)

---

## 🌟 Key Features

### 🔒 1. Security & Authentication
- **JWT Authentication**: Stateless, encrypted bearer tokens for session authorization.
- **Bcrypt Password & PIN Hashing**: Passwords and 4-digit transaction authorization PINs are salted and hashed.
- **Input Sanitization & Protection**: SQL Injection protection via SQLite prepared statements; XSS & CORS policy safeguards.
- **Security Audit Stream**: Every transaction, login, and administrative action is logged to an immutable `audit_logs` table.

### 💼 2. Account & Portfolio Management
- **Multi-Account Support**: Manage Checking, Savings (4.5% APY), and Investment accounts.
- **Real-Time Portfolio Analytics**: Visual net worth calculation, spending category breakdown charts (Recharts), and income vs expense trends.
- **Account Control**: Instantly freeze/unfreeze accounts for theft prevention.

### 💸 3. Atomic Fund Transfers
- **Internal & External Transfers**: Instant money transfers between user accounts or external accounts using account numbers.
- **2-Factor Authorization PIN**: Requires mandatory 4-digit PIN verification before executing fund transfers.
- **Transaction Atomicity**: Strict checks for positive amounts, sender balance sufficiency, account active status, and instant rollbacks on failure.

### 📜 4. Filterable Transaction History & Digital Receipts
- **Real-Time History Search**: Instant search by reference ID, description, or category (`Bills`, `Shopping`, `Transfer`, `Salary`).
- **Digital Transaction Receipts**: Printable transaction receipts complete with reference code, timestamp, and status badge.

### 🛡️ 5. Administrative Control Panel (RBAC)
- **Executive Metrics Dashboard**: Real-time tracking of total liquidity, system transfer volume, registered users, and active accounts.
- **User Access Management**: Ability for administrators to review accounts and freeze/unfreeze suspicious users.
- **Security Log Auditor**: Live stream of system access logs and IP addresses.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Custom Vanilla CSS (Glassmorphic Design System), Recharts, Lucide Icons
- **Backend**: Node.js, Express.js REST API
- **Database**: SQLite3 (`online_banking.db`)
- **Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS middleware
- **Reporting**: Python PDF Report Generation (`ReportLab` / PDF builder)

```
Online Banking/
├── backend/                # Express API Server & SQLite DB
│   ├── config/             # Environment & JWT secret configuration
│   ├── controllers/        # Auth, Account, Transfer, Transaction & Admin logic
│   ├── middleware/         # Auth verification, RBAC & Audit loggers
│   ├── models/             # SQLite DB connection, schema & auto-seeder
│   ├── routes/             # Express API router endpoints
│   └── server.js           # Server entry point
├── frontend/               # React + Vite Web Application
│   ├── src/
│   │   ├── components/     # Navbar, AccountCards, TransferModal, ReceiptModal
│   │   ├── context/        # AuthContext for session management
│   │   ├── pages/          # Login, Register, CustomerDashboard, History, Admin
│   │   ├── services/       # API client module
│   │   └── styles/         # Glassmorphic CSS design system
│   └── index.html
├── docs/                   # Documentation Deliverables
│   ├── schema.sql          # Full Database DDL Schema
│   ├── api_documentation.md# REST API Endpoint Documentation
│   ├── generate_pdf.py     # PDF Project Report Generator
│   └── Project_Report.pdf  # Formatted PDF Report
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
node server.js
```
*The server will start on `http://localhost:5000` and auto-initialize the SQLite database with demo accounts.*

### 2. Setup & Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Open your browser at `http://localhost:5173` to access the banking application.*

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Transaction PIN |
| :--- | :--- | :--- | :--- |
| **Customer** | `shanawazh203@gmail.com` | `Password123!` | `1234` |
| **Admin** | `admin@bank.com` | `AdminPass123!` | `1234` |

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
