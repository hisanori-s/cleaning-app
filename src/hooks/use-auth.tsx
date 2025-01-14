import { createContext, useContext, ReactNode, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;  // 開発用に簡略化
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// 開発用の固定値
const devUser: User = {
  id: 1,
  username: 'dev-user',
  email: 'dev@example.com',
  role: 'cleaner',
  assignedRooms: [1, 2, 3],
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setIsAuthenticated(true);
    setUser(devUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const auth = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 