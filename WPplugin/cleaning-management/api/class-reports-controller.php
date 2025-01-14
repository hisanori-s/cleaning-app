<?php
class Cleaning_Management_Reports_Controller extends WP_REST_Controller {
    public function __construct() {
        $this->namespace = 'cleaning-management/v1';
        $this->rest_base = 'reports';
    }

    // APIルートの登録
    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_item'],
                'permission_callback' => [$this, 'create_item_permissions_check'],
            ],
        ]);
    }

    // 新規レポートの作成（仮実装）
    public function create_item($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'cleaning_reports';
        
        // ユーザーが物件にアクセスできるか確認
        $room_id = intval($request['room_id']);
        $property_id = $this->get_property_id_by_room($room_id);
        
        if (!$this->can_access_property($property_id)) {
            return new WP_Error(
                'rest_forbidden',
                'この物件にアクセスする権限がありません',
                ['status' => 403]
            );
        }

        // 清掃業者情報を取得
        $staff = $this->get_current_staff();
        if (is_wp_error($staff)) {
            return $staff;
        }

        // レポートの作成（仮実装）
        $result = $wpdb->insert(
            $table_name,
            [
                'room_id' => $room_id,
                'staff_id' => $staff->ID,
            ],
            ['%d', '%d']
        );

        if (!$result) {
            return new WP_Error(
                'rest_db_error',
                'データベースエラーが発生しました',
                ['status' => 500]
            );
        }

        return new WP_REST_Response([
            'id' => $wpdb->insert_id,
            'message' => 'レポートが作成されました',
        ], 201);
    }

    // 部屋IDから物件IDを取得
    private function get_property_id_by_room($room_id) {
        global $wpdb;
        $rooms_table = $wpdb->prefix . 'cleaning_rooms';
        
        return $wpdb->get_var($wpdb->prepare(
            "SELECT property_id FROM $rooms_table WHERE id = %d",
            $room_id
        ));
    }

    // ユーザーが物件にアクセスできるか確認
    private function can_access_property($property_id) {
        if (!$property_id) {
            return false;
        }

        $staff = $this->get_current_staff();
        if (is_wp_error($staff)) {
            return false;
        }

        $allowed_properties = get_post_meta($staff->ID, 'allowed_properties', true);
        if (!$allowed_properties) {
            return false;
        }

        $allowed_properties = explode(',', $allowed_properties);
        return in_array($property_id, array_map('intval', $allowed_properties));
    }

    // 現在のユーザーの清掃業者情報を取得
    private function get_current_staff() {
        $user_id = get_current_user_id();
        if (!$user_id) {
            return new WP_Error(
                'rest_not_logged_in',
                'ログインが必要です',
                ['status' => 401]
            );
        }

        $staff = get_posts([
            'post_type' => 'cleaning_staff',
            'meta_query' => [
                [
                    'key' => 'user_id',
                    'value' => $user_id,
                    'compare' => '=',
                ],
            ],
            'posts_per_page' => 1,
        ]);

        if (empty($staff)) {
            return new WP_Error(
                'rest_staff_not_found',
                '清掃業者情報が見つかりません',
                ['status' => 404]
            );
        }

        return $staff[0];
    }

    // アクセス権限のチェック
    public function create_item_permissions_check($request) {
        return current_user_can('edit_posts');
    }
} 