# モックデータ構成

このディレクトリには、テストで使用するモックデータが格納されています。
開発初期段階では、本番環境でもこれらのモックデータを利用します。

## ディレクトリ構造

```
mocks/
  ├── api/              # APIレスポンスのモックデータ
  │   ├── auth.json     # 認証関連のモックデータ
  │   ├── properties-rooms.json  # 物件・部屋情報のモックデータ
  │   ├── room-detail.json      # 部屋詳細情報のモックデータ/物件情報もコレに一緒に入れて取得にする
  │   └── reports.json          # 清掃レポートのモックデータ
  └── README-mock.md    # 本ドキュメント
```

## モックデータの説明

### auth.json
- **目的**: 認証機能のテスト用モックデータ
- **使用シーン**:
  - ログイン機能のテスト
  - ユーザー認証状態の検証
  - 物件アクセス権限の確認
- **データ構造**:
  - `mock_users`: テストユーザーの配列
    - `login_id`: ログインID
    - `password`: パスワード
    - `username`: ユーザー表示名
    - `role`: ユーザー権限（cleaner等）
    - `allowed_properties`: アクセス可能な物件IDの配列
- **関連コンポーネント**:
  - LoginPage
  - useAuth Hook
  - AuthProvider

### properties-rooms.json
- **目的**: 部屋一覧表示のテスト用モックデータ
- **使用シーン**:
  - RoomListBoxコンポーネントのテスト
  - 物件一覧表示のテスト
  - ユーザー権限に基づく表示制御のテスト
- **データ構造**:
  - `mock_rooms_list`: 部屋情報の配列
    - `property_id`: 物件ID（認証ユーザーの許可された物件IDと照合）
    - `property_name`: 物件名
    - `room_number`: 部屋番号
    - `vacancy_date`: 空室予定日
    - `cleaning_deadline`: 清掃期限
    - `status`: ステータス（urgent/normal/overdue）
- **関連コンポーネント**:
  - RoomListBox
  - RoomCard
  - DashboardPage

### room-detail.json
- **目的**: 部屋詳細情報のテスト用モックデータ
- **使用シーン**:
  - 部屋詳細表示のテスト
  - 清掃情報の表示テスト
- **データ構造**:
  - `mock_room_detail`: 部屋詳細情報
    - `id`: 部屋ID
    - `property_id`: 物件ID
    - `property_name`: 物件名
    - `property_address`: 物件住所
    - `room_number`: 部屋番号
    - `vacancy_date`: 空室予定日
    - `cleaning_deadline`: 清掃期限
    - `room_key_number`: 部屋の鍵番号
    - `entrance_key_number`: エントランスの鍵番号
    - `notes`: 清掃上の注意事項
- **関連コンポーネント**:
  - RoomDetailPage
  - CleaningInstructionCard

### reports.json
- **目的**: 清掃レポートのテスト用モックデータ
- **使用シーン**:
  - 清掃レポート送信のテスト
  - レポート履歴表示のテスト
- **データ構造**:
  - `mock_report_response`: レポート情報
    - `id`: レポートID
    - `room_id`: 部屋ID
    - `staff_id`: スタッフID
    - `created_at`: 作成日時
    - `status`: ステータス
    - `message`: レポートメッセージ
- **関連コンポーネント**:
  - ReportForm
  - ReportHistoryList

## 使用上の注意

1. **環境変数の設定**
   - テスト環境: `.env.test`でモックデータのパスを指定
   - 開発環境: 開発初期段階ではテストと同じモックデータを使用

2. **データの更新**
   - モックデータを更新する際は、関連するテストケースも確認
   - 型定義（`src/__tests__/mocks/types.ts`）も適宜更新

3. **本番環境への移行**
   - 本番APIへの移行時は、モックデータと同じ構造のレスポンスを返すように実装
   - 段階的な移行を推奨 