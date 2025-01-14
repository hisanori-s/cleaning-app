# コンポーネント構造再編成計画書

## 目的
- ページコンポーネントと機能コンポーネントの明確な分離
- コードベースの保守性と可読性の向上
- コンポーネントの再利用性の向上
- 開発者間での一貫した理解の促進

## 現状の課題
1. すべてのコンポーネントが `src/components/` 配下に混在
   - ページコンポーネントと機能コンポーネントの区別が不明確
   - コンポーネントの役割や責任の範囲が不明確

2. ディレクトリ構造が機能単位でない
   - 関連するコンポーネントが散在する可能性
   - コンポーネントの依存関係が把握しづらい

## 新しいディレクトリ構造
```
src/
├── pages/                    # ページコンポーネント
│   ├── auth/                # 認証関連ページ
│   │   └── login.tsx
│   ├── dashboard/           # ダッシュボード
│   │   └── index.tsx
│   ├── rooms/              # 部屋関連ページ
│   │   ├── index.tsx       # 一覧ページ
│   │   ├── [id].tsx       # 詳細ページ
│   │   └── [id]/
│   │       └── report.tsx  # 報告ページ
│   └── reports/            # レポート関連ページ
│       └── complete.tsx    # 完了ページ
│
├── components/              # 機能コンポーネント
│   ├── rooms/              # 部屋関連コンポーネント
│   │   ├── list/          # 一覧関連
│   │   │   ├── room-card.tsx
│   │   │   └── room-list.tsx
│   │   └── detail/        # 詳細関連
│   │       ├── room-info.tsx
│   │       └── cleaning-history.tsx
│   ├── reports/            # レポート関連コンポーネント
│   │   ├── form/
│   │   │   ├── cleaning-checklist.tsx
│   │   │   └── image-upload.tsx
│   │   └── complete/
│   │       └── success-message.tsx
│   └── ui/                 # 共通UIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       └── form.tsx
```

## 命名規則
1. ページコンポーネント
   - ファイル名: `kebab-case.tsx`
   - コンポーネント名: `PascalCase`
   - 例: `login.tsx` → `export default function LoginPage()`

2. 機能コンポーネント
   - ファイル名: `kebab-case.tsx`
   - コンポーネント名: `PascalCase`
   - 例: `room-card.tsx` → `export function RoomCard()`

3. ディレクトリ名
   - すべて `kebab-case`
   - 機能や目的を明確に表す名前を使用

## 移行作業手順
1. ディレクトリ構造の作成
   - [x] `src/pages` ディレクトリの作成
   - [x] 新しい機能別ディレクトリの作成

2. ページコンポーネントの移行
   - [x] `login-page.tsx` → `pages/auth/login.tsx`
   - [x] `dashboard-page.tsx` → `pages/dashboard/index.tsx`
   - [x] `room-list-page.tsx` → `pages/rooms/index.tsx`
   - [x] `room-detail-page.tsx` → `pages/rooms/[id].tsx`
   - [x] `report-form-page.tsx` → `pages/rooms/[id]/report.tsx`
   - [x] `report-complete-page.tsx` → `pages/reports/complete.tsx`

3. 機能コンポーネントの再編成
   - [x] 部屋関連コンポーネントの分割と移動
     - [x] `room-card.tsx`の作成
     - [x] `room-list.tsx`の作成
     - [x] `room-info.tsx`の作成
     - [x] `cleaning-history.tsx`の作成
   - [x] レポート関連コンポーネントの分割と移動
     - [x] `cleaning-checklist.tsx`の作成
     - [x] `image-upload.tsx`の作成
     - [x] `success-message.tsx`の作成
   - [x] 共通UIコンポーネントの整理

4. インポートパスの更新
   - [x] すべてのファイルのインポートパスを新構造に合わせて更新
   - [x] 相対パスを絶対パスに変更（必要に応じて）

5. ルーティング設定の更新
   - [x] `routes.tsx` のインポートパスを更新
   - [x] 必要に応じてルーティング構造を最適化

## 注意事項
1. 移行時の一般的なルール
   - 機能を変更せず、純粋な構造の移行のみを行う
   - 一つのコンポーネントの移行が完了したら、必ずテストを実行
   - コミット単位は論理的なまとまりで行う

2. コンポーネントの分割基準
   - 単一責任の原則に従う
   - 再利用可能性を考慮
   - Props のインターフェースをクリーンに保つ

3. パフォーマンスへの配慮
   - 不要なレンダリングを避ける
   - 適切なコード分割を維持

## 完了条件
1. [x] すべてのファイルが新しい構造に移行されている
2. [x] すべてのインポートパスが正しく更新されている
3. [x] アプリケーションが正常に動作する
4. [x] ビルドエラーやワーニングが発生しない
5. [x] 開発サーバーで各機能が正常に動作する

## 次のステップ
1. 機能コンポーネントの分割と作成
   - 各ページコンポーネントから再利用可能なコンポーネントを抽出
   - 新しい機能コンポーネントの作成
   - コンポーネント間の依存関係の整理

2. コンポーネントのテストとドキュメント化
   - 各コンポーネントの単体テストの作成
   - コンポーネントの使用方法のドキュメント作成
   - Props のインターフェース定義の整備

## 今後の展開
1. コンポーネントのドキュメント化
2. Storybook の導入検討
3. ユニットテストの拡充
4. パフォーマンス最適化

この再編成により、より保守性が高く、スケーラブルなコードベースを実現します。 