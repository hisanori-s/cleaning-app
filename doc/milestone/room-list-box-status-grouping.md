# RoomListBox ステータスグループ化の実装

## 概要
RoomListBoxコンポーネントに、動的なステータスグループ化機能を追加します。
現在ページコンポーネントで行っているステータスごとのフィルタリングを、
RoomListBoxコンポーネント内で効率的に処理するように変更します。

## 前提条件
- RoomListBoxコンポーネントが正常に動作していること
- Room型とRoomStatus型が正しく定義されていること
- モックデータが新しいステータス形式に対応していること

## 禁止事項
- ページコンポーネント内でのステータス処理の実装
- 不要なループ処理の作成
- ハードコードされたステータス値の使用

## 作業項目

### 1. インターフェースの設計
- [ ] `RoomListBox`コンポーネントのprops設計
  ```typescript
  interface RoomListBoxProps {
    title: string;
    rooms: Room[];
    titleColor?: string;
    onError?: (error: Error) => void;
    groupByStatus?: boolean; // 新規追加
  }
  ```

### 2. ステータスグループ化機能の実装
- [ ] `src/components/dashboard/room-list-box/room-list-box.tsx`の更新
  - [ ] ステータスグループ生成ロジックの実装
  - [ ] メモ化による最適化
  - [ ] グループ化表示のレイアウト調整

### 3. ページコンポーネントの簡素化
- [ ] `src/pages/dashboard/page.tsx`の更新
  - [ ] 既存のフィルタリングロジックの削除
  - [ ] RoomListBoxの使用方法の更新

### 4. テストの更新
- [ ] `src/__tests__/components/dashboard/room-list-box/room-list-box.test.tsx`の更新
  - [ ] グループ化機能のテストケース追加
  - [ ] パフォーマンステストの更新
  - [ ] エッジケースの検証

## 影響範囲
1. 変更が必要なファイル
   - `src/components/dashboard/room-list-box/room-list-box.tsx`
   - `src/pages/dashboard/page.tsx`
   - `src/__tests__/components/dashboard/room-list-box/room-list-box.test.tsx`

2. 変更の影響を受ける機能
   - ステータス別の部屋一覧表示
   - 全部屋一覧の表示
   - パフォーマンス最適化（メモ化）

## テスト要件
1. 正常系
   - グループ化が正しく機能すること
   - 1回のループで処理が完了すること
   - メモ化が正しく機能すること
   - 動的なステータス追加に対応できること

2. 異常系
   - 不正なデータ形式への対応
   - エラー処理の検証
   - パフォーマンス劣化の防止

## 注意事項
- 変更は段階的に行い、各ステップでテストを実行して確認すること
- パフォーマンスへの影響を常に監視すること
- 既存の機能を壊さないよう注意すること
- コンポーネントの責務を明確に保つこと

## 完了条件
1. すべてのテストが成功すること
2. パフォーマンスが現状と同等以上であること
3. TypeScriptの型エラーがないこと
4. ESLintエラーがないこと
5. 新しいステータスの追加に柔軟に対応できること

## 見積もり工数（参考）
- インターフェース設計: 0.5h
- ステータスグループ化機能の実装: 1.5h
- ページコンポーネントの更新: 0.5h
- テストの更新: 1h
- 動作確認とデバッグ: 0.5h

合計: 4h 