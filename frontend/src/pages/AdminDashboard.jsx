import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Shield, Users, DollarSign, Activity, Lock, Unlock, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const analyticsData = await apiRequest('/admin/analytics');
      if (analyticsData.success) {
        setStats(analyticsData.stats || {});
        setAuditLogs(analyticsData.auditLogs || []);
      }

      const usersData = await apiRequest('/admin/users');
      if (usersData.success) {
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'frozen' : 'active';
    try {
      await apiRequest(`/admin/users/${userId}/status`, 'PATCH', { status: nextStatus });
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', borderLeft: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={28} color="#f59e0b" />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>System Administration & Risk Center</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Monitor banking system health, control user privileges, and inspect audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>TOTAL REGISTERED USERS</span>
            <Users size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalUsers || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>TOTAL SYSTEM LIQUIDITY</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
            ${(stats.totalLiquidity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>TRANSFER VOLUME</span>
            <Activity size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            ${(stats.totalTransferVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>TOTAL ACCOUNTS</span>
            <Shield size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalAccounts || 0}</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>User & Account Access Control</h3>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active Accounts</th>
                <th>Total Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700 }}>{u.full_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <span className={`role-tag ${u.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.account_count} accounts</td>
                  <td style={{ fontWeight: 800 }}>${u.total_user_balance.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${u.status === 'active' ? 'status-active' : 'status-frozen'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <button 
                        className={`btn ${u.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                      >
                        {u.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                        {u.status === 'active' ? 'Freeze User' : 'Activate User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Stream */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Security Audit Stream</h3>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User Email</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.user_email || 'System'}</td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {log.ip_address}
                  </td>
                  <td style={{ fontSize: '0.88rem' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
