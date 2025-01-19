# 部屋詳細表示機能のセッションストレージ対応

## 基本方針
1. 部屋一覧から詳細ページへの遷移方式
   - 部屋一覧の各行をクリックで詳細ページへ遷移
   - 遷移先URLは固定（`/rooms`）
   - クリック時に選択された部屋の情報をセッションストレージに保存

2. 部屋詳細の表示方式
   - セッションストレージから物件IDと部屋番号を取得
   - 取得した情報を元に対象の部屋情報を取得
   - 部屋情報を詳細ページに表示

3. レポート機能
   - 清掃報告作成ボタンのUIのみ実装
   - ボタンの機能実装は後回し

## 概要
部屋一覧から部屋詳細への遷移をセッションストレージベースに変更し、TDDで部屋情報表示機能を実装する。

## 前提条件
- セッションストレージのキー: `selected_room_info`
- セッション有効期限: 1時間
- 保存データ形式:
```typescript
interface SelectedRoomInfo {
  property_id: number;
  room_number: string;
  timestamp: number; // 有効期限チェック用
}
```

## フェーズ1：ルーティング構造の変更

### 実装情報
- 編集対象ファイル: 
  - `src/routes.tsx`
  - `src/pages/rooms/page.tsx`

### 作業前の確認事項
- [ ] 実際のページ構造の確認
  ```bash
  tree src/pages
  ```
- [ ] 既存の`page.tsx`の内容確認

### 作業内容
- [ ] `routes.tsx`のパス定義を`/rooms/:roomId`から`/rooms`に変更
- [ ] 既存の部屋詳細ページコンポーネントの内容を`src/pages/rooms/page.tsx`に移行
  - `CleaningHistory`コンポーネントはそのまま移行
  - `PropertyInfoBox`コンポーネントはそのまま移行
  - 清掃報告作成ボタンは機能を無効化して表示のみ行う
- [ ] 不要なファイルやディレクトリの削除（実際の構造を確認後に実施）

### 注意点
- 作業開始前に必ず現在のファイル構造を確認
- 既存コンポーネントの移行時にインポートパスを適切に更新
- 清掃報告関連の機能は一旦保留とし、UIのみ維持

### 完了条件
- [ ] `/rooms`パスで部屋詳細ページが表示される
- [ ] 既存コンポーネントが正しく移行されている
- [ ] 清掃報告ボタンがUIとして表示される（機能なし）
- [ ] 不要なファイルが削除されている（構造確認後）

## フェーズ2：部屋一覧からの遷移処理実装

### 実装情報
- 編集対象ファイル: `src/components/dashboard/room-list-box/room-list-box.tsx`

### 作業内容
- [ ] セッションストレージ操作用のユーティリティ関数を実装
```typescript
const setSelectedRoom = (propertyId: number, roomNumber: string) => {
  const info: SelectedRoomInfo = {
    property_id: propertyId,
    room_number: roomNumber,
    timestamp: Date.now()
  };
  sessionStorage.setItem('selected_room_info', JSON.stringify(info));
};
```
- [ ] クリックハンドラーの実装を更新
- [ ] 遷移先URLを`/rooms`に変更

### 注意点
- TypeScript型定義の整備
- セッションストレージ操作のエラーハンドリング

### 完了条件
- [ ] クリック時に正しい形式でデータがセッションストレージに保存される
- [ ] 保存後に`/rooms`に遷移する

## フェーズ3：部屋情報表示コンポーネントのTDD実装

### 実装情報
- 編集対象ファイル: `src/components/room-detail/room-info-box/room-info-box.tsx`
- テストファイル: `src/__tests__/components/room-detail/room-info-box/room-info-box.test.tsx`
- モックデータ: `src/__tests__/mocks/api/room-detail.json`

### 作業内容
#### Step 1: テストケース作成
- [ ] 正常系テストの実装
  ```typescript
  describe('RoomInfoBox', () => {
    it('モックデータの全フィールドが正しく表示される', () => {
      // property_name, room_number, vacancy_date, cleaning_deadline, 
      // room_key_number, entrance_key_number, notes の表示確認
    });

    it('notesが複数行の場合、正しく改行されて表示される', () => {
      // モックデータのnotesに含まれる\nが<br>または改行として表示されることを確認
    });
  });
  ```
