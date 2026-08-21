import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import TransferModal from './components/TransferModal';
import ReceiptModal from './components/ReceiptModal';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import TransactionHistory from './pages/TransactionHistory';
import AccountsPage from './pages/AccountsPage';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';

function MainApp() {
  const { user, loading, refreshUser } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'history' | 'accounts' | 'admin'
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [receiptModalTx, setReceiptModalTx] = useState(null);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>🏦 AuraBank Security System</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verifying session encryption...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenTransferModal={() => setIsTransferModalOpen(true)} 
      />

      <main className="content-wrapper">
        {activeTab === 'dashboard' && (
          <CustomerDashboard 
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onOpenReceiptModal={(tx) => setReceiptModalTx(tx)}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory 
            onOpenReceiptModal={(tx) => setReceiptModalTx(tx)}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsPage />
        )}

        {activeTab === 'admin' && user.role === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        userAccounts={user.accounts || []}
        onSuccess={refreshUser}
      />

      <ReceiptModal 
        isOpen={!!receiptModalTx}
        onClose={() => setReceiptModalTx(null)}
        transaction={receiptModalTx}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
