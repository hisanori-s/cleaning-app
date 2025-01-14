# フロントエンド アーキテクチャ設計書

## ディレクトリ構造

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

## コンポーネント構成詳細

### 1. ページコンポーネント
- `auth/page.tsx`: ログイン認証ページ
- `dashboard/page.tsx`: ダッシュボード画面
- `rooms/[id]/page.tsx`: 部屋詳細画面
- `rooms/[id]/report/page.tsx`: レポート作成画面

### 2. 機能コンポーネント
#### ダッシュボード機能
- `message-box`: メッセージ表示ボックス
  - 通知やアラートの表示
  - システムメッセージの管理
- `room-list-box`: 部屋一覧表示ボックス
  - 担当部屋の一覧表示
  - ステータス別フィルタリング

#### 部屋詳細機能
- `property-info-box`: 物件情報表示
  - 建物情報の表示
  - フロア情報の表示
- `room-info-box`: 部屋情報表示
  - 部屋の基本情報
  - 清掃履歴

#### レポート機能
- `report-form-box`: レポート作成フォーム
  - チェックリスト入力
  - 画像アップロード
  - 送信機能

### 3. 共通UIコンポーネント
- `alert`: 通知メッセージ
- `button`: ボタン
- `card`: カードコンテナ
- `form`: フォーム関連コンポーネント

## データフロー

### API通信
- `wordpress.ts`: WordPress REST APIとの通信
  - 認証処理
  - データの取得・送信
  - エラーハンドリング

### カスタムフック
- `use-auth.ts`: 認証状態管理
  - ログイン状態
  - ユーザー情報
  - 認証トークン
- `use-api.ts`: API通信の抽象化
  - データフェッチ
  - キャッシュ管理
  - エラー処理

### 型定義
- `api.ts`: API関連の型定義
- `auth.ts`: 認証関連の型定義
- `room.ts`: 部屋関連の型定義
- `report.ts`: レポート関連の型定義

## テスト構成
各機能コンポーネントに対して:
- ユニットテスト
- インテグレーションテスト
- スナップショットテスト

## スタイリング
- コンポーネントレベルのスタイル
- shadcn/uiの活用
- レスポンシブデザイン対応 