import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px', background: '#0f172a', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700 }}>
            <ShieldCheck size={20} /> Transaction Receipt
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px dashed var(--border-glass)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Transferred</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
            ${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
          </div>
          <span className="status-badge status-active">
            {transaction.status || 'Completed'}
          </span>
        </div>

        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Reference ID:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{transaction.reference_id}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Type / Category:</span>
            <span>{transaction.transaction_type?.toUpperCase()} ({transaction.category})</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Sender Account:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{transaction.sender_account_number || 'External Deposit'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Recipient Account:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{transaction.receiver_account_number || 'External Merchant'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Description:</span>
            <span>{transaction.description}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
            <span style={{ fontSize: '0.82rem' }}>{new Date(transaction.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
