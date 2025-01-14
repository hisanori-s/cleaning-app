<?php
class Cleaning_Management_Users_Controller extends WP_REST_Controller {
    public function __construct() {
        $this->namespace = 'cleaning-management/v1';
        $this->rest_base = 'users';
    }

    // APIルートの登録
    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/me', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_current_user'],
                'permission_callback' => [$this, 'get_current_user_permissions_check'],
            ],
        ]);
    }

    // 現在のユーザー情報を取得
    public function get_current_user($request) {
        // JWTトークンからユーザーIDを取得
        $user_id = get_current_user_id();
        if (!$user_id) {
            return new WP_Error(
                'rest_not_logged_in',
                'ログインが必要です',
                ['status' => 401]
            );
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
            return new WP_Error(
                'rest_staff_not_found',
                '清掃業者情報が見つかりません',
                ['status' => 404]
            );
        }

        $staff = $staff[0];
        $login_id = get_post_meta($staff->ID, 'login_id', true);
        $allowed_properties = get_post_meta($staff->ID, 'allowed_properties', true);
        $allowed_properties = $allowed_properties ? explode(',', $allowed_properties) : [];

        return new WP_REST_Response([
            'id' => $staff->ID,
            'name' => $staff->post_title,
            'login_id' => $login_id,
            'allowed_properties' => array_map('intval', $allowed_properties),
        ], 200);
    }

    // アクセス権限のチェック
    public function get_current_user_permissions_check($request) {
        return current_user_can('read');
    }
} 