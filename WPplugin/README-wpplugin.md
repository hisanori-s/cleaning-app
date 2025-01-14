# シェアハウス清掃管理システム - WordPressプラグイン

このプラグインは、シェアハウス清掃管理システムのフロントエンドアプリケーションに必要なREST APIエンドポイントを提供します。

## 機能概要

- カスタムREST APIエンドポイントの提供
- データベーステーブルの管理

## ディレクトリ構造

```
WPplugin/
├── cleaning-management/          # プラグインのメインディレクトリ
│   ├── api/                     # APIコントローラー
│   │   ├── class-auth-controller.php     # 認証API
│   │   ├── class-properties-controller.php # 物件API
│   │   ├── class-reports-controller.php    # レポートAPI
│   │   └── class-users-controller.php      # ユーザーAPI
│   └── cleaning-management.php  # プラグインのメインファイル
└── README-wpplugin.md          # 本ドキュメント
```

## 提供するAPI一覧

### 認証
- `POST /wp-json/cleaning-management/v1/auth/login`
  - リクエストボディ：
    - login_id: ログインID
    - password: パスワード
  - レスポンス：
    - post_id: 清掃業者ID
    - login_id: 清掃業者ID
    - name: 清掃業者名
    - allowed_properties: 閲覧許可されている物件のID一覧

### 清掃対象物件の部屋情報一覧
- `GET /wp-json/cleaning-management/v1/properties/{property_id}/rooms`
  - レスポンス：
    - 物件ID
    - 部屋番号
    - 空室予定日
    - 清掃完了期限

### 清掃対象部屋の詳細情報
- `GET /wp-json/cleaning-management/v1/properties/{property_id}/rooms/{room_id}`
  - レスポンス：
    - 物件ID
    - 部屋番号
    - 空室予定日
    - 清掃完了期限
    - 部屋の鍵番号
    - 玄関の鍵番号
    - 清掃業者への伝言

### 清掃完了報告
- `POST /wp-json/cleaning-management/v1/reports`
  - 仕様は後日決定

## データベース構造

### カスタムテーブル
- `wp_cleaning_properties` - 物件情報
  - id: 物件ID
  - name: 物件名
  - address: 住所

- `wp_cleaning_rooms` - 部屋情報
  - id: 部屋ID
  - property_id: 物件ID
  - room_number: 部屋番号
  - vacancy_date: 空室予定日
  - cleaning_deadline: 清掃完了期限
  - room_key_number: 部屋の鍵番号
  - entrance_key_number: 玄関の鍵番号
  - notes: 清掃業者への伝言

- `wp_cleaning_reports` - 清掃レポート
  - id: レポートID
  - room_id: 部屋ID
  - staff_id: 清掃業者ID
  - created_at: 作成日時
  - （その他の項目は後日決定）

## 注意事項

- このプラグインはWordPress 6.0以上で動作確認しています
- REST APIを使用するため、パーマリンク設定が必要です
- 本番環境にデプロイする前に、セキュリティ設定を確認してください 