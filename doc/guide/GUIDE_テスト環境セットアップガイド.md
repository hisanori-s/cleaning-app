# テスト環境セットアップガイドライン

## 1. はじめに

このプロジェクトではAI駆動開発を採用しており、テストと実装の両方をAIがサポートします。

### 開発アプローチ

#### 1.1 既存コードへのテスト追加
- 既に動作確認済みの本番コードが存在する場合
- テストは本番コードの動作を検証する目的
- **原則**: 本番コードの変更は最小限に抑え、まずはテストコードでの対応を試みる
- 本番コードの改善が必要な場合は、テストを書いてから慎重に変更を行う

#### 1.2 AI駆動によるTDD
- AIがテストと実装の両方を提案
- テストファーストの原則は維持しつつ、より柔軟な開発サイクル
- Red → Green → RefactorのサイクルをAIがサポート
- テストと実装を同時に最適化できる

### 開発の優先順位
1. **既存機能の保護**
   - 動作確認済みの機能は極力保持
   - 変更が必要な場合は十分なテストカバレッジを確保

2. **効率的な開発**
   - AIの提案を最大限活用
   - テストと実装の同時最適化
   - 必要に応じて柔軟にリファクタリング

3. **品質の確保**
   - テストカバレッジの維持
   - 実装とテストの整合性確認
   - デバッグ情報の活用

## 2. 重要なルール

### 2.1 コード変更に関する制約
1. **本番コードの保護**
   - 実装済みの本番コードの変更は禁止
   - テストのために本番コードを修正しない
   - 本番コードに問題を見つけた場合は、別のタイミングで対応を検討

2. **モックデータの取り扱い**
   - 既存のモックデータ（`WPplugin/mock-api-return`など）は削除禁止
   - 開発環境でも使用されているモックデータは変更しない
   - テスト用の追加のモックが必要な場合は、`__tests__`ディレクトリ内に作成

3. **変更可能な範囲**
   - `src/__tests__`ディレクトリ内のみ変更可能
   - テストコードとテスト用のモックは`__tests__`ディレクトリに集約
   - テスト設定ファイル（`vitest.config.ts`など）は変更可能

## 3. 開発・テスト環境

### 3.1 統一された環境 (Vite + Vitest)
- 開発サーバー：`npm run dev`（デフォルトポート: 5173）
- テスト実行：`npm test`
- 環境変数：`import.meta.env`で統一的にアクセス
- 特徴：
  - 高速な開発・テスト環境
  - シンプルな設定
  - TypeScript・JSXのネイティブサポート

### 3.2 環境変数の管理
#### 開発環境
```typescript
// .env.local
VITE_WP_API_BASE_URL=http://localhost:5173/wp-json
VITE_WP_API_NAMESPACE=cleaning-management/v1
VITE_MOCK_API_BASE_URL=http://localhost:5173/WPplugin/mock-api-return
```

#### テスト環境
```typescript
// src/__tests__/setup.ts
process.env.VITE_WP_API_BASE_URL = 'http://localhost:5173/wp-json';
process.env.VITE_WP_API_NAMESPACE = 'cleaning-management/v1';
process.env.VITE_MOCK_API_BASE_URL = 'http://localhost:5173/WPplugin/mock-api-return';
```

## 4. プロジェクト構成

### 4.1 ディレクトリ構造
```
src/
  __tests__/          # テストファイルのルートディレクトリ
    hooks/           # カスタムフックのテスト
    components/      # コンポーネントのテスト
    utils/          # ユーティリティ関数のテスト
    setup.ts        # テスト環境のセットアップ
  components/
    ui/             # UIコンポーネント
  hooks/            # カスタムフック
  lib/              # ユーティリティ関数
```

### 4.2 UIコンポーネント (shadcn/ui)
- 基本コンポーネントは`src/components/ui/`に配置
- 各コンポーネントは独立したファイルとして管理
- スタイリングはTailwind CSSを使用

#### 実装済みコンポーネント
- Button (`button.tsx`)
- Card (`card.tsx`)
- Form (`form.tsx`)
- Input (`input.tsx`)
- Textarea (`textarea.tsx`)
- Checkbox (`checkbox.tsx`)

## 5. エラーハンドリング

### 5.1 グローバルエラーハンドリング
```typescript
// src/app.tsx
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
    <pre className="text-red-500 mb-4">{error.message}</pre>
    <button onClick={resetErrorBoundary}>再試行</button>
  </div>
);

// アプリケーション全体をラップ
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

### 5.2 コンポーネントレベルのエラーハンドリング
```typescript
// 特定のコンポーネントをラップ
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => {
    // エラーリセット時の処理
  }}
>
  <ComponentWithPotentialError />
</ErrorBoundary>
```

## 6. テストの実装

### 6.1 基本的なテスト
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('正しくレンダリングされること', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### 6.2 エラーハンドリングのテスト
```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';

describe('ErrorBoundary', () => {
  it('エラー発生時に適切なフォールバックを表示', () => {
    const ThrowError = () => {
      throw new Error('テストエラー');
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });
});
```

### 6.3 UIコンポーネントのテスト
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('カスタムクラスが適用されること', () => {
    const { container } = render(
      <Button className="custom-class">
        テストボタン
      </Button>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('無効化状態が適用されること', () => {
    render(<Button disabled>テストボタン</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 7. デバッグ

### 7.1 テスト実行時のデバッグ
```bash
# 監視モードでテスト実行
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

### 7.2 デバッグ出力
```typescript
// エラー内容を日本語で説明
console.log('【エラー詳細】:', {
  説明: 'エラーの詳細な説明',
  場所: 'エラーが発生した場所',
  期待値: '期待される動作や値',
  実際: '実際の動作や値',
  対処方法: '想定される解決方法'
});

// コンポーネントの状態確認
console.log('【レンダリング結果】:');
screen.debug();
```

### 7.3 エラーハンドリングのデバッグ
```typescript
try {
  // テストコード
} catch (error) {
  console.error('【エラーが発生しました】:', {
    説明: 'エラーの詳細な説明をここに日本語で記述',
    場所: 'エラーが発生した場所',
    原因: error.message,
    対処方法: '想定される解決方法'
  });
}
```

## 8. よくあるエラーと対処方法

### 8.1 環境変数関連
```typescript
// エラー：環境変数が undefined
console.error('【環境変数エラー】:', {
  説明: '環境変数が正しく設定されていません',
  確認項目: [
    '.env.local ファイルの存在確認',
    'VITE_ プレフィックスの確認',
    'import.meta.env の使用確認'
  ],
  対処方法: '開発環境とテスト環境の環境変数を同期する'
});
```

### 8.2 コンポーネントのレンダリング
```typescript
// エラー：要素が見つからない
console.error('【レンダリングエラー】:', {
  説明: '期待する要素が DOM に存在しません',
  確認項目: [
    'コンポーネントのマウント待機',
    'セレクタの正確性',
    'コンポーネントの条件付きレンダリング'
  ],
  対処方法: 'screen.debug() で DOM 構造を確認'
});
```

### 8.3 非同期処理
```typescript
// エラー：非同期処理の完了待ち
console.error('【非同期エラー】:', {
  説明: '非同期処理の完了を待機できていません',
  確認項目: [
    'act() の使用',
    'await の付け忘れ',
    'タイミングの制御'
  ],
  対処方法: 'async/await と act() を適切に使用する'
});
``` 