const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../models/db');
const { JWT_SECRET } = require('../middleware/auth');

function generateAccountNumber() {
  const prefix = '100';
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return prefix + randomDigits;
}

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, transaction_pin, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existing = await db.getOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const pinToHash = transaction_pin || '1234';
    const pinHash = await bcrypt.hash(pinToHash, 10);

    const userRole = role === 'admin' ? 'admin' : 'customer';

    const userResult = await db.runCmd(
      `INSERT INTO users (full_name, email, password_hash, transaction_pin, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name.trim(), email.toLowerCase().trim(), passwordHash, pinHash, userRole, 'active']
    );

    const userId = userResult.id;

    // Automatically create a checking account with $1,000 welcome bonus for demonstration
    const accountNumber = generateAccountNumber();
    await db.runCmd(
      `INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)`,
      [userId, accountNumber, 'checking', 1000.00]
    );

    // Audit log
    await db.runCmd(
      `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
      [userId, 'USER_REGISTERED', `User registered with email ${email}`]
    );

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), full_name: full_name.trim(), role: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome bonus of $1,000 credited to your new checking account.',
      token,
      user: { id: userId, full_name, email, role: userRole }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await db.getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: `Your account status is ${user.status}. Please contact support.` });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Audit log
    await db.runCmd(
      `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
      [user.id, 'USER_LOGIN', `User logged in from ${req.ip || '127.0.0.1'}`]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.getOne('SELECT id, full_name, email, role, status, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const accounts = await db.query('SELECT * FROM accounts WHERE user_id = ? ORDER BY id ASC', [req.user.id]);
    
    return res.json({
      success: true,
      user: {
        ...user,
        accounts
      }
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving user info.' });
  }
};
