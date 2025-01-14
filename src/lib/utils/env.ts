/**
 * 環境変数アクセスユーティリティ
 * 開発環境（Vite）とテスト環境（Jest）の両方で動作する環境変数アクセスを提供します
 */

/**
 * 環境変数の値を取得します
 * @param key - 環境変数のキー
 * @returns 環境変数の値
 * @throws 環境変数が未定義の場合にエラーを投げます
 */
export const getEnvVar = (key: string): string => {
  // テスト環境（Jest）での環境変数アクセス
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // Vite環境での環境変数アクセス
  // @ts-ignore - import.meta.envはVite特有の型定義
  if (import.meta?.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  
  throw new Error(`Environment variable ${key} is not defined`);
};

/**
 * 開発モードかどうかを判定します
 * @returns 開発モードの場合true
 */
export const isDevelopment = (): boolean => {
  return getEnvVar('VITE_DEV_MODE') === 'true';
}; 