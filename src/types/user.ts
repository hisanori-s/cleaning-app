/**
 * ユーザー情報を表す型
 * 使用箇所:
 * - src/hooks/use-auth.tsx (認証状態の管理)
 * - src/app.tsx (ユーザーメニューの表示)
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'cleaner';
  assigned_rooms: number[];
} 