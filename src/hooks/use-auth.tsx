import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User } from '../types/index';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// APIエンドポイントの構築
const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;
const API_NAMESPACE = import.meta.env.VITE_WP_API_NAMESPACE;
const AUTH_LOGIN_ENDPOINT = import.meta.env.VITE_WP_API_AUTH_LOGIN;
const MOCK_API_BASE_URL = import.meta.env.VITE_MOCK_API_BASE_URL;
const MOCK_API_AUTH_ENDPOINT = import.meta.env.VITE_MOCK_API_AUTH_ENDPOINT;

const getApiUrl = (endpoint: string) => `${API_BASE_URL}/${API_NAMESPACE}${endpoint}`;
const getMockApiUrl = (endpoint: string) => `${MOCK_API_BASE_URL}${endpoint}`;

// 開発環境の判定
const isDevelopment = import.meta.env.VITE_DEV_MODE === 'true';

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mockUsers, setMockUsers] = useState<any[]>([]);

  // キャッシュからログイン状態を復元
  useEffect(() => {
    const restoreAuth = () => {
      const cached = localStorage.getItem('auth_user');
      if (!cached) return;

      try {
        const { data, timestamp } = JSON.parse(cached);
        const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24時間

        if (Date.now() - timestamp > CACHE_DURATION) {
          localStorage.removeItem('auth_user');
          return;
        }

        setIsAuthenticated(true);
        setUser(data);
        console.log('Restored auth state from cache:', data);
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('auth_user');
      }
    };

    restoreAuth();
  }, []);

  // 開発環境の場合、モックユーザーリストを取得
  useEffect(() => {
    if (isDevelopment) {
      const fetchMockUsers = async () => {
        try {
          const response = await fetch(getMockApiUrl(MOCK_API_AUTH_ENDPOINT));
          const data = await response.json();
          if (data && Array.isArray(data.mock_users)) {
            setMockUsers(data.mock_users);
          }
        } catch (error) {
          console.error('Failed to fetch mock users:', error);
        }
      };
      fetchMockUsers();
    }
  }, []);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      if (isDevelopment) {
        // 開発環境では、取得済みのモックユーザーリストで認証
        const user = mockUsers.find(u => u.login_id === loginId && u.password === password);
        if (user) {
          console.log('Development mode: User authenticated:', user);
          setIsAuthenticated(true);
          setUser(user);
          // 認証成功時にキャッシュを更新
          localStorage.setItem('auth_user', JSON.stringify({ 
            data: user, 
            timestamp: Date.now() 
          }));
          return true;
        }
        console.log('Development mode: Authentication failed');
        return false;
      }

      // 本番環境では、APIを使用
      console.log('Login attempt:', { loginId, password });
      console.log('API URL:', getApiUrl(AUTH_LOGIN_ENDPOINT));

      const response = await fetch(getApiUrl(AUTH_LOGIN_ENDPOINT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login_id: loginId, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Login response:', data);

      if (data.success && data.data) {
        console.log('Login successful:', data.data);
        setIsAuthenticated(true);
        setUser(data.data);
        return true;
      }

      console.log('Login failed:', data.error);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
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