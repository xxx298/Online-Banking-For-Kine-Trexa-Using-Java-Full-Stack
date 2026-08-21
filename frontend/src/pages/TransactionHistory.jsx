import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Search, Filter, FileText, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export default function TransactionHistory({ onOpenReceiptModal }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [category, type]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let query = `/transactions?category=${category}&type=${type}`;
      if (search.trim()) {
        query += `&search=${encodeURIComponent(search.trim())}`;
      }
      const data = await apiRequest(query);
      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Transaction History & Audit</h2>
        
        {/* Filters and Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search reference, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Transfer">Transfer</option>
              <option value="Savings">Savings</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Salary">Salary</option>
            </select>
          </div>

          <div>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={fetchTransactions}>
              <RefreshCw size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Sender / Recipient</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {tx.reference_id}
                    </td>
                    <td style={{ fontSize: '0.84rem' }}>
                      {tx.sender_account_number ? (
                        <div>From: <span style={{ fontFamily: 'var(--font-mono)' }}>{tx.sender_account_number}</span></div>
                      ) : null}
                      {tx.receiver_account_number ? (
                        <div>To: <span style={{ fontFamily: 'var(--font-mono)' }}>{tx.receiver_account_number}</span></div>
                      ) : null}
                    </td>
                    <td>
                      <span style={{ 
                        color: tx.transaction_type === 'deposit' ? '#34d399' : '#f87171',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.82rem'
                      }}>
                        {tx.transaction_type === 'deposit' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        {tx.transaction_type.toUpperCase()}
                      </span>
                    </td>
                    <td>{tx.category}</td>
                    <td>{tx.description}</td>
                    <td style={{ fontWeight: 800, color: tx.transaction_type === 'deposit' ? '#34d399' : '#fff' }}>
                      {tx.transaction_type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.created_at).toLocaleString()}
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
