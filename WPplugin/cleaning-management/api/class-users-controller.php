<?php
add_action('rest_api_init', 'register_users_rest_route');

function register_users_rest_route() {
    register_rest_route(
        'cleaning-management/v1',
        '/users',
        array(
            'methods' => 'GET',
            'callback' => 'get_users_data',
            // 'permission_callback' => 'check_api_permission'  // メインファイルの関数を使用
            'permission_callback' => '__return_true' // 認証なしで全て許可
        )
    );
}

function get_users_data() {
    // ユーザーデータの取得と返却処理
    // 返り値を生成
    // user-cleanerのカスタムフィールド配列を取得
        // ユーザーの一覧を取得
        $users_array = get_posts(array(
            'post_type' => 'cleaner',
            'posts_per_page' => -1
        ));

        $return_array = array();
        foreach ($users_array as $user) {
            $post_id = $user->ID;
            $login_id = get_field('login-id', $post_id);
            $password = get_field('password', $post_id);
            $house_ids = get_field('house-id', $post_id);
            $name = get_field('display-name', $post_id);

            $return_array[] = array(
                'login_id' => $login_id,
                'password' => $password,
                'house_ids' => $house_ids,
                'name' => $name
            );
        }
        // JSONエンコード（WordPressのREST APIに準拠し、適切なJSONヘッダーを付与）
        return new WP_REST_Response($return_array, 200, array(
            'Content-Type' => 'application/json; charset=utf-8'
        ));
}