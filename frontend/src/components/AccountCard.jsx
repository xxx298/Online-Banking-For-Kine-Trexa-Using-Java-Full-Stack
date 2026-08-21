import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Lock, Unlock } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function AccountCard({ account, onStatusToggle }) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatAccountNum = (num) => {
    if (!num) return '**** ****';
    return num.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(account.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      await apiRequest(`/accounts/${account.id}/toggle-status`, 'PATCH');
      if (onStatusToggle) onStatusToggle();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`account-card ${account.account_type}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
          {account.account_type} ACCOUNT
        </span>
        <span className={`status-badge ${account.status === 'active' ? 'status-active' : 'status-frozen'}`}>
          {account.status}
        </span>
      </div>

      <div className="account-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{formatAccountNum(account.account_number)}</span>
        <button 
          onClick={handleCopy} 
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)' }}
          title="Copy Account Number"
        >
          {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
        </button>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Balance</span>
          <button 
            onClick={() => setShowBalance(!showBalance)} 
            style={{ background: 'transparent', color: 'var(--text-muted)' }}
          >
            {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <div className="balance-text">
          {showBalance ? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '8px' }}>
        <button 
          className={`btn ${account.status === 'active' ? 'btn-secondary' : 'btn-primary'}`} 
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          onClick={handleToggleStatus}
          disabled={loading}
        >
          {account.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
          {account.status === 'active' ? 'Freeze' : 'Unfreeze'}
        </button>
      </div>
    </div>
  );
}