- [ ] 異常系テストの実装
  ```typescript
  describe('RoomInfoBox Error Cases', () => {
    it('必須フィールドが欠落している場合、エラーメッセージを表示', () => {
      // property_name, room_number等が未定義の場合の処理
    });

    it('データが空の場合、適切なメッセージを表示', () => {
      // データが null または undefined の場合の処理
    });
  });
  ```

#### Step 2: コンポーネント実装
- [ ] コンポーネントの基本構造実装
  ```typescript
  interface RoomInfoBoxProps {
    room: {
      property_name: string;
      room_number: string;
      vacancy_date: string;
      cleaning_deadline: string;
      room_key_number: string;
      entrance_key_number: string;
      notes: string;
    };
  }
  ```
- [ ] データ表示用のUI実装（shadcn/uiのコンポーネントを使用）
- [ ] エラー表示の実装（データ欠落時のフォールバック）

### 注意点
- テストファーストで開発を進める
- モックデータの型定義を確実に行う
- UIコンポーネントはshadcn/uiを活用

### 完了条件
- [ ] 全てのテストが成功
- [ ] モックデータが正しく表示される
- [ ] エラーケースが適切に処理される

## フェーズ4：部屋詳細ページの統合

### 実装情報
- 編集対象ファイル: `src/pages/rooms/page.tsx`

### 作業内容
- [ ] セッションストレージからの情報取得処理実装
  ```typescript
  const getSelectedRoom = (): SelectedRoomInfo | null => {
    try {
      const data = sessionStorage.getItem('selected_room_info');
      if (!data) return null;
      
      const info = JSON.parse(data) as SelectedRoomInfo;
      const now = Date.now();
      // 1時間 = 3600000ミリ秒
      if (now - info.timestamp > 3600000) {
        sessionStorage.removeItem('selected_room_info');
        return null;
      }
      return info;
    } catch {
      return null;
    }
  };
  ```
- [ ] 有効期限切れ時のリダイレクト処理実装
  ```typescript
  useEffect(() => {
    const selectedRoom = getSelectedRoom();
    if (!selectedRoom) {
      navigate('/');  // ダッシュボードへリダイレクト
      return;
    }
    // ... 部屋情報の取得処理
  }, []);
  ```
- [ ] 部屋情報取得処理の実装
- [ ] `RoomInfoBox`コンポーネントの統合
- [ ] 清掃報告ボタンの実装（機能なし）
  ```typescript
  <Button
    onClick={() => {/* 後で実装 */}}
    disabled={true}
  >
    清掃報告を作成
  </Button>
  ```

### 注意点
- セッション有効期限切れの処理
- データ取得中の読み込み表示
- エラーハンドリング

### 完了条件
- [ ] セッションストレージの情報を使用して部屋情報が表示される
- [ ] 有効期限切れ時に適切な処理が行われる
- [ ] ローディング状態が適切に表示される

## 技術的考慮事項
1. セッションストレージ操作
   - JSON.parse/stringifyのエラーハンドリング
   - タイムスタンプによる有効期限管理

2. 型安全性
   - インターフェース定義の整備
   - 型ガード関数の実装

3. エラーハンドリング
   - セッションストレージアクセスエラー
   - データ取得エラー
   - 有効期限切れ

4. テスト容易性
   - モックデータの整備
   - テストヘルパー関数の実装

## リスク管理
1. セッションストレージの制限
   - 容量制限への考慮
   - クロスブラウザ対応

2. 並行開発との競合
   - 既存機能への影響
   - マージ時の競合可能性

## 成功基準
1. 機能要件
   - 部屋一覧から詳細への遷移が正常に動作
   - 部屋情報が正しく表示される
   - セッション有効期限が適切に管理される

2. 非機能要件
   - レスポンシブ対応
   - エラー時のユーザー体験
   - パフォーマンス最適化 