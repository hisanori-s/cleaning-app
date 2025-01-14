<?php
class Cleaning_Management_Properties_Controller extends WP_REST_Controller {
    public function __construct() {
        $this->namespace = 'cleaning-management/v1';
        $this->rest_base = 'properties';
    }

    // APIルートの登録
    public function register_routes() {
        // 物件ごとの部屋一覧を取得
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<property_id>[\d]+)/rooms', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_property_rooms'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
            ],
        ]);

        // 特定の部屋の詳細情報を取得
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<property_id>[\d]+)/rooms/(?P<room_id>[\d]+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_room_detail'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
            ],
        ]);
    }

    // 物件ごとの部屋一覧を取得
    public function get_property_rooms($request) {
        global $wpdb;
        $property_id = intval($request['property_id']);

        // ユーザーが物件にアクセスできるか確認
        if (!$this->can_access_property($property_id)) {
            return new WP_Error(
                'rest_forbidden',
                'この物件にアクセスする権限がありません',
                ['status' => 403]
            );
        }

        $rooms_table = $wpdb->prefix . 'cleaning_rooms';
        $query = $wpdb->prepare(
            "SELECT id, room_number, vacancy_date, cleaning_deadline 
             FROM $rooms_table 
             WHERE property_id = %d 
             ORDER BY room_number",
            $property_id
        );

        $items = $wpdb->get_results($query);
        if ($items === null) {
            return new WP_Error(
                'rest_db_error',
                'データベースエラーが発生しました',
                ['status' => 500]
            );
        }

        return new WP_REST_Response($items, 200);
    }

    // 特定の部屋の詳細情報を取得
    public function get_room_detail($request) {
        global $wpdb;
        $property_id = intval($request['property_id']);
        $room_id = intval($request['room_id']);

        // ユーザーが物件にアクセスできるか確認
        if (!$this->can_access_property($property_id)) {
            return new WP_Error(
                'rest_forbidden',
                'この物件にアクセスする権限がありません',
                ['status' => 403]
            );
        }

        $rooms_table = $wpdb->prefix . 'cleaning_rooms';
        $properties_table = $wpdb->prefix . 'cleaning_properties';
        
        $query = $wpdb->prepare(
            "SELECT r.*, p.name as property_name, p.address as property_address 
             FROM $rooms_table r 
             JOIN $properties_table p ON r.property_id = p.id 
             WHERE r.property_id = %d AND r.id = %d",
            $property_id,
            $room_id
        );

        $item = $wpdb->get_row($query);
        if ($item === null) {
            return new WP_Error(
                'rest_not_found',
                '部屋が見つかりません',
                ['status' => 404]
            );
        }

        return new WP_REST_Response($item, 200);
    }

    // ユーザーが物件にアクセスできるか確認
    private function can_access_property($property_id) {
        $user_id = get_current_user_id();
        if (!$user_id) {
            return false;
        }

        // 清掃業者情報を取得
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
            return false;
        }

        $allowed_properties = get_post_meta($staff[0]->ID, 'allowed_properties', true);
        if (!$allowed_properties) {
            return false;
        }

        $allowed_properties = explode(',', $allowed_properties);
        return in_array($property_id, array_map('intval', $allowed_properties));
    }

    // アクセス権限のチェック
    public function get_items_permissions_check($request) {
        return current_user_can('read');
    }
} 