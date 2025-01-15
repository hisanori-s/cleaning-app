import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import type { MockUser, MockAuthResponse } from '@/__tests__/mocks/types';
import mockAuthData from '../mocks/api/auth.json';

// モックストレージの実装
const mockStorage: { [key: string]: string } = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }
};

// グローバルオブジェクトのモック
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// fetchのモック
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockAuthData)
  })
);

// テスト用のラッパーコンポーネント
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  // テストユーザーの定義（auth.jsonから取得）
  const TEST_USER = (mockAuthData as MockAuthResponse).mock_users[0];

  // 各テストの前にストレージをクリア
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  // 初期状態のテスト
  it('初期状態では未認証であること', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  // ログイン成功のテスト
  it('正しいログイン情報で認証に成功すること', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // モックユーザーデータの取得を待機
    await new Promise(resolve => setTimeout(resolve, 100));

    // ログイン処理の実行
    await act(async () => {
      const success = await result.current.login(TEST_USER.login_id, TEST_USER.password);
      expect(success).toBe(true);
    });

    // 認証状態の検証
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    if (result.current.user) {
      expect(result.current.user.username).toBe(TEST_USER.username);
    }
  });

  // ログアウトのテスト
  it('ログアウト時に認証状態がクリアされること', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // モックユーザーデータの取得を待機
    await new Promise(resolve => setTimeout(resolve, 100));

    // 事前にログイン
    await act(async () => {
      await result.current.login(TEST_USER.login_id, TEST_USER.password);
    });

    // ログアウトの実行
    act(() => {
      result.current.logout();
    });

    // ログアウト後の状態を検証
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    // ローカルストレージのクリアを確認
    expect(mockLocalStorage.getItem('auth')).toBeNull();
  });

  // 不正なログイン情報のテスト
  it('不正なログイン情報では認証に失敗すること', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // モックユーザーデータの取得を待機
    await new Promise(resolve => setTimeout(resolve, 100));

    // 不正なログイン情報でログイン試行
    await act(async () => {
      const success = await result.current.login('invalid_user', 'wrong_password');
      expect(success).toBe(false);
    });

    // 認証状態が変わっていないことを確認
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
}); 