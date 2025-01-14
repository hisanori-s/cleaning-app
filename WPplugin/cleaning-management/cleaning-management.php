<?php
/**
 * Plugin Name: Cleaning Management API
 * Description: シェアハウス清掃管理システムのREST APIを提供するプラグイン
 * Version: 1.0.0
 * Author: Sakurai
 * License: GPL v2 or later
 */

defined('ABSPATH') or die('Direct access not allowed.');

// 必要なファイルの読み込み
require_once plugin_dir_path(__FILE__) . 'includes/api/class-users-controller.php';
require_once plugin_dir_path(__FILE__) . 'includes/api/class-properties-controller.php';
require_once plugin_dir_path(__FILE__) . 'includes/api/class-reports-controller.php';
require_once plugin_dir_path(__FILE__) . 'includes/api/class-auth-controller.php';

// プラグインの初期化
function cleaning_management_init() {
    // APIコントローラーの登録
    $users_controller = new Cleaning_Management_Users_Controller();
    $users_controller->register_routes();

    $properties_controller = new Cleaning_Management_Properties_Controller();
    $properties_controller->register_routes();

    $reports_controller = new Cleaning_Management_Reports_Controller();
    $reports_controller->register_routes();

    $auth_controller = new Cleaning_Management_Auth_Controller();
    $auth_controller->register_routes();
}

// REST APIの初期化時にプラグインを初期化
add_action('rest_api_init', 'cleaning_management_init');

// プラグイン有効化時の処理
register_activation_hook(__FILE__, 'cleaning_management_activate');
function cleaning_management_activate() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    
    // 物件テーブル
    $properties_table = $wpdb->prefix . 'cleaning_properties';
    $sql = "CREATE TABLE IF NOT EXISTS $properties_table (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        address text NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    
    // 部屋テーブル
    $rooms_table = $wpdb->prefix . 'cleaning_rooms';
    $sql .= "CREATE TABLE IF NOT EXISTS $rooms_table (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        property_id bigint(20) NOT NULL,
        room_number varchar(50) NOT NULL,
        vacancy_date date NOT NULL,
        cleaning_deadline date NOT NULL,
        room_key_number varchar(50) NOT NULL,
        entrance_key_number varchar(50) NOT NULL,
        notes text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        FOREIGN KEY (property_id) REFERENCES $properties_table(id)
    ) $charset_collate;";
    
    // レポートテーブル
    $reports_table = $wpdb->prefix . 'cleaning_reports';
    $sql .= "CREATE TABLE IF NOT EXISTS $reports_table (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        room_id bigint(20) NOT NULL,
        staff_id bigint(20) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        FOREIGN KEY (room_id) REFERENCES $rooms_table(id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// プラグイン無効化時の処理
register_deactivation_hook(__FILE__, 'cleaning_management_deactivate');
function cleaning_management_deactivate() {
    // 必要に応じて無効化時の処理を追加
} 