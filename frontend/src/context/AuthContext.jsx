import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aura_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    if (data.success) {
      localStorage.setItem('aura_token', data.token);
      setToken(data.token);
      setUser(data.user);
      await fetchUser();
    }
    return data;
  };

  const register = async (userData) => {
    const data = await apiRequest('/auth/register', 'POST', userData);
    if (data.success) {
      localStorage.setItem('aura_token', data.token);
      setToken(data.token);
      setUser(data.user);
      await fetchUser();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
