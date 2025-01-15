# テスト環境ガイドライン

## 1. テストの基本方針

### 1.1 テスト作成の原則
- 本番コードの動作を正確に検証
- テストの保守性と可読性を確保
- 効率的なテスト実装を実現

### 1.2 テストアプローチ
1. **TDDアプローチ**
   - テストで期待する動作を先に定義
   - Red → Green → Refactorのサイクル
   - 最小限の実装から開始

2. **プロダクションファースト**
   - 本番コードの実装方法を尊重
   - テストを本番コードに合わせる
   - 不要な抽象化を避ける

## 2. モックデータの管理

### 2.1 基本ルール
1. **既存モックデータの活用**
   - `src/__tests__/mocks/api/`配下のJSONファイルを使用
   - ハードコーディングは禁止
   - 型定義は本番環境のものを使用

2. **ファイル構成**
   ```
   src/__tests__/mocks/api/
   ├── properties-rooms.json      # 正常系データ
   ├── properties-rooms-error.json    # 異常系データ
   ```

3. **大量データが必要な場合**
   ```typescript
   // 良い例：既存データの再利用
   const largeMockDataset = Array(10)
     .fill(null)
     .map(() => typedMockData.mock_rooms_list)
     .flat();
   ```

### 2.2 正常系と異常系の分離
1. **ファイル命名規則**
   ```
   {機能名}.json           # 正常系
   {機能名}-error.json     # 異常系
   {機能名}-empty.json     # 空データ
   ```

2. **使用例**
   ```typescript
   // 正常系のインポート
   import { typedMockData } from '@/__tests__/mocks/api/properties-rooms.json';
   
   // 異常系のインポート
   import { errorMockData } from '@/__tests__/mocks/api/properties-rooms-error.json';
   
   describe('RoomListBox', () => {
     describe('正常系', () => {
       it('通常データの表示', () => {
         render(<RoomListBox rooms={typedMockData.mock_rooms_list} />);
       });
     });
   
     describe('異常系', () => {
       it('エラーデータの処理', () => {
         render(<RoomListBox rooms={errorMockData.mock_rooms_list} />);
       });
     });
   });
   ```

## 3. テスト実装のポイント

### 3.1 データ検証
- 直接的なデータ検証を優先
- DOM検索は必要最小限に
- 本番コードと同じ検証ロジック

### 3.2 エラー対応
- エラー発生時は本番コードの実装を確認
- テストが本番と異なるアプローチを取っていないか確認
- デバッグ情報の活用

## 4. 環境設定
- 開発サーバー：`npm run dev`
- テスト実行：`npm test`
- 環境変数：`import.meta.env`で統一的にアクセス 