# WordPress API 部屋情報取得機能の実装

## 概要
部屋情報取得機能を本番環境のWordPress APIに接続するように修正する。
モックデータは開発用として残しつつ、本番用の機能を実装する。

## 現状の課題
- wordpress.tsでモックデータを使用している
- getRooms()の構造が実際のAPIと適合していない
- 重複したAPIファイルの可能性がある
- ユーザーに許可された物件IDの確認が必要

## 作業タスク
- [ ] 1. wordpress.tsの整理
  - [ ] 重複ファイルの確認と削除
  - [ ] getRooms()関数の削除
  - [ ] 新しいgetRooms()関数の実装
    - エンドポイント: `/wp-json/cleaning-management/v1/room-list`
    - パラメータ: `house_ids[]`（ユーザーに許可された物件IDの配列）
    - レスポンス形式の型定義

- [ ] 2. デバッグ機能の実装
  - [ ] セッションストレージに保存されているユーザー情報の表示機能
  - [ ] 許可された物件IDの配列の表示
  - [ ] デバッグ範囲を明確にするコメント

- [ ] 3. RoomListBoxコンポーネントの修正
  - [ ] wordpress.tsの新しいgetRooms()を使用するように変更
  - [ ] エラーハンドリングの実装
  - [ ] ローディング状態の実装

## 参考情報
- getUsers()とgetHello()を参考に実装
- api-room-list.phpのPOSTMAN接続情報を参照
- ユーザーの物件ID配列はログイン時にセッションストレージに保存済み

## 作業予定
1. wordpress.tsの整理（1時間）
2. デバッグ機能の実装（30分）
3. RoomListBoxコンポーネントの修正（1時間）
4. テストと動作確認（30分）

## 注意点
- 開発環境の分岐は部屋リスト取得API以外では維持する
- デバッグ情報は後で削除できるように明確にマークする
- エラーハンドリングを適切に実装する 