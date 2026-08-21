import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px', width: '52px', height: '52px' }}>
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Access your secure AuraBank online account
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '42px' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
            ⚡ Quick Demo Auto-Fill:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '8px 10px' }}
              onClick={() => handleQuickDemo('john@bank.com', 'Password123!')}
            >
              <UserCheck size={14} color="#10b981" /> Customer Demo
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '8px 10px' }}
              onClick={() => handleQuickDemo('admin@bank.com', 'AdminPass123!')}
            >
              <UserCheck size={14} color="#f59e0b" /> Admin Demo
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister} 
            style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700 }}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
