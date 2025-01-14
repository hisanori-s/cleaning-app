# エクスポート/インポート修正作業計画書

## 進捗要約
1. ✅ UIコンポーネントの確認と修正
   - すべてのUIコンポーネントが名前付きエクスポートを使用
   - `button.tsx`の`buttonVariants`を内部実装化

2. ✅ APIクライアントの確認と修正
   - すべての関数が名前付きエクスポートを使用
   - `WordPressApiClient`クラスを内部実装化

3. ✅ ページコンポーネントの修正
   - すべてのページコンポーネントをデフォルトエクスポートに変更
   - 対象ファイル:
     - `login-page.tsx`
     - `room-list-page.tsx`
     - `room-detail-page.tsx`
     - `report-form-page.tsx`

4. ⏳ 最終確認
   - 開発サーバーの起動テスト
   - アプリケーションの動作確認

## 現状の問題
- [x] コンポーネントやファイルのエクスポート方式が統一されていない
- [x] 推奨される方針と異なるエクスポート方式が使用されている箇所がある
- [x] インポート文とエクスポート方式が一致していない

## 推奨される方針
1. **UIコンポーネント**: 名前付きエクスポート（export）を使用
   - [x] 対象: `src/components/ui/*` 配下のコンポーネント
   - [x] 例: `Card`, `Form`, `Button` など

2. **ページコンポーネント**: デフォルトエクスポート（export default）を使用
   - [x] 対象: `src/components/*/[name]-page.tsx` のコンポーネント
   - [x] 例: `LoginPage`, `RoomListPage`, `RoomDetailPage` など

3. **ユーティリティ関数**: 名前付きエクスポート（export）を使用
   - [x] 対象: `src/routes.tsx` など
   - [x] 例: `Routes` 関数

4. **APIクライアント関数**: 名前付きエクスポート（export）を使用
   - [x] 対象: `src/api/wordpress.ts`
   - [x] 例: `getRooms`, `getRoomDetails`, `uploadReport` など

## 修正が必要なファイル

### UIコンポーネント（名前付きエクスポートに変更）
1. `src/components/ui/card.tsx`
   - [x] `Card`
   - [x] `CardHeader`
   - [x] `CardTitle`
   - [x] `CardContent`
   - [x] `CardDescription`
   - [x] `CardFooter`

2. `src/components/ui/form.tsx`
   - [x] `Form`
   - [x] `FormField`
   - [x] `FormItem`
   - [x] `FormLabel`
   - [x] `FormControl`
   - [x] `FormMessage`

### ページコンポーネント（デフォルトエクスポートに変更）
1. `src/components/auth/login-page.tsx`
   - [x] `LoginPage`をデフォルトエクスポートに変更

2. `src/components/rooms/room-list-page.tsx`
   - [x] `RoomListPage`をデフォルトエクスポートに変更

3. `src/components/rooms/room-detail-page.tsx`
   - [x] `RoomDetailPage`をデフォルトエクスポートに変更

4. `src/components/reports/report-form-page.tsx`
   - [x] `ReportFormPage`をデフォルトエクスポートに変更

### APIクライアント（名前付きエクスポートに変更）
1. `src/api/wordpress.ts`
   - [x] `getRoomDetails`
   - [x] `getRoomCleaningHistory`
   - [x] `uploadReport`
   - [x] `uploadImage`

## 作業手順
1. [x] UIコンポーネントの修正
   - [x] 各UIコンポーネントファイルを開き、エクスポート方式を名前付きエクスポートに変更
   - [x] インポート側の修正を確認

2. [x] ページコンポーネントの修正
   - [x] 各ページコンポーネントファイルを開き、デフォルトエクスポートに変更
   - [x] インポート側の修正を確認

3. [x] APIクライアントの修正
   - [x] `wordpress.ts`を開き、すべての関数を名前付きエクスポートに変更
   - [x] インポート側の修正を確認

4. [ ] 動作確認
   - [ ] `npm run dev`を実行し、エラーが解消されたことを確認
   - [ ] アプリケーションの動作を確認

## 注意事項
- [x] 各ファイルの修正後は必ずビルドエラーを確認
- [x] インポート文の修正漏れがないか注意
- [x] 型定義のエクスポートも同様の方針で修正
- [x] コンポーネントの依存関係を考慮して修正順序を決定 