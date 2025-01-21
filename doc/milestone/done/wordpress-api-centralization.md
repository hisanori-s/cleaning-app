# WordPressのAPI関連ロジックの集約化

## ユーザー指示
1. 現状のプロトタイプ環境から本番環境（WordPress REST API）への移行を容易にする
2. API関連のロジックを`src/api/wordpress.ts`に集約する
3. 各コンポーネントはAPIロジックを直接持たず、`wordpress.ts`を介して通信を行う

## 要件の具体化
1. API通信の集約
   - すべてのWordPress REST API通信を`wordpress.ts`で管理
   - 環境による分岐（開発/本番）をAPI層で吸収
   - 型安全性の確保

2. 型定義の整理（✓完了）
   - 型定義を機能ごとに分割
   - `index.ts`をエントリーポイントとして整理
   - モックデータの型との整合性確保
   - READMEの更新

3. モックデータの管理
   - 開発環境用のモックデータを整理
   - モックと本番の切り替えを容易に
   - モックデータの型チェック

4. エラーハンドリング
   - API層での統一的なエラー処理
   - コンポーネントへの適切なエラー通知
   - 開発環境でのデバッグ情報提供

## アーキテクチャ
```
src/
├── api/
│   └── wordpress.ts （API通信の中心）
├── types/
│   ├── index.ts （型定義のエントリーポイント）
│   ├── api.ts （API共通の型定義）
│   ├── room.ts （部屋一覧の型定義）
│   ├── room-detail.ts （部屋詳細の型定義）
│   ├── user.ts （ユーザー関連の型定義）
│   └── cleaning-report.ts （清掃レポートの型定義）
├── __tests__/
│   └── mocks/
│       └── api/
│           ├── room-detail.json
│           └── properties-rooms.json
└── components/
    └── room-detail/
        └── room-detail-fetch/
            └── room-detail-fetch.tsx
```

## フェーズ1：型定義の整理（✓完了）

### 実装内容
- [x] 型定義ファイルの分割と整理
- [x] `index.ts`のエントリーポイント化
- [x] モックデータとの型整合性確保
- [x] READMEの更新

## フェーズ2：APIクライアントの強化（現在の作業）

### 実装情報
- 編集対象ファイル: `src/api/wordpress.ts`
- 概要: API通信の集約とモック対応の強化

### 作業内容
- [ ] 環境変数による切り替え機能の改善
```typescript
const IS_MOCK = process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK === 'true';
```
- [ ] モックデータ用のインターフェース定義
```typescript
interface MockDataProvider {
  getRoomDetail: (propertyId: number, roomNumber: string) => ApiResponse<RoomDetail>;
  // 他のモックメソッド
}
```
- [ ] エラーハンドリングの強化
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
  }
}
```

### 注意点
- 既存の型定義を維持
- エラーハンドリングの統一
- デバッグ情報の提供

### 完了条件
- [ ] 環境による適切な分岐
- [ ] モックデータの型安全性確保
- [ ] エラーハンドリングの実装

## フェーズ3：Fetchコンポーネントの最適化

### 実装情報
- 編集対象ファイル: `src/components/room-detail/room-detail-fetch/room-detail-fetch.tsx`
- 概要: APIロジックの分離とコンポーネントの責務明確化

### 作業内容
- [ ] API通信ロジックの移動
- [ ] デバッグ情報の改善
- [ ] エラーハンドリングの実装

### 注意点
- コンポーネントの責務を表示に限定
- エラーハンドリングの簡素化
- 型の整合性確保

### 完了条件
- [ ] API通信ロジックの分離
- [ ] エラーハンドリングの改善
- [ ] デバッグ情報の整理

## テスト要件
1. API層のテスト
   - モックデータの整合性
   - エラーハンドリング
   - 環境切り替え

2. コンポーネントのテスト
   - 表示ロジック
   - エラー表示
   - デバッグ情報

## リスク管理
1. データの整合性
   - モックと本番の差異
   - 型定義の不一致
   - APIレスポンスの変更

2. エラーハンドリング
   - ネットワークエラー
   - 認証エラー
   - バリデーションエラー

3. 開発効率
   - デバッグのしやすさ
   - モック切り替えの容易さ
   - コード保守性

## 移行時の注意点
1. WordPress REST API
   - エンドポイントの確認
   - 認証方式の実装
   - レスポンス形式の検証

2. 環境設定
   - 環境変数の設定
   - モードの切り替え
   - デバッグ情報の制御

3. エラーハンドリング
   - エラーメッセージの統一
   - ログの整備
   - フォールバック処理 