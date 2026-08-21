import React, { useState, useEffect } from 'react';
import AccountCard from '../components/AccountCard';
import { apiRequest } from '../services/api';
import { PlusCircle, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState('savings');
  const [initialDeposit, setInitialDeposit] = useState('500');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await apiRequest('/accounts');
      if (data.success) {
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const data = await apiRequest('/accounts', 'POST', {
        account_type: accountType,
        initial_deposit: parseFloat(initialDeposit)
      });

      if (data.success) {
        setSuccessMsg(data.message);
        fetchAccounts();
      }
    } catch (err) {
      setError(err.message || 'Failed to open account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Bank Accounts Portfolio</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your checking, savings, and investment accounts or open a new account instantaneously.
        </p>
      </div>

      {/* Account Creation Card */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sparkles size={20} color="#3b82f6" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Open a New Digital Account</h3>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleCreateAccount} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Account Type</label>
            <select className="form-select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="savings">Savings Account (4.5% APY)</option>
              <option value="checking">Checking Account (Daily Banking)</option>
              <option value="investment">Investment Portfolio Account</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Initial Deposit ($)</label>
            <input 
              type="number" 
              className="form-input"
              min="50"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <PlusCircle size={18} /> {loading ? 'Creating...' : 'Open Account Now'}
          </button>
        </form>
      </div>

      {/* Existing Accounts List */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Active Accounts ({accounts.length})</h3>
        <div className="card-grid">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} onStatusToggle={fetchAccounts} />
          ))}
        </div>
      </div>
    </div>
  );
}
