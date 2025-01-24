# 清掃レポート詳細機能の実装計画書

## 概要
清掃レポート一覧から詳細表示機能を実装する。現在はプレースホルダーのみの状態から、実際のAPIと連携して詳細情報を表示する機能を追加する。

## 前提条件
- レポート一覧機能は既に実装済み
- 詳細情報取得用のエンドポイント(api-report-detail.php)は実装済み
- レポートIDを渡して情報を取得する仕組みを採用
- 詳細ページへの遷移時に都度APIを叩く（キャッシュなし）
- ビフォーアフター画像は左右に並べて比較表示

## 実装タスク

### 1. API連携の実装
- [x] WordPressのエンドポイントの確認と型定義の整備
  - `src/types/report-detail.ts`の型定義を確認
  - レスポンス型の定義を追加

### 2. APIクライアントの実装
- [x] `src/api/wordpress.ts`にレポート詳細取得メソッドを追加
  - エンドポイント: `/wp-json/cleaning-management/v1/report-detail`
  - パラメータ: レポートID

### 3. カスタムフックの実装
- [x] `src/hooks/report/use-cleaning-report-detail.ts`の作成
  - レポート詳細データの取得ロジック
  - ローディング状態の管理
  - エラーハンドリング

### 4. UIコンポーネントの実装
- [x] `src/components/report/report-detail.tsx`の実装
  - ローディング表示の追加
  - エラー表示の追加
  - ビフォーアフター画像の比較表示レイアウト
  - レポート詳細情報の表示

### 5. ページコンポーネントの実装
- [x] `src/pages/report/page.tsx`の更新
  - レポート詳細の表示ロジック統合
  - 一覧と詳細の表示切り替え

## 実装の注意点
- ファイルパスは既存のものを維持
- ビジネスロジックは`src/lib/report`に集約
- UIコンポーネントにはビジネスロジックを含めない
- エラーハンドリングを適切に実装

## 完了条件
- [x] レポート一覧から詳細表示への遷移が正常に動作
- [x] APIから取得したデータが正しく表示される
- [x] ビフォーアフター画像が左右に並んで表示される
- [x] ローディング状態が適切に表示される
- [x] エラー時の表示が適切に行われる

## コミットメッセージ案
```
feat: implement cleaning report detail feature

- Add API client for fetching report details
- Create custom hook for report detail management
- Update report detail component with actual data
- Implement before/after image comparison view
- Add loading and error states
``` 