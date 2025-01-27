/**
 * ユーザー情報を表す型
 * 使用箇所:
 * - src/hooks/use-auth.tsx (認証状態の管理)
 * - src/app.tsx (ユーザーメニューの表示)
 */
export interface User {
  /** ユーザーID */
  user_id: number;
  /** ログインID */
  login_id: string;
  /** パスワード */
  password: string;
  /** 担当物件ID配列 */
  house_ids: number[];
  /** 表示名 */
  name: string;
} 