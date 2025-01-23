# WordPress API 部屋一覧実装 フェーズ2

## 作業概要
モックデータから本番APIデータへの移行作業

## 作成するファイル
1. src/hooks/dashboard/useRoomsList.ts
   - 部屋一覧を取得・管理するカスタムフック
   - APIからのデータ取得とステート管理を担当

2. src/lib/dashboard/RoomList.ts
   - APIレスポンスを表示用データに変換するロジック
   - ビジネスロジックの集約場所

## 変更するファイル
1. src/pages/dashboard/page.tsx
   - モックデータを残しつつ、本番APIデータの取得機能を追加
   - useRoomsListフックを使用してデータを取得

## 作業ステップ
### フェーズ1（現在の作業）
1. 必要なファイルの新規作成
   - [x] 作業計画ファイルの作成
   - [x] useRoomsList.tsの作成
   - [x] RoomList.tsの作成

### フェーズ2（次回の作業）
1. page.tsxの修正
   - [ ] useRoomsListフックの組み込み
   - [ ] デバッグ表示の確認
   - [ ] ログイン機能の動作確認

## 注意点
- モックデータは削除せず残す
- ログイン機能を壊さないよう注意
- デバッグウィンドウは維持
- 既存の型定義を活用 