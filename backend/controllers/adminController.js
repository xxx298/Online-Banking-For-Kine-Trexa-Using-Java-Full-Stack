const { db } = require('../models/db');

exports.getAnalytics = async (req, res) => {
  try {
    const userCount = await db.getOne('SELECT COUNT(*) as count FROM users');
    const accountCount = await db.getOne('SELECT COUNT(*) as count FROM accounts');
    const totalBalance = await db.getOne('SELECT SUM(balance) as total FROM accounts');
    const totalTxVolume = await db.getOne('SELECT SUM(amount) as total FROM transactions WHERE status = "completed"');
    const totalTxCount = await db.getOne('SELECT COUNT(*) as count FROM transactions');

    const recentAuditLogs = await db.query(
      `SELECT a.*, u.email as user_email, u.full_name 
       FROM audit_logs a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC LIMIT 20`
    );

    return res.json({
      success: true,
      stats: {
        totalUsers: userCount.count || 0,
        totalAccounts: accountCount.count || 0,
        totalLiquidity: totalBalance.total || 0,
        totalTransferVolume: totalTxVolume.total || 0,
        totalTransactions: totalTxCount.count || 0
      },
      auditLogs: recentAuditLogs
    });
  } catch (err) {
    console.error('AdminAnalytics error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin analytics.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query(`
      SELECT u.id, u.full_name, u.email, u.role, u.status, u.created_at,
             COUNT(a.id) as account_count,
             COALESCE(SUM(a.balance), 0) as total_user_balance
      FROM users u
      LEFT JOIN accounts a ON u.id = a.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error('GetAllUsers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users list.' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'frozen', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    await db.runCmd('UPDATE users SET status = ? WHERE id = ?', [status, userId]);

    await db.runCmd(
      `INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`,
      [req.user.id, 'ADMIN_USER_STATUS_CHANGE', `Admin changed user ID ${userId} status to ${status}`]
    );

    return res.json({
      success: true,
      message: `User status changed to ${status}.`
    });
  } catch (err) {
    console.error('UpdateUserStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};
