-- ============================================================
-- SECURE ONLINE BANKING SYSTEM - DATABASE SCHEMA (DDL)
-- Database Engine: SQLite / PostgreSQL / MySQL Compatible
-- Version: 1.0.0
-- ============================================================

PRAGMA foreign_keys = ON;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  transaction_pin TEXT NOT NULL DEFAULT '1234',
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'frozen', 'suspended')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'checking' CHECK(account_type IN ('checking', 'savings', 'investment')),
  balance REAL NOT NULL DEFAULT 0.0 CHECK(balance >= 0.0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'frozen')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON accounts(account_number);

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_id TEXT UNIQUE NOT NULL,
  sender_account_id INTEGER,
  receiver_account_id INTEGER,
  amount REAL NOT NULL CHECK(amount > 0),
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('transfer', 'deposit', 'withdrawal')),
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('completed', 'pending', 'failed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_account_id) REFERENCES accounts(id),
  FOREIGN KEY (receiver_account_id) REFERENCES accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_ref ON transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_account_id);

-- 4. BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS beneficiaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  beneficiary_account_number TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  nickname TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  ip_address TEXT DEFAULT '127.0.0.1',
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
