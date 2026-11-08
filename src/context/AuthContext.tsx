import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api, getStoredToken, setStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  canPublishInstantly: boolean;
  canEditArticle: (articleAuthorId: string) => boolean;
  canDeleteArticle: (articleAuthorId: string) => boolean;
  quickSwitchUser: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const res = await api.login({ username, password });
    setStoredToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
  };

  const quickSwitchUser = async (username: string, password: string) => {
    await login(username, password);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Every logged in role (Admin, Editor, Guru) has instant publishing capability without approval!
  const canPublishInstantly = Boolean(user && (user.role === 'admin' || user.role === 'editor' || user.role === 'guru'));

  const canEditArticle = (articleAuthorId: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'editor') return true;
    if (user.role === 'guru' && user.id === articleAuthorId) return true;
    return false;
  };

  const canDeleteArticle = (articleAuthorId: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'editor') return true;
    if (user.role === 'guru' && user.id === articleAuthorId) return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasRole,
        canPublishInstantly,
        canEditArticle,
        canDeleteArticle,
        quickSwitchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
