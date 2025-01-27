<?php

// 部屋詳細取得用
// 物件IDをと部屋番号取得して配列を返す
add_action('rest_api_init', 'register_room_detail_rest_route');

function register_room_detail_rest_route()
{
    register_rest_route(
        'cleaning-management/v1',
        '/room-detail',
        array(
            'methods' => 'GET',
            'callback' => 'get_room_detail_data',
            'args' => array(
                'house_id' => array(
                    'required' => true,
                    'type' => 'integer',
                    'description' => '物件ID'
                ),
                'room_number' => array(
                    'required' => true,
                    'type' => 'string',
                    'description' => '部屋番号'
                )
            ),
            'permission_callback' => 'verify_api_key'
        )
    );
}
/**
 * 部屋詳細を取得するAPI
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 * 
 * @typedef {Object} RoomDetailItem
 * @property {number} house_id - 物件ID
 * @property {string} house_name - 建物名
 * @property {string} room_number - 部屋番号
 * @property {string} moveout_date - 退去予定日 (ISO 8601形式)
 * @property {string} vacancy_date - 空室予定日 (ISO 8601形式)
 * @property {boolean} early_leave - 早期退去フラグ
 * @property {Object} status_label - ステータスラベル
 * @property {string} status_label.color - ラベルの色
 * @property {string} status_label.text - ラベルのテキスト
 * @property {string} room_key - 個室鍵番号
 * @property {string} building_key - 建物鍵番号
 * @property {string} address - 建物住所
 * @property {string} cleaner_note - 業者向けメッセージ
 * 
 * @returns {RoomDetailItem}
 */
function get_room_detail_data($request)
{
    $house_id = $request->get_param('house_id');
    $target_room_number = $request->get_param('room_number');
    $target_room_id = 0; //部屋IDは未実装なので０で記録
    
    // 指定された物件を取得
    $house = get_post($house_id);

    if (!$house || $house->post_type !== 'sharehouse') {
        return new WP_REST_Response(
            array(
                'message' => '指定された物件が見つかりません。',
                'data' => null
            ),
            404,
            array('Content-Type' => 'application/json; charset=utf-8')
        );
    }

    $house_name = get_the_title($house_id);
    $rooms_loop = get_field('rooms', $house_id);
    $room_detail = null;

    if ($rooms_loop) {
        foreach ($rooms_loop as $room) {

            if ($room["number"] != $target_room_number) {
                // 対象の部屋以外はスキップ
                continue;
            }
            $now_id = $room["customer-id"];
            $room_key = $room["room-key"] ? $room["room-key"] : 'なし';

            $customer_data1 = get_field('customer-data1', $now_id);
            $move_check = $customer_data1["move-check"];

            if ($move_check) {
                $moveout_date = $now_id ? $customer_data1["move-out-date"] : false;
                // ステータスラベルの判定
                $status_label = array();

                if ($moveout_date) {
                    $moveout_date_obj = new DateTime($moveout_date);
                    $vacancy_date_obj = clone $moveout_date_obj;
                    $vacancy_date_obj->modify('+7 days');

                    $now = new DateTime();
                    $now->setTime(0, 0, 0);

                    if ($moveout_date_obj >= $now) {
                        $status_label = array(
                            'color' => '#888888',
                            'text' => '退去予定'
                        );
                    } elseif ($now > $moveout_date_obj && $now <= $vacancy_date_obj) {
                        $status_label = array(
                            'color' => '#44BB44',
                            'text' => '入室可能'
                        );
                    } else {
                        $status_label = array(
                            'color' => '#FF4444',
                            'text' => '期限超過'
                        );
                    }
                }
            }
            // 追加の建物情報を取得
            $building_key = get_field('unlock', $house_id);
            $address = get_field('address', $house_id)[0]['address-closed'] ?? "";
            $garbage_table = get_field('garbage-table', $house_id);
            $cleaner_note = $garbage_table ? ($garbage_table[0]['note-cleaner'] ?? '-') : '-';

            $room_detail = array(
                'house_id'      => (int)$house_id,
                'house_name'    => (string)$house_name,
                'room_id'       => (int)$target_room_id,
                'room_number'   => (string)$target_room_number,
                'customer_id'   => (string)$now_id,
                'moveout_date'  => $moveout_date_obj ? $moveout_date_obj->format('Y-m-d') : '',
                'vacancy_date'  => $vacancy_date_obj ? $vacancy_date_obj->format('Y-m-d') : '',
                'early_leave'   => (bool)!empty($customer_data1["early-leave-done"]),
                'status_label'  => $status_label,
                'room_key'      => (string)$room_key,
                'building_key'  => (string)$building_key,
                'address'       => (string)$address,
                'cleaner_note'  => (string)$cleaner_note
            );
            break;
        }
    }

    if (!$room_detail) {
        return new WP_REST_Response(
            array(
                'message' => '指定された部屋が見つかりません：' . $target_room_number,
                'data' => null
            ),
            404,
            array('Content-Type' => 'application/json; charset=utf-8')
        );
    }

    return new WP_REST_Response(
        array(
            'message' => 'success',
            'data' => $room_detail
        ),
        200,
        array('Content-Type' => 'application/json; charset=utf-8')
    );
}

/**
 * POSTMANでテストする時の情報
 * 
 * 1. エンドポイント
 * GET: https://[your-domain]/wp-json/cleaning-management/v1/room-detail
 * 
 * 2. クエリパラメータ
 * house_id: 物件ID (数値)
 * room_number: 部屋番号 (文字列)
 * 例: ?house_id=10&room_number=101
 * 
 * 3. レスポンス例
 * {
 *   "message": "success",
 *   "data": {
 *     "house_id": 10,
 *     "house_name": "サンプルハウス10",
 *     "room_number": "101",
 *     "customer_id": "10000",
 *     "moveout_date": "2024-04-01", 空文字の可能性あり
 *     "vacancy_date": "2024-04-08", 空文字の可能性あり
 *     "early_leave": false,
 *     "status_label": {
 *       "color": "#888888",
 *       "text": "退去予定"
 *     },
 *     "room_key": "A101",
 *     "building_key": "B001",
 *     "address": "東京都新宿区西新宿1-1-1",
 *     "cleaner_note": "[現地キーボックス]<br />\r\n１階倉庫内、「三角コーナー」脇に現地キーボックスあり。"
 *   }
 * }
 * 
 * 4. エラーレスポンス例
 * {
 *   "message": "指定された部屋が見つからないか、退去予定情報がありません。",
 *   "data": null
 * }
 * 
 * 5. テスト手順
 * a) WordPressの管理画面で以下を確認
 *    - シェアハウス（物件）の投稿IDを確認
 *    - 退去予定のある部屋の部屋番号を確認
 * 
 * b) POSTMANで以下をテスト
 *    - 存在する物件ID・部屋番号で正常系テスト
 *    - 存在しない物件IDでエラーレスポンス確認
 *    - 存在しない部屋番号でエラーレスポンス確認
 * 
 * 6. 注意点
 * - 日付はISO 8601形式で返却
 * - タイムゾーンは日本時間（+09:00）
 * - 空室予定日は退去予定日の7日後
 * - 業者メモが未設定の場合は "-" を返却
 */
