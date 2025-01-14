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
│   │   │   └── message-box.tsx
│   │   └── room-list-box/  # 部屋一覧表示
│   │       └── room-list-box.tsx
│   │
│   ├── room-detail/      # 部屋詳細機能
│   │   ├── property-info-box/  # 物件情報
│   │   │   └── property-info-box.tsx
│   │   └── room-info-box/     # 部屋情報
│   │       └── room-info-box.tsx
│   │
│   ├── report/           # レポート機能
│   │   └── report-form-box/   # レポートフォーム
│   │       ├── report-form-box.tsx
│   │       ├── report-form-box-checklist.tsx
│   │       └── report-form-box-image.tsx
│   │
│   └── ui/              # 共通UIコンポーネント
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── skeleton.tsx
│       └── textarea.tsx
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
│   └── index.ts      # 型定義
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

## スタイリング
- コンポーネントレベルのスタイル
- shadcn/uiの活用
- レスポンシブデザイン対応 