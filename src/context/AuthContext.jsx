import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('talenttrade_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('talenttrade_token');
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn('Failed to load authenticated user profile:', err);
          localStorage.removeItem('talenttrade_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('talenttrade_token', data.token);
    setToken(data.token);
    const me = await api.getMe();
    setUser(me);
    return me;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('talenttrade_token', data.token);
    setToken(data.token);
    const me = await api.getMe();
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('talenttrade_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const quickSwitch = async (accountKey) => {
    const credentials = {
      admin: { email: 'admin@talenttrade.com', password: 'password123' },
      client: { email: 'sarah.client@talenttrade.com', password: 'password123' },
      alex: { email: 'alex.dev@talenttrade.com', password: 'password123' },
      elena: { email: 'elena.design@talenttrade.com', password: 'password123' },
      marcus: { email: 'marcus.ai@talenttrade.com', password: 'password123' },
      sophia: { email: 'sophia.copy@talenttrade.com', password: 'password123' },
    };

    const target = credentials[accountKey];
    if (target) {
      return await login(target.email, target.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        quickSwitch,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ROLE_ADMIN',
        isFreelancer: user?.role === 'ROLE_FREELANCER',
        isClient: user?.role === 'ROLE_CLIENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
