はい、マイルストーンを作成していきます。

# 部屋詳細表示機能のコンポーネント構造最適化

## ユーザー指示
ページコンポーネント
src\pages\rooms\page.tsx
（一時的にデバッグブロックを作成してA:の内容を表示）

機能コンポーネント
A:src\components\room-detail\room-detail-fetch\room-detail-fetch.tsx
B:src\components\room-detail\room-info-box\room-info-box.tsx
C:src\components\room-detail\property-info-box\property-info-box.tsx

やりたいこと
A:で受け取った情報をもとにBとCに情報を渡す。そのBとCをページコンポーネントに表示。


## 要件の具体化
1. デバッグ情報の表示
   - セッションストレージの内容
   - APIレスポンスの内容
   - 開発環境でのみ表示

2. データフロー
   - `room-detail-fetch.tsx`でデータ取得
   - 取得したデータを親コンポーネントに渡す
   - 親から表示用コンポーネントにデータを渡す

3. エラーハンドリング
   - データ取得失敗時の表示
   - ローディング中の表示
   - データ不足時の表示

## アーキテクチャ
```
src/
├── pages/
│   └── rooms/
│       └── page.tsx （ページコンポーネント）
└── components/
    └── room-detail/
        ├── room-detail-fetch/
        │   └── room-detail-fetch.tsx （データ取得）
        ├── room-info-box/
        │   └── room-info-box.tsx （部屋情報表示）
        └── property-info-box/
            └── property-info-box.tsx （物件情報表示）
```

## フェーズ1：データ取得コンポーネントの修正

### 実装情報
- 編集対象ファイル: `src/components/room-detail/room-detail-fetch/room-detail-fetch.tsx`
- 概要: データ取得結果を親コンポーネントに渡すように修正

### 作業内容
- [ ] コンポーネントのprops型定義を追加
```typescript
interface RoomDetailFetchProps {
  onDataLoaded?: (room: Room | null) => void;
  onError?: (error: Error) => void;
}
```
- [ ] データ取得成功時のコールバック追加
- [ ] エラー発生時のコールバック追加
- [ ] 表示ロジックの分離（子コンポーネントの呼び出しを削除）

### 注意点
- 既存のデバッグ情報表示は維持
- エラーハンドリングの漏れがないように注意
- 型の整合性を確保

### 完了条件
- [ ] データ取得時に親コンポーネントにデータが渡される
- [ ] エラー発生時に適切に通知される
- [ ] デバッグ情報が正しく表示される

## フェーズ2：ページコンポーネントの拡張

### 実装情報
- 編集対象ファイル: `src/pages/rooms/page.tsx`
- 概要: データ取得と表示の制御を実装

### 作業内容
- [ ] 状態管理の追加
```typescript
const [room, setRoom] = useState<Room | null>(null);
const [error, setError] = useState<Error | null>(null);
```
- [ ] データ取得コンポーネントのコールバック実装
- [ ] 条件付きレンダリングの実装
- [ ] デバッグ情報表示の実装

### 注意点
- 不要な再レンダリングを防ぐ
- エラー表示の適切な実装
- デバッグ情報の開発環境限定表示

### 完了条件
- [ ] データ取得結果が適切に表示される
- [ ] エラー時の表示が機能する
- [ ] デバッグ情報が開発環境でのみ表示される

## フェーズ3：表示コンポーネントの確認

### 実装情報
- 確認対象ファイル: 
  - `src/components/room-detail/room-info-box/room-info-box.tsx`
  - `src/components/room-detail/property-info-box/property-info-box.tsx`
- 概要: 既存の表示コンポーネントの動作確認

### 作業内容
- [ ] props型の確認
- [ ] エラー表示の確認
- [ ] スタイリングの確認

### 注意点
- 既存の機能を壊さない
- 型の整合性を確保
- UI/UXの一貫性を維持

### 完了条件
- [ ] 全てのpropsが正しく表示される
- [ ] エラー表示が適切に機能する
- [ ] スタイリングが正しく適用される

## テスト要件
1. データ取得コンポーネント
   - 正常系：データ取得成功
   - 異常系：API失敗
   - 異常系：セッションストレージなし

2. ページコンポーネント
   - 正常系：全データ表示
   - 異常系：エラー表示
   - 開発環境：デバッグ情報表示

3. 表示コンポーネント
   - 正常系：データ表示
   - 異常系：必須項目なし

## リスク管理
1. データの整合性
   - セッションストレージのデータ形式
   - APIレスポンスの形式
   - 型の一貫性

2. パフォーマンス
   - 不要な再レンダリング
   - メモリリーク
   - エラー時の挙動

3. UI/UX
   - ローディング表示
   - エラー表示
   - デバッグ情報の視認性
