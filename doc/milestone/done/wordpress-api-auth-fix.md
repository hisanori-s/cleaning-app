# WordPress API 認証エラー解決計画 2.0

## 現状の問題と新しい発見

### アクセスパターン別の挙動
1. ブラウザ直接アクセス → 成功
   - エンドポイントに直接アクセスして表示可能
   - WordPressのデフォルト認証をバイパスしている可能性

2. フロントエンド（React）アクセス → 401エラー
   - エラーメッセージ: "認証されたユーザーのみ REST API にアクセスできます。"
   - カスタム認証よりも先にWordPressのデフォルト認証で弾かれている

3. Postmanアクセス → 401エラー
   - エラーメッセージ: "認証されたユーザーのみ REST API にアクセスできます。"
   - フロントエンドと同じエラー
   - WordPressのデフォルト認証で弾かれている

### 重要な気づき
1. エラーメッセージの出所
   - "認証されたユーザーのみ REST API にアクセスできます。"は、カスタム認証（check_api_permission）からのメッセージではない
   - WordPressのコアが提供するrest_authentication_errorsフィルターの前段階でブロックされている

2. 認証レイヤーの順序
   ```
   リクエスト
   ↓
   1. WordPressコアの認証チェック ← 現在ここでブロック
   ↓
   2. rest_authentication_errorsフィルター
   ↓
   3. カスタム認証（check_api_permission）
   ↓
   レスポンス
   ```

3. ログ出力の問題
   - WordPress側でログが出ていない → カスタム認証まで到達していない
   - フロントエンドのログも最小限 → エラーハンドリングの改善が必要

## 目指すべき挙動

1. アクセス制御
   - 開発環境：全てのアクセスを許可
   - 本番環境：Bearer認証による制御

2. エラーハンドリング
   - 詳細なエラーメッセージ
   - デバッグに役立つログ出力

3. セキュリティ
   - 適切なCORS設定
   - 本番環境での厳格な認証

## 修正計画

### 1. WordPressコアの認証バイパス
```php
// wp-config.phpに追加
define('REST_API_ALLOW_ANONYMOUS', true);
```

### 2. REST API認証フィルターの修正
```php
add_filter('rest_authentication_errors', function($result) {
    // プリフライトリクエストは常に許可
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        return true;
    }

    // cleaning-management/v1エンドポイントの場合
    if (strpos($_SERVER['REQUEST_URI'], 'cleaning-management/v1') !== false) {
        // 開発環境の場合
        if (is_development_environment()) {
            return true;
        }
        // 本番環境の場合はカスタム認証を実行
        return check_api_permission();
    }

    // その他のエンドポイントはデフォルトの動作
    return $result;
}, 0);  // 優先度を0に設定して早期実行
```

### 3. カスタム認証の改善
```php
function check_api_permission() {
    $auth_header = null;
    
    // 1. Apache mod_rewriteヘッダー
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    }
    // 2. Apache CGI/FastCGIヘッダー
    elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    // 3. その他のヘッダー
    else {
        foreach ($_SERVER as $key => $value) {
            if (substr($key, -18) === 'HTTP_AUTHORIZATION') {
                $auth_header = $value;
                break;
            }
        }
    }

    error_log('Authorization Header: ' . ($auth_header ?? 'not found'));

    if (empty($auth_header)) {
        return new WP_Error(
            'rest_forbidden',
            'Authorization header is missing',
            array('status' => 401)
        );
    }

    // Bearer認証の検証
    if (strpos($auth_header, 'Bearer ') !== 0) {
        return new WP_Error(
            'rest_forbidden',
            'Invalid authorization header format',
            array('status' => 401)
        );
    }

    $token = substr($auth_header, 7);
    $expected_token = get_cleaning_management_config('api_secret');

    if ($token !== $expected_token) {
        return new WP_Error(
            'rest_forbidden',
            'Invalid authorization token',
            array('status' => 401)
        );
    }

    return true;
}
```

### 4. フロントエンドの改善
```typescript
private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_SECRET}`
    };
    
    // デバッグ用にヘッダーを出力
    console.log('Request Headers:', headers);
    
    return headers;
}
```

## 実装手順

1. WordPressコアの設定
   - [ ] wp-config.phpの修正
   - [ ] 開発環境フラグの確認

2. プラグインの修正
   - [ ] REST認証フィルターの優先度変更
   - [ ] 認証ヘッダー取得ロジックの改善
   - [ ] デバッグログの強化

3. フロントエンドの修正
   - [ ] ヘッダー設定の確認
   - [ ] エラーハンドリングの改善
   - [ ] デバッグログの追加

4. 動作確認
   - [ ] 各アクセスパターンでのテスト
   - [ ] ログ出力の確認
   - [ ] エラーメッセージの確認

## 期待される結果

1. 全てのアクセスパターンで認証成功
2. 詳細なデバッグ情報の出力
3. 明確なエラーメッセージ

## 注意事項

1. セキュリティ
   - 開発環境と本番環境の設定を明確に分離
   - 認証情報の適切な管理

2. デバッグ
   - 各段階でのログ出力
   - エラーの詳細な記録

3. 保守性
   - コードの整理と文書化
   - 設定の一元管理 