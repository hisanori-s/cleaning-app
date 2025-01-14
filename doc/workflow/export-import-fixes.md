# エクスポート/インポート修正作業計画書

## 現状の問題
- コンポーネントやファイルのエクスポート方式が統一されていない
- 推奨される方針と異なるエクスポート方式が使用されている箇所がある
- インポート文とエクスポート方式が一致していない

## 推奨される方針
1. **UIコンポーネント**: 名前付きエクスポート（export）を使用
   - 対象: `src/components/ui/*` 配下のコンポーネント
   - 例: `Card`, `Form`, `Button` など

2. **ページコンポーネント**: デフォルトエクスポート（export default）を使用
   - 対象: `src/components/*/[name]-page.tsx` のコンポーネント
   - 例: `LoginPage`, `RoomListPage`, `RoomDetailPage` など

3. **ユーティリティ関数**: 名前付きエクスポート（export）を使用
   - 対象: `src/routes.tsx` など
   - 例: `Routes` 関数

4. **APIクライアント関数**: 名前付きエクスポート（export）を使用
   - 対象: `src/api/wordpress.ts`
   - 例: `getRooms`, `getRoomDetails`, `uploadReport` など

## 修正が必要なファイル

### UIコンポーネント（名前付きエクスポートに変更）
1. `src/components/ui/card.tsx`
   - [ ] `Card`
   - [ ] `CardHeader`
   - [ ] `CardTitle`
   - [ ] `CardContent`
   - [ ] `CardDescription`
   - [ ] `CardFooter`

2. `src/components/ui/form.tsx`
   - [ ] `Form`
   - [ ] `FormField`
   - [ ] `FormItem`
   - [ ] `FormLabel`
   - [ ] `FormControl`
   - [ ] `FormMessage`

### ページコンポーネント（デフォルトエクスポートに変更）
1. `src/components/auth/login-page.tsx`
   - [ ] `LoginPage`をデフォルトエクスポートに変更

2. `src/components/rooms/room-list-page.tsx`
   - [ ] `RoomListPage`をデフォルトエクスポートに変更

3. `src/components/rooms/room-detail-page.tsx`
   - [ ] `RoomDetailPage`をデフォルトエクスポートに変更

4. `src/components/reports/report-form-page.tsx`
   - [ ] `ReportFormPage`をデフォルトエクスポートに変更

### APIクライアント（名前付きエクスポートに変更）
1. `src/api/wordpress.ts`
   - [ ] `getRoomDetails`
   - [ ] `getRoomCleaningHistory`
   - [ ] `uploadReport`
   - [ ] `uploadImage`

## 作業手順
1. UIコンポーネントの修正
   - 各UIコンポーネントファイルを開き、エクスポート方式を名前付きエクスポートに変更
   - インポート側の修正を確認

2. ページコンポーネントの修正
   - 各ページコンポーネントファイルを開き、デフォルトエクスポートに変更
   - インポート側の修正を確認

3. APIクライアントの修正
   - `wordpress.ts`を開き、すべての関数を名前付きエクスポートに変更
   - インポート側の修正を確認

4. 動作確認
   - `npm run dev`を実行し、エラーが解消されたことを確認
   - アプリケーションの動作を確認

## 注意事項
- 各ファイルの修正後は必ずビルドエラーを確認
- インポート文の修正漏れがないか注意
- 型定義のエクスポートも同様の方針で修正
- コンポーネントの依存関係を考慮して修正順序を決定 