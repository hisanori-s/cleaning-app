/**
 * 認証関連の状態管理と機能を提供するカスタムフック
 */

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User } from '../types/index';
import { AUTH_CACHE, AUTH_API } from '../constants/auth';
import { login as apiLogin } from '../api/wordpress';

/**
 * 認証コンテキストの型定義
 * isAuthenticated: 認証状態
 * user: ログインユーザー情報
 * login: ログイン処理
 * logout: ログアウト処理
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 認証プロバイダーのProps型定義
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * APIエンドポイントの設定
 * 環境変数から各種エンドポイントを取得
 */
const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;
const API_NAMESPACE = import.meta.env.VITE_WP_API_NAMESPACE;
const AUTH_LOGIN_ENDPOINT = import.meta.env.VITE_WP_API_AUTH_LOGIN;
const MOCK_API_BASE_URL = import.meta.env.VITE_MOCK_API_BASE_URL;
const MOCK_API_AUTH_ENDPOINT = import.meta.env.VITE_MOCK_API_AUTH_ENDPOINT;

/**
 * APIエンドポイントのURL生成
 */
const getApiUrl = (endpoint: string) => `${API_BASE_URL}/${API_NAMESPACE}${endpoint}`;
const getMockApiUrl = (endpoint: string) => `${MOCK_API_BASE_URL}${endpoint}`;

/**
 * 認証情報のキャッシュ取得
 * キャッシュの有効期限をチェックし、期限切れの場合は削除
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

// 開発環境の判定
const isDevelopment = import.meta.env.VITE_DEV_MODE === 'true';

/**
 * 認証プロバイダーコンポーネント
 * 認証状態の管理と認証関連の機能を提供
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mockUsers, setMockUsers] = useState<any[]>([]);

  // キャッシュからログイン状態を復元
  useEffect(() => {
    const cachedUser = getAuthCache();
    if (cachedUser) {
      setIsAuthenticated(true);
      setUser(cachedUser);
      console.log('Restored auth state from cache:', cachedUser);
    }
  }, []);

  /**
   * ログイン処理
   * 開発環境の場合はモックユーザーを使用
   * 本番環境の場合は実際のAPIを使用
   */
  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin({ username: loginId, password });
      
      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        setAuthCache(response.data);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * ログアウト処理
   * 認証状態をクリアしキャッシュを削除
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
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

/**
 * 認証フックの使用
 * AuthProviderのコンテキスト外で使用するとエラー
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 