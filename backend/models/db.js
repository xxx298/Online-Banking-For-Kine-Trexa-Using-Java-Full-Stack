const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../online_banking.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper for promise-based queries
db.query = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.getOne = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.runCmd = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

async function initDB() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      // Enable Foreign Keys
      db.run('PRAGMA foreign_keys = ON;');

      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          transaction_pin TEXT NOT NULL DEFAULT '1234',
          role TEXT NOT NULL DEFAULT 'customer',
          status TEXT NOT NULL DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Accounts table
      db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          account_number TEXT UNIQUE NOT NULL,
          account_type TEXT NOT NULL DEFAULT 'checking',
          balance REAL NOT NULL DEFAULT 0.0,
          currency TEXT NOT NULL DEFAULT 'USD',
          status TEXT NOT NULL DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reference_id TEXT UNIQUE NOT NULL,
          sender_account_id INTEGER,
          receiver_account_id INTEGER,
          amount REAL NOT NULL,
          transaction_type TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'General',
          description TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sender_account_id) REFERENCES accounts(id),
          FOREIGN KEY (receiver_account_id) REFERENCES accounts(id)
        );
      `);

      // Beneficiaries table
      db.run(`
        CREATE TABLE IF NOT EXISTS beneficiaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          beneficiary_account_number TEXT NOT NULL,
          beneficiary_name TEXT NOT NULL,
          nickname TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Audit Logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          ip_address TEXT DEFAULT '127.0.0.1',
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed data if empty
      try {
        const userCount = await db.getOne('SELECT COUNT(*) as count FROM users');
        if (userCount.count === 0) {
          console.log('Seeding initial database data...');

          const customerPassword = await bcrypt.hash('Password123!', 10);
          const adminPassword = await bcrypt.hash('AdminPass123!', 10);
          const pinHash = await bcrypt.hash('1234', 10);

          // Insert Users
          const johnRes = await db.runCmd(
            `INSERT INTO users (full_name, email, password_hash, transaction_pin, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Shanawaz', 'shanawazh203@gmail.com', customerPassword, pinHash, 'customer', 'active']
          );

          const sarahRes = await db.runCmd(
            `INSERT INTO users (full_name, email, password_hash, transaction_pin, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Sarah Connor', 'sarah@bank.com', customerPassword, pinHash, 'customer', 'active']
          );

          const adminRes = await db.runCmd(
            `INSERT INTO users (full_name, email, password_hash, transaction_pin, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
            ['Shanawaz Admin', 'admin@bank.com', adminPassword, pinHash, 'admin', 'active']
          );

          // Insert Accounts
          const johnChecking = await db.runCmd(
            `INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)`,
            [johnRes.id, '100120349812', 'checking', 8450.75]
          );

          const johnSavings = await db.runCmd(
            `INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)`,
            [johnRes.id, '100120349899', 'savings', 24150.00]
          );

          const sarahChecking = await db.runCmd(
            `INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)`,
            [sarahRes.id, '200540881920', 'checking', 5120.40]
          );

          // Insert Beneficiaries
          await db.runCmd(
            `INSERT INTO beneficiaries (user_id, beneficiary_account_number, beneficiary_name, nickname) VALUES (?, ?, ?, ?)`,
            [johnRes.id, '200540881920', 'Sarah Connor', 'Sarah Tech']
          );

          // Seed Transactions
          const txs = [
            { ref: 'TXN-892104', send: null, recv: johnChecking.id, amt: 3500.00, type: 'deposit', cat: 'Salary', desc: 'Monthly Salary Credit - Tech Corp' },
            { ref: 'TXN-892105', send: johnChecking.id, recv: sarahChecking.id, amt: 250.00, type: 'transfer', cat: 'Transfer', desc: 'Lunch reimbursement to Sarah' },
            { ref: 'TXN-892106', send: johnChecking.id, recv: null, amt: 85.50, type: 'withdrawal', cat: 'Shopping', desc: 'Online Electronics Store' },
            { ref: 'TXN-892107', send: johnChecking.id, recv: johnSavings.id, amt: 1000.00, type: 'transfer', cat: 'Savings', desc: 'Auto Savings Transfer' },
            { ref: 'TXN-892108', send: johnChecking.id, recv: null, amt: 120.00, type: 'withdrawal', cat: 'Bills', desc: 'Fiber Internet Monthly Bill' }
          ];

          for (const tx of txs) {
            await db.runCmd(
              `INSERT INTO transactions (reference_id, sender_account_id, receiver_account_id, amount, transaction_type, category, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [tx.ref, tx.send, tx.recv, tx.amt, tx.type, tx.cat, tx.desc, 'completed']
            );
          }

          // Seed Audit Log
          await db.runCmd(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
            [johnRes.id, 'USER_LOGIN', 'Successful customer login from 127.0.0.1']
          );
          await db.runCmd(
            `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
            [johnRes.id, 'FUND_TRANSFER', 'Transferred $250.00 to Account 200540881920']
          );

          console.log('Database seeded successfully.');
        }
        resolve();
      } catch (err) {
        console.error('Error during DB init/seeding:', err);
        reject(err);
      }
    });
  });
}

module.exports = { db, initDB };
