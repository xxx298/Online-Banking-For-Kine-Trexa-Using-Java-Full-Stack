import React, { useState, useEffect } from 'react';
import AccountCard from '../components/AccountCard';
import { apiRequest } from '../services/api';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, PlusCircle, ArrowRightLeft, FileText, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';

export default function CustomerDashboard({ onOpenTransferModal, onOpenReceiptModal, onSwitchTab }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const accData = await apiRequest('/accounts');
      if (accData.success) {
        setAccounts(accData.accounts || []);
        setTotalBalance(accData.totalBalance || 0);
      }

      const txData = await apiRequest('/transactions?limit=10');
      if (txData.success) {
        setTransactions(txData.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Category breakdown for chart
  const categoryData = [
    { name: 'Savings', value: 400, color: '#3b82f6' },
    { name: 'Shopping', value: 300, color: '#8b5cf6' },
    { name: 'Bills', value: 200, color: '#f59e0b' },
    { name: 'Transfer', value: 150, color: '#10b981' }
  ];

  // Monthly trend data
  const trendData = [
    { month: 'Apr', income: 3200, expense: 1800 },
    { month: 'May', income: 3400, expense: 2100 },
    { month: 'Jun', income: 3100, expense: 1950 },
    { month: 'Jul', income: 3800, expense: 2400 },
    { month: 'Aug', income: 4200, expense: 2200 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Portfolio Overview */}
      <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Portfolio Net Worth
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: '4px 0 8px' }}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.88rem', fontWeight: 700 }}>
              <TrendingUp size={16} /> +4.2% Growth from last month
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={onOpenTransferModal}>
              <ArrowRightLeft size={18} /> Quick Transfer
            </button>
            <button className="btn btn-secondary" onClick={() => onSwitchTab('accounts')}>
              <PlusCircle size={18} /> Open New Account
            </button>
          </div>
        </div>
      </div>

      {/* Account Cards Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Bank Accounts</h2>
          <button 
            onClick={() => onSwitchTab('accounts')} 
            style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Manage Accounts <ChevronRight size={16} />
          </button>
        </div>

        <div className="card-grid">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} onStatusToggle={loadDashboardData} />
          ))}
        </div>
      </div>

      {/* Financial Analytics & Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Monthly Income vs Expenses</h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Spending by Category</h3>
          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '40%', fontSize: '0.82rem' }}>
              {categoryData.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
                  <span style={{ color: 'var(--text-muted)' }}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
          <button 
            onClick={() => onSwitchTab('history')} 
            style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem' }}
          >
            View All Transactions
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No recent transactions recorded.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {tx.reference_id}
                    </td>
                    <td>
                      <span style={{ 
                        color: tx.transaction_type === 'deposit' ? '#34d399' : '#f87171',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {tx.transaction_type === 'deposit' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        {tx.transaction_type.toUpperCase()}
                      </span>
                    </td>
                    <td>{tx.category}</td>
                    <td>{tx.description}</td>
                    <td style={{ 
                      fontWeight: 800, 
                      color: tx.transaction_type === 'deposit' ? '#34d399' : '#fff' 
                    }}>
                      {tx.transaction_type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => onOpenReceiptModal(tx)}
                      >
                        <FileText size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
