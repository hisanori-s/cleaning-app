<?php
/**
 * Plugin Name: Add-on_Cleaning Management API
 * Description: シェアハウス清掃管理システムのREST APIを提供するプラグイン
 * Version: 1.0.0
 * Author: Sakurai
 * License: GPL v2 or later
 */

defined('ABSPATH') or die('Direct access not allowed.');



// メインファイル：
// env.php読み込み
// 照合用関数記述
// 各エンドポイントファイル読み込み

// 各エンドポイント：
// エンドポイント返り値の作成。照合は外に投げる

// env.php：
// シークレットキー管理


// -----------------------------------------

// APIキーをチェックする関数
function verify_api_key($request) {
    $api_key = $request->get_header('X-API-Key');
    return $api_key === 'test123';
}

// -----------------------------------------

// cleaning-managementエンドポイントで認証をバイパスするフィルターを追加
add_filter('rest_authentication_errors', function($result) {
    // 特定のエンドポイントのみバイパス
    if (strpos($_SERVER['REQUEST_URI'], 'cleaning-management/v1') !== false) {
        return null;
    }
    return $result;
}, 100);

// -----------------------------------------

// CORSの設定（フックの登録）
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {

        $dev_mode = true; // 開発モード
        if ( $dev_mode === false ) {
            $allowed_domains = [
                'cleaning.aprilmoon.tokyo',
                'aprilmoon.tokyo'
            ];
    
            $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
            if (in_array($origin, $allowed_domains)) {
                header('Access-Control-Allow-Origin: ' . $origin);
            }
        }else{
            header('Access-Control-Allow-Origin: *'); //開発時はすべてのドメインを許可
        }
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-API-Key');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
});

// -----------------------------------------

// エンドポイントファイルの読み込み
// 同階層のapiディレクトリの中身を自動取得
$api_dir = plugin_dir_path(__FILE__) . 'api/';
if (is_dir($api_dir)) {
    $files = scandir($api_dir);
    foreach ($files as $file) {
        if (strpos($file, 'api-') === 0 && strpos($file, '.php') !== false) {
            require_once $api_dir . $file;
        }
    }
}
// -----------------------------------------

// ショートコードファイルの読み込み
// 同階層のshortcodeディレクトリの中身を自動取得
$shortcode_dir = plugin_dir_path(__FILE__) . 'shortcode/';
if (is_dir($shortcode_dir)) {
    $files = scandir($shortcode_dir);
    foreach ($files as $file) {
        if (strpos($file, 'code-') === 0 && strpos($file, '.php') !== false) {
            require_once $shortcode_dir . $file;
        }
    }
}