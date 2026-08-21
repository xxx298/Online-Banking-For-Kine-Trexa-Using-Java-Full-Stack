import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LayoutDashboard, ArrowRightLeft, History, CreditCard, Shield, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenTransferModal }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="brand-logo">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>
        <span>Aura<span style={{ color: '#3b82f6' }}>Bank</span></span>
      </div>

      <nav className="nav-links">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button 
          className="nav-item"
          onClick={onOpenTransferModal}
        >
          <ArrowRightLeft size={18} />
          <span>Transfer Funds</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} />
          <span>Transactions</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          <CreditCard size={18} />
          <span>My Accounts</span>
        </button>

        {user && user.role === 'admin' && (
          <button 
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ color: '#f59e0b' }}
          >
            <Shield size={18} />
            <span>Admin Portal</span>
          </button>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="user-badge">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user?.full_name}</span>
            <span className={`role-tag ${user?.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={logout} title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
