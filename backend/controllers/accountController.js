const { db } = require('../models/db');

function generateAccountNumber() {
  const prefix = '100';
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return prefix + randomDigits;
}

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await db.query('SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC', [req.user.id]);
    const totalBalance = accounts.reduce((acc, a) => acc + (a.status === 'active' ? a.balance : 0), 0);

    return res.json({
      success: true,
      totalBalance,
      accounts
    });
  } catch (err) {
    console.error('GetAccounts error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving accounts.' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { account_type, initial_deposit } = req.body;
    const type = ['savings', 'checking', 'investment'].includes(account_type) ? account_type : 'savings';
    const depositAmount = parseFloat(initial_deposit) > 0 ? parseFloat(initial_deposit) : 100.00;

    const accountNumber = generateAccountNumber();

    const result = await db.runCmd(
      `INSERT INTO accounts (user_id, account_number, account_type, balance, status) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, accountNumber, type, depositAmount, 'active']
    );

    // Initial deposit transaction entry
    const refId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    await db.runCmd(
      `INSERT INTO transactions (reference_id, receiver_account_id, amount, transaction_type, category, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [refId, result.id, depositAmount, 'deposit', 'Initial Deposit', `Opened new ${type} account`, 'completed']
    );

    // Audit log
    await db.runCmd(
      `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
      [req.user.id, 'ACCOUNT_CREATED', `Created new ${type} account ${accountNumber}`]
    );

    const newAccount = await db.getOne('SELECT * FROM accounts WHERE id = ?', [result.id]);

    return res.status(201).json({
      success: true,
      message: `${type.toUpperCase()} account created successfully.`,
      account: newAccount
    });
  } catch (err) {
    console.error('CreateAccount error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create new account.' });
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await db.getOne('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [accountId, req.user.id]);
    
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const transactions = await db.query(
      `SELECT * FROM transactions 
       WHERE sender_account_id = ? OR receiver_account_id = ? 
       ORDER BY created_at DESC LIMIT 50`,
      [accountId, accountId]
    );

    return res.json({
      success: true,
      account,
      transactions
    });
  } catch (err) {
    console.error('GetAccountDetails error:', err);
    return res.status(500).json({ success: false, message: 'Server error loading account details.' });
  }
};

exports.toggleAccountStatus = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await db.getOne('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [accountId, req.user.id]);
    
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const newStatus = account.status === 'active' ? 'frozen' : 'active';
    await db.runCmd('UPDATE accounts SET status = ? WHERE id = ?', [newStatus, accountId]);

    await db.runCmd(
      `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
      [req.user.id, 'ACCOUNT_STATUS_CHANGE', `Account ${account.account_number} status set to ${newStatus}`]
    );

    return res.json({
      success: true,
      message: `Account status updated to ${newStatus}.`,
      status: newStatus
    });
  } catch (err) {
    console.error('ToggleAccountStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update account status.' });
  }
};
