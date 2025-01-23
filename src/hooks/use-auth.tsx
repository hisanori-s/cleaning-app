/**
 * 認証関連の状態管理と機能を提供するカスタムフック
 * 
 * 重要: このフックはユーザー情報の配列を取得し、
 * フロントエンド側で認証の照合を行います。
 * APIにユーザー名とパスワードを送信する仕様ではありません。
 */

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User } from '../types/index';
import { AUTH_CACHE } from '../constants/auth';
import { getUsers } from '../api/wordpress';

/**
 * 認証コンテキストの型定義
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証情報のキャッシュ取得
 */
const getAuthCache = () => {
  const cached = localStorage.getItem(AUTH_CACHE.KEY);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > AUTH_CACHE.DURATION) {
      localStorage.removeItem(AUTH_CACHE.KEY);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Failed to parse auth cache:', error);
    localStorage.removeItem(AUTH_CACHE.KEY);
    return null;
  }
};

/**
 * 認証情報のキャッシュ保存
 */
const setAuthCache = (user: User) => {
  localStorage.setItem(
    AUTH_CACHE.KEY,
    JSON.stringify({
      data: user,
      timestamp: Date.now(),
    })
  );
};

/**
 * 認証情報のキャッシュクリア
 */
const clearAuthCache = () => {
  localStorage.removeItem(AUTH_CACHE.KEY);
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);

  // キャッシュからログイン状態を復元
  useEffect(() => {
    const cachedUser = getAuthCache();
    if (cachedUser) {
      setIsAuthenticated(true);
      setUser(cachedUser);
      // ログのコメントアウト：console.log('Restored auth state from cache:', cachedUser);
    }
  }, []);

  // ユーザーリストの取得（ログイン時のみ実行）
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.success && response.data) {
        setUserList(response.data);
        // ログのコメントアウト：console.log('User list fetched successfully');
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  };

  /**
   * ログイン処理
   * 取得済みのユーザーリストと照合して認証を行う
   */
  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      // ログのコメントアウト：console.log('Login attempt with:', { loginId });
      
      // ログイン時にユーザーリストを取得
      const users = await fetchUsers();
      
      const user = users.find(u => {
        const matches = u.login_id === loginId && u.password === password;
        return matches;
      });

      if (user) {
        // ログのコメントアウト：console.log('Login successful');
        setIsAuthenticated(true);
        setUser(user);
        setAuthCache(user);
        return true;
      }

      // ログのコメントアウト：console.log('Login failed: User not found or invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * ログアウト処理
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserList([]);  // ユーザーリストもクリア
    clearAuthCache();
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