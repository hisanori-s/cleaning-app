<?php
/**
 * Plugin Name: Cleaning Management API
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

// 共用の認証チェック関数
function check_api_permission($request) {
    $auth_header = $request->get_header('Authorization'); // リクエストからAuthorizationヘッダーを取得
    if (empty($auth_header) || strpos($auth_header, 'Bearer ') !== 0) {
        return false;                                    // ヘッダーがないか形式が違えばfalse
    }

    $provided_secret = trim(substr($auth_header, 7));    // 'Bearer 'の後ろの部分を取得
    $stored_secret = get_cleaning_management_config('api_secret'); // env.phpの設定値を取得

    return $provided_secret === $stored_secret;          // 両者を比較して結果を返す
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