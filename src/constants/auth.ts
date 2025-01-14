// キャッシュ関連の定数
export const AUTH_CACHE = {
  KEY: 'auth_user',
  DURATION: 1000 * 60 * 60, // 1時間
} as const;

// API関連の定数
export const AUTH_API = {
  LOGIN_ENDPOINT: '/auth/login',
  LOGOUT_ENDPOINT: '/auth/logout',
} as const;

// 開発環境用の定数
export const AUTH_DEVELOPMENT = {
  MOCK_API_ENDPOINT: '/mock-api-return/auth.json',
} as const; 