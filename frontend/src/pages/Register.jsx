import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('1234');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('Transaction PIN must be exactly 4 digits.');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        password,
        transaction_pin: pin,
        role
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px', width: '52px', height: '52px' }}>
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Open your secure digital bank account with $1,000 welcome credit
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '42px' }}
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '42px' }}
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">4-Digit Security PIN</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  maxLength="4"
                  className="form-input"
                  style={{ paddingLeft: '42px', letterSpacing: '4px', fontFamily: 'var(--font-mono)' }}
                  placeholder="1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
                <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select 
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin} 
            style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
