<?php
/**
 * Plugin Name: Cleaning Management API
 * Description: シェアハウス清掃管理システムのREST APIを提供するプラグイン
 * Version: 1.0.0
 * Author: Sakurai
 * License: GPL v2 or later
 */

defined('ABSPATH') or die('Direct access not allowed.');

// 開発環境判定関数
function is_development_environment() {
    // 複数の条件で開発環境を判定
    $is_dev = (
        (defined('WP_DEBUG') && WP_DEBUG) ||
        (defined('WP_ENV') && WP_ENV === 'development') ||
        get_cleaning_management_config('is_development')
    );
    error_log('Development Environment Check: ' . ($is_dev ? 'true' : 'false'));
    return $is_dev;
}

// CORS対応の改善
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        // 開発環境のオリジンを許可
        $allowed_origins = array(
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://staging.aprilmoon.tokyo'
        );
        
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        error_log('Request Origin: ' . $origin);
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            header('Access-Control-Allow-Origin: https://staging.aprilmoon.tokyo');
        }
        
        // プリフライトリクエストのサポート
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 3600');
        
        // プリフライトリクエストの場合は早期リターン
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            error_log('Preflight Request Detected - Returning 200');
            status_header(200);
            exit();
        }
        
        return $value;
    });
});

// REST API認証設定の調整
add_filter('rest_authentication_errors', function($result) {
    error_log('REST Authentication Check - Request Method: ' . $_SERVER['REQUEST_METHOD']);
    error_log('REST Authentication Check - Request URI: ' . $_SERVER['REQUEST_URI']);
    
    // プリフライトリクエストは常に許可
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        error_log('Preflight Request - Skipping Authentication');
        return true;
    }
    
    // cleaning-management/v1 のエンドポイントの場合
    if (strpos($_SERVER['REQUEST_URI'], 'cleaning-management/v1') !== false) {
        if (is_development_environment()) {
            error_log('Development Environment - Skipping Authentication');
            return true;
        }
        
        error_log('Production Environment - Checking Authentication');
        return check_api_permission(rest_get_server()->get_raw_data());
    }
    
    return $result;
});

// メインファイル：
// env.php読み込み
// 照合用関数記述
// 各エンドポイントファイル読み込み

// 各エンドポイント：
// エンドポイント返り値の作成。照合は外に投げる

// env.php：
// シークレットキー管理


// 環境設定ファイルからシークレットキーを取得する
function get_cleaning_management_config($key = null) {
    static $config = null;
    if ($config === null) {
        // 環境設定ファイルの読み込み処理を直接ここに組み込む
        $env_file = plugin_dir_path(__FILE__) . 'env.php';
        if (file_exists($env_file)) {
            $config = include $env_file;
        } else {
            $config = ['api_secret' => ''];
            error_log('Cleaning Management Plugin: env.php file not found.');
        }
    }
    
    // 設定値の返却
    if ($key === null) {
        return $config;
    }
    return isset($config[$key]) ? $config[$key] : null;
}

// 共用の認証チェック関数の改善
function check_api_permission($request) {
    // WordPressのリクエストオブジェクトからヘッダーを取得
    $wp_request = rest_get_server()->get_raw_data();
    $auth_header = $wp_request->get_header('authorization');
    
    error_log('Auth Header Detection:');
    error_log('- WP Request Header: ' . $auth_header);
    
    // フォールバック1: 直接$_SERVERから取得
    if (empty($auth_header)) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        error_log('- Fallback 1 (SERVER): ' . $auth_header);
    }
    
    // フォールバック2: Apache特有のヘッダー
    if (empty($auth_header) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        error_log('- Fallback 2 (REDIRECT): ' . $auth_header);
    }
    
    error_log('Final Auth Header: ' . $auth_header);
    
    if (empty($auth_header) || strpos($auth_header, 'Bearer ') !== 0) {
        error_log('Auth Failed: Invalid header format or empty header');
        return new WP_Error(
            'rest_forbidden',
            'Authorization header is required (Bearer token)',
            array('status' => 401)
        );
    }

    $provided_secret = trim(substr($auth_header, 7));
    $stored_secret = get_cleaning_management_config('api_secret');
    
    error_log('Secret Comparison:');
    error_log('- Provided Length: ' . strlen($provided_secret));
    error_log('- Stored Length: ' . strlen($stored_secret));
    error_log('- Match: ' . ($provided_secret === $stored_secret ? 'true' : 'false'));
    
    if ($provided_secret !== $stored_secret) {
        error_log('Auth Failed: Invalid token');
        return new WP_Error(
            'rest_forbidden',
            'Invalid authorization token',
            array('status' => 401)
        );
    }
    
    error_log('Auth Success');
    return true;
}

// エンドポイントファイルの読み込み
// 同階層のapiディレクトリの中身を自動取得
$api_dir = plugin_dir_path(__FILE__) . 'api/';
if (is_dir($api_dir)) {
    $files = scandir($api_dir);
    foreach ($files as $file) {
        if (strpos($file, 'class-') === 0 && strpos($file, '.php') !== false) {
            require_once $api_dir . $file;
        }
    }
}