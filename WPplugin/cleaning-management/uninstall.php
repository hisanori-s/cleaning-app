<?php
// プラグインがWordPressから直接呼び出されていない場合は終了
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

// データベーステーブルの削除
global $wpdb;
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}cleaning_reports");
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}cleaning_rooms");
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}cleaning_properties");

// カスタムオプションの削除
delete_option('cleaning_management_jwt_secret'); 