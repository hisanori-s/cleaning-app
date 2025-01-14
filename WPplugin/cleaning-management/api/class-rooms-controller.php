<?php
class Cleaning_Management_Rooms_Controller extends WP_REST_Controller {
    public function __construct() {
        $this->namespace = 'cleaning-management/v1';
        $this->rest_base = 'rooms';
    }

    // APIルートの登録
    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_items'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_item'],
                'permission_callback' => [$this, 'create_item_permissions_check'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_item'],
                'permission_callback' => [$this, 'get_item_permissions_check'],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_item'],
                'permission_callback' => [$this, 'update_item_permissions_check'],
            ],
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'delete_item'],
                'permission_callback' => [$this, 'delete_item_permissions_check'],
            ],
        ]);
    }

    // 部屋一覧の取得
    public function get_items($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cleaning_rooms';
        
        $items = $wpdb->get_results("SELECT * FROM $table_name ORDER BY floor, room_number");
        return new WP_REST_Response($items, 200);
    }

    // 特定の部屋の取得
    public function get_item($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cleaning_rooms';
        
        $item = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $request['id'])
        );

        if (empty($item)) {
            return new WP_Error('not_found', '部屋が見つかりません', ['status' => 404]);
        }

        return new WP_REST_Response($item, 200);
    }

    // 新規部屋の作成
    public function create_item($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cleaning_rooms';
        
        $result = $wpdb->insert(
            $table_name,
            [
                'name' => sanitize_text_field($request['name']),
                'floor' => intval($request['floor']),
                'room_number' => sanitize_text_field($request['room_number']),
            ],
            ['%s', '%d', '%s']
        );

        if (!$result) {
            return new WP_Error('db_error', 'データベースエラーが発生しました', ['status' => 500]);
        }

        $item = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $wpdb->insert_id)
        );

        return new WP_REST_Response($item, 201);
    }

    // 部屋情報の更新
    public function update_item($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cleaning_rooms';
        
        $result = $wpdb->update(
            $table_name,
            [
                'name' => sanitize_text_field($request['name']),
                'floor' => intval($request['floor']),
                'room_number' => sanitize_text_field($request['room_number']),
            ],
            ['id' => $request['id']],
            ['%s', '%d', '%s'],
            ['%d']
        );

        if ($result === false) {
            return new WP_Error('db_error', 'データベースエラーが発生しました', ['status' => 500]);
        }

        $item = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $request['id'])
        );

        return new WP_REST_Response($item, 200);
    }

    // 部屋の削除
    public function delete_item($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cleaning_rooms';
        
        $result = $wpdb->delete(
            $table_name,
            ['id' => $request['id']],
            ['%d']
        );

        if (!$result) {
            return new WP_Error('db_error', 'データベースエラーが発生しました', ['status' => 500]);
        }

        return new WP_REST_Response(null, 204);
    }

    // アクセス権限のチェック
    public function get_items_permissions_check($request) {
        return current_user_can('read');
    }

    public function get_item_permissions_check($request) {
        return current_user_can('read');
    }

    public function create_item_permissions_check($request) {
        return current_user_can('edit_posts');
    }

    public function update_item_permissions_check($request) {
        return current_user_can('edit_posts');
    }

    public function delete_item_permissions_check($request) {
        return current_user_can('delete_posts');
    }
} 