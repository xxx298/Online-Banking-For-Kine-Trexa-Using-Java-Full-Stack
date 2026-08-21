import React, { useState } from 'react';
import { X, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function TransferModal({ isOpen, onClose, userAccounts, onSuccess }) {
  const [step, setStep] = useState(1);
  const [senderAccId, setSenderAccId] = useState(userAccounts[0]?.id || '');
  const [recipientAccNum, setRecipientAccNum] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Transfer');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

  if (!isOpen) return null;

  const handleNextStep = (e) => {
    e.preventDefault();
    setError(null);

    if (!senderAccId) {
      setError('Please select a valid sender account.');
      return;
    }
    if (!recipientAccNum.trim()) {
      setError('Please enter a recipient account number.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive transfer amount.');
      return;
    }

    setStep(2);
  };

  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiRequest('/transfers', 'POST', {
        sender_account_id: senderAccId,
        recipient_account_number: recipientAccNum.trim(),
        amount: parseFloat(amount),
        category,
        description,
        transaction_pin: pin
      });

      if (data.success) {
        setTransferResult(data.transaction);
        setStep(3);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Transfer failed. Check credentials and available balance.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRecipientAccNum('');
    setAmount('');
    setDescription('');
    setPin('1234');
    setError(null);
    setTransferResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {step === 3 ? 'Transfer Successful' : 'Fund Transfer'}
          </h3>
          <button onClick={resetForm} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <div className="form-group">
              <label className="form-label">From Account</label>
              <select 
                className="form-select"
                value={senderAccId}
                onChange={(e) => setSenderAccId(e.target.value)}
              >
                {userAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_type.toUpperCase()} ({acc.account_number}) - ${acc.balance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Account Number</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. 200540881920"
                value={recipientAccNum}
                onChange={(e) => setRecipientAccNum(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Transfer">Transfer</option>
                  <option value="Savings">Savings</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Memo</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Optional note"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                Review Transfer <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleExecuteTransfer}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Transfer Amount:</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Recipient Account:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{recipientAccNum}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Category:</span>
                <span>{category}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} color="#3b82f6" /> Enter 4-Digit Security PIN
              </label>
              <input 
                type="password" 
                maxLength="4"
                className="form-input"
                placeholder="1234"
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Demo PIN is <strong>1234</strong>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={loading}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Authorizing...' : 'Authorize Transfer'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && transferResult && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Transfer Completed!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Ref ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{transferResult.reference_id}</strong>
            </p>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={resetForm}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
