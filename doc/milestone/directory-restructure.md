# ディレクトリ構造変更 作業計画書

## 概要
フロントエンドのディレクトリ構造を整理し、より保守性の高い構造へと改善する。

## 目標構造
```
src/
├── api/                    # API通信関連
│   └── wordpress.ts       # WordPress REST API クライアント
│
├── assets/                # 静的ファイル
│   └── react.svg         # アイコン等の画像ファイル
│
├── components/            # 機能コンポーネント
│   ├── dashboard/        # ダッシュボード機能
│   │   ├── message-box/  # メッセージ表示
│   │   │   ├── __tests__/
│   │   │   │   └── message-box.test.tsx
│   │   │   ├── message-box.tsx
│   │   │   └── types.ts
│   │   │
│   │   └── room-list-box/  # 部屋一覧表示
│   │       ├── __tests__/
│   │       │   └── room-list-box.test.tsx
│   │       ├── room-list-box.tsx
│   │       └── types.ts
│   │
│   ├── room-detail/      # 部屋詳細機能
│   │   ├── property-info-box/  # 物件情報
│   │   │   ├── __tests__/
│   │   │   │   └── property-info-box.test.tsx
│   │   │   ├── property-info-box.tsx
│   │   │   └── types.ts
│   │   │
│   │   └── room-info-box/     # 部屋情報
│   │       ├── __tests__/
│   │       │   └── room-info-box.test.tsx
│   │       ├── room-info-box.tsx
│   │       └── types.ts
│   │
│   ├── report/           # レポート機能
│   │   └── report-form-box/   # レポートフォーム
│   │       ├── __tests__/
│   │       │   └── report-form-box.test.tsx
│   │       ├── report-form-box.tsx
│   │       ├── report-form-box-checklist.tsx
│   │       ├── report-form-box-image.tsx
│   │       └── types.ts
│   │
│   └── ui/              # 共通UIコンポーネント
│       ├── alert/
│       │   ├── alert.tsx
│       │   └── types.ts
│       ├── button/
│       │   ├── button.tsx
│       │   └── types.ts
│       ├── card/
│       │   ├── card.tsx
│       │   └── types.ts
│       └── form/
│           ├── checkbox.tsx
│           ├── input.tsx
│           ├── textarea.tsx
│           └── types.ts
│
├── hooks/               # カスタムフック
│   ├── use-auth.ts
│   └── use-api.ts
│
├── lib/                # ユーティリティ
│   └── utils/
│       ├── date.ts
│       ├── format.ts
│       └── validation.ts
│
├── pages/              # ページコンポーネント
│   ├── auth/
│   │   └── page.tsx   # ログインページ
│   │
│   ├── dashboard/
│   │   └── page.tsx   # ダッシュボード
│   │
│   └── rooms/
│       └── [id]/
│           ├── page.tsx     # 部屋詳細
│           └── report/
│               └── page.tsx # レポート作成
│
├── types/             # 共通型定義
│   ├── api.ts        # API関連の型
│   ├── auth.ts       # 認証関連の型
│   ├── room.ts       # 部屋関連の型
│   └── report.ts     # レポート関連の型
│
├── app.tsx           # アプリケーションのルート
├── routes.tsx        # ルーティング設定
└── main.tsx         # エントリーポイント
```

## 作業ステップ

### Phase 1: 依存関係の分析と準備
1. 型定義の分析
- [x] `types/` ディレクトリの内容確認
- [x] 型定義ファイルの依存関係マッピング
- [x] カスタム型の使用箇所の特定

2. コンポーネント依存関係の分析
- [x] 各コンポーネントのimport/export関係の確認
- [x] 共有されているカスタムフックの特定
- [x] コンポーネント間のデータフローの確認

3. ユーティリティ関数の分析
- [x] 共通ユーティリティの使用状況確認
- [x] ビジネスロジックの依存関係確認
- [x] ヘルパー関数の使用箇所マッピング

### Phase 2: 新構造の作成
1. ディレクトリ構造の作成
- [x] 必要なディレクトリツリーの作成
- [x] ディレクトリ権限の確認
- [x] .gitkeepファイルの配置（必要な場合）

2. 基本設定ファイルの準備
- [x] 新しいエントリーポイントの確認
- [x] ルーティング設定の準備
- [x] 共通設定ファイルの移行準備

### Phase 3: ページコンポーネントの移行
1. ダッシュボード
- [x] 既存コードの依存関係確認
- [x] `pages/dashboard/page.tsx` の作成
- [x] 関連コードの移行
- [x] ルーティングの更新

2. 認証
- [x] 認証フローの依存関係確認
- [x] `pages/auth/page.tsx` の作成
- [x] 関連コードの移行
- [x] ルーティングの更新

