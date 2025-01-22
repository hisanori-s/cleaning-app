<?php

// プロパティ用のコントローラー
// ユーザーIDを受け取り、カスタム投稿内での登録IDと検証し、許可する物件IDを取得して一覧を返す
add_action('rest_api_init', 'register_room_list_rest_route');

function register_room_list_rest_route() {
    register_rest_route(
        'cleaning-management/v1',
        '/room-list',
        array(
            'methods' => 'GET',
            'callback' => 'get_room_list_data',
            'args' => array(
                'house_ids' => array(
                    'required' => true,
                    'type' => 'array',
                    'items' => array(
                        'type' => 'integer'
                    ),
                    'description' => '物件IDの配列'
                )
            ),
            // 'permission_callback' => 'check_api_permission'  // メインファイルの関数を使用
            'permission_callback' => '__return_true' // 認証なしで全て許可
        )
    );
}

/**
 * 部屋一覧を取得するAPI
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 * 
 * @typedef {Object} RoomListItem
 * @property {number} house_id - 物件ID
 * @property {string} house_name - 建物名
 * @property {string} room_number - 部屋番号
 * @property {string} moveout_date - 退去予定日 (ISO 8601形式)
 * @property {string} vacancy_date - 空室予定日 (ISO 8601形式)
 * @property {boolean} early_leave - 早期退去フラグ
 * @property {number} customer_id - 入居者ID
 * 
 * @returns {RoomListItem[]}
 */
function get_room_list_data($request) {
    // リクエストから物件IDの配列を取得
    $house_ids = $request->get_param('house_ids');
    
    // 指定された物件IDの物件のみ取得
    $sharehouse_list = get_posts(array(
        'post_type'   => 'sharehouse',
        'numberposts' => -1,
        'post_status' => array('publish','private'),
        'order'       => 'asc',
        'post__in'    => $house_ids
    ));

    // 空室対象の部屋情報を格納
    $return_room_list = array();

    if ($sharehouse_list) {
        foreach ($sharehouse_list as $house) {
            $house_id = $house->ID;
            $house_name = get_the_title($house_id);
            $rooms_loop = get_field('rooms', $house_id);

            if ($rooms_loop) {
                foreach ($rooms_loop as $room) {
                    $room_number = $room["number"];
                    $now_id = $room["customer-id"];
                    
                    if ($now_id) {
                        $customer_data1 = get_field('customer-data1', $now_id);
                        $move_check = $customer_data1["move-check"];
                        
                        if ($move_check) {
                            $moveout_date = $customer_data1["move-out-date"];
                            if ($moveout_date) {
                                // 日付をISO 8601形式に変換
                                $moveout_date_obj = new DateTime($moveout_date);
                                $vacancy_date_obj = clone $moveout_date_obj;
                                $vacancy_date_obj->modify('+7 days');
                                
                                // 戻り値の配列に部屋情報を追加
                                // @typedef {Object} RoomListItem
                                // @property {number} house_id - 物件ID
                                // @property {string} house_name - 建物名
                                // @property {string} room_number - 部屋番号
                                // @property {string} moveout_date - 退去予定日 (ISO 8601形式)
                                // @property {string} vacancy_date - 空室予定日 (ISO 8601形式)
                                // @property {boolean} early_leave - 早期退去フラグ
                                // @property {number} customer_id - 入居者ID
                                $return_room_list[] = array(
                                    'house_id'     => (int)$house_id,
                                    'house_name'   => (string)$house_name,
                                    'room_number'  => (string)$room_number,
                                    'moveout_date' => $moveout_date_obj->format('c'),
                                    'vacancy_date' => $vacancy_date_obj->format('c'),
                                    'early_leave'  => (bool)!empty($customer_data1["early-leave-done"]),
                                    'customer_id'  => (int)$now_id
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    // 退去日順で昇順ソート
    usort($return_room_list, function($a, $b) {
        return strcmp($a['moveout_date'], $b['moveout_date']);
    });

    // エラーチェック
    if (empty($return_room_list)) {
        return new WP_REST_Response(
            array(
                'message' => '該当する部屋情報が見つかりませんでした。',
                'data' => array()
            ),
            200,
            array('Content-Type' => 'application/json; charset=utf-8')
        );
    }

    // JSONエンコード
    return new WP_REST_Response(
        array(
            'message' => 'success',
            'data' => $return_room_list
        ),
        200,
        array('Content-Type' => 'application/json; charset=utf-8')
    );
}

/**
 * POSTMANでテストする時の情報
 * 
 * 1. エンドポイント
 * GET: https://[your-domain]/wp-json/cleaning-management/v1/room-list
 * 
 * 2. クエリパラメータ
 * house_ids: 物件IDの配列
 * 例: ?house_ids[]=1&house_ids[]=2
 * 
 * 3. レスポンス例
 * {
 *   "message": "success",
 *   "data": [
 *     {
 *       "house_id": 1,
 *       "house_name": "サンプルハウス1",
 *       "room_number": "101",
 *       "moveout_date": "2024-04-01T00:00:00+09:00",
 *       "vacancy_date": "2024-04-08T00:00:00+09:00",
 *       "early_leave": false,
 *       "customer_id": 123
 *     }
 *   ]
 * }
 * 
 * 4. エラーレスポンス例
 * {
 *   "message": "該当する部屋情報が見つかりませんでした。",
 *   "data": []
 * }
 * 
 * 5. テスト手順
 * a) WordPressの管理画面で以下を確認
 *    - シェアハウス（物件）の投稿IDを確認
 *    - 退去予定のある部屋が存在する物件を選択
 * 
 * b) POSTMANで以下をテスト
 *    - 存在する物件IDで正常系テスト
 *    - 存在しない物件IDでエラーレスポンス確認
 *    - 複数の物件IDを指定してレスポンス確認
 * 
 * 6. 注意点
 * - 日付はISO 8601形式で返却（JavaScriptのDate objectで直接パース可能）
 * - タイムゾーンは日本時間（+09:00）
 * - 空室予定日は退去予定日の7日後
 */