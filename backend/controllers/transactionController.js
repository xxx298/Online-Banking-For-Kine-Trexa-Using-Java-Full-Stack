const { db } = require('../models/db');

exports.getTransactions = async (req, res) => {
  try {
    const { search, category, type, startDate, endDate, limit = 50, offset = 0 } = req.query;

    // Get all user account IDs
    const userAccounts = await db.query('SELECT id, account_number FROM accounts WHERE user_id = ?', [req.user.id]);
    const accountIds = userAccounts.map(a => a.id);

    if (accountIds.length === 0) {
      return res.json({ success: true, transactions: [], total: 0 });
    }

    const placeholders = accountIds.map(() => '?').join(',');
    let sql = `
      SELECT t.*, 
             sa.account_number as sender_account_number, 
             ra.account_number as receiver_account_number,
             su.full_name as sender_name,
             ru.full_name as receiver_name
      FROM transactions t
      LEFT JOIN accounts sa ON t.sender_account_id = sa.id
      LEFT JOIN accounts ra ON t.receiver_account_id = ra.id
      LEFT JOIN users su ON sa.user_id = su.id
      LEFT JOIN users ru ON ra.user_id = ru.id
      WHERE (t.sender_account_id IN (${placeholders}) OR t.receiver_account_id IN (${placeholders}))
    `;

    const params = [...accountIds, ...accountIds];

    if (search) {
      sql += ` AND (t.reference_id LIKE ? OR t.description LIKE ? OR t.category LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (category && category !== 'All') {
      sql += ` AND t.category = ?`;
      params.push(category);
    }

    if (type && type !== 'All') {
      sql += ` AND t.transaction_type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const transactions = await db.query(sql, params);

    return res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (err) {
    console.error('GetTransactions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch transaction history.' });
  }
};