3. 部屋詳細
- [x] 部屋情報の依存関係確認
- [x] `pages/rooms/[id]/page.tsx` の作成
- [x] 関連コードの移行
- [x] ルーティングの更新

4. レポート作成
- [x] レポート機能の依存関係確認
- [x] `pages/rooms/[id]/report/page.tsx` の作成
- [x] 関連コードの移行
- [x] ルーティングの更新

### Phase 4: 機能コンポーネントの作成
1. ダッシュボード機能
- [ ] メッセージボックスの依存関係確認
- [ ] `components/dashboard/message-box/` の作成と実装
- [ ] 部屋一覧ボックスの依存関係確認
- [ ] `components/dashboard/room-list-box/` の作成と実装

2. 部屋詳細機能
- [ ] 物件情報の依存関係確認
- [ ] `components/room-detail/property-info-box/` の作成と実装
- [ ] 部屋情報の依存関係確認
- [ ] `components/room-detail/room-info-box/` の作成と実装

3. レポート機能
- [ ] レポートフォームの依存関係確認
- [ ] `components/report/report-form-box/` の作成
- [ ] チェックリストとイメージアップロード機能の実装

### Phase 5: 依存関係の更新
1. import文の更新
- [ ] 新しいファイルパスへの参照更新
- [ ] 型定義の参照パス更新
- [ ] ユーティリティの参照パス更新

2. 型定義の調整
- [ ] 新構造に合わせた型定義の更新
- [ ] 型エラーの解消
- [ ] 型定義ファイルの整理

### Phase 6: 不要ファイルの削除
- [ ] 古いページコンポーネントの削除
- [ ] 未使用のコンポーネントディレクトリの削除
- [ ] 古いルーティング設定の削除
- [ ] 未使用の型定義の削除

### Phase 7: テストと動作確認
- [ ] 各ページの表示確認
- [ ] コンポーネント間の連携確認
- [ ] データフローの確認
- [ ] エラーハンドリングの確認

## 実装時の情報収集方法

### 1. 型定義の確認
```typescript
// 型定義ファイルの内容確認
codebase_search "型定義の使用パターンを検索"
read_file "types/index.ts"
```

### 2. 依存関係の確認
```typescript
// importの使用パターンを確認
grep_search "import.*from"
// コンポーネント間の参照を確認
grep_search "export.*default"
```

### 3. ルーティング設定の確認
```typescript
// ルーティング定義を確認
read_file "routes.tsx"
// ページコンポーネントの実装を確認
codebase_search "ページコンポーネントの実装パターン"
```

### 4. コンポーネントの実装確認
```typescript
// 既存のコンポーネント実装を確認
read_file "対象コンポーネントのパス"
// propsやカスタムフックの使用を確認
grep_search "use[A-Z]"
```

## 削除対象ファイル
```
src/components/auth/
src/components/reports/complete/
src/components/reports/form/
src/components/rooms/detail/
src/components/rooms/list/
src/pages/auth/login.tsx
src/pages/rooms/index.tsx
src/pages/rooms/[id].tsx
src/pages/rooms/[id]/report.tsx
src/pages/reports/complete.tsx
```

## 新規作成ファイル
```
src/pages/
├── auth/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
└── rooms/
    └── [id]/
        ├── page.tsx
        └── report/
            └── page.tsx

src/components/
├── dashboard/
│   ├── message-box/
│   │   └── message-box.tsx
│   └── room-list-box/
│       └── room-list-box.tsx
├── room-detail/
│   ├── property-info-box/
│   │   └── property-info-box.tsx
│   └── room-info-box/
│       └── room-info-box.tsx
└── report/
    └── report-form-box/
        ├── report-form-box.tsx
        ├── report-form-box-checklist.tsx
        └── report-form-box-image.tsx
```

## リスク管理
1. データの損失リスク
   - 対策: 作業前のバックアップ作成
   - 対策: 段階的な移行

2. 機能の欠落リスク
   - 対策: 各フェーズでの動作確認
   - 対策: チェックリストによる機能確認

3. パフォーマンスリスク
   - 対策: バンドルサイズの監視
   - 対策: パフォーマンス計測

## タイムライン
1. Phase 1: 1日
2. Phase 2: 1日
3. Phase 3: 2日
4. Phase 4: 2日
5. Phase 5: 1日
6. Phase 6: 0.5日
7. Phase 7: 1.5日

合計: 9日間

## 成功基準
1. すべてのページが新構造で正常に動作すること
2. 既存の機能がすべて維持されていること
3. ビルドが正常に完了すること
4. パフォーマンスが維持または改善されていること 