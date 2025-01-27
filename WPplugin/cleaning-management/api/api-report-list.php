<?php

// 清掃報告書用のコントローラー
// ユーザーIDを受け取り、カスタム投稿内での登録IDと検証し、許可する物件IDを取得して一覧を返す
add_action('rest_api_init', 'register_cleaning_report_rest_route');

function register_cleaning_report_rest_route() {
    register_rest_route(
        'cleaning-management/v1',
        '/cleaning-report-list',
        array(
            'methods' => 'GET',
            'callback' => 'get_cleaning_report_data',
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
            'permission_callback' => 'verify_api_key'
        )
    );
}

/**
 * 清掃報告書一覧を取得するAPI
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 * 
 * @typedef {Object} CleaningReportItem
 * @property {number} post_id - 投稿ID
 * @property {number} house_id - 物件ID
 * @property {string} house_name - 建物名
 * @property {string} room_number - 部屋番号
 * @property {number} room_id - ルームID
 * @property {string} created_date - 作成日 (YYYY-MM-DD形式)
 * 
 * @returns {CleaningReportItem[]}
 */
function get_cleaning_report_data( WP_REST_Request $request) {
    // リクエストから物件IDの配列を取得
    $house_ids = $request->get_param('house_ids');
    
    // 30日前の日付を取得
    $thirty_days_ago = date('Y-m-d', strtotime('-30 days'));
    
    // 清掃報告書を取得
    $cleaning_reports = get_posts(array(
        'post_type'   => 'moveout-check',
        'numberposts' => -1,
        'post_status' => array('publish', 'private'),
        'date_query'  => array(
            array(
                'after'     => $thirty_days_ago,
                'inclusive' => true,
            ),
        ),
    ));

    // 清掃報告書の情報を格納
    $return_report_list = array();

    if ($cleaning_reports) {
        foreach ($cleaning_reports as $report) {
            $post_id = $report->ID;
            $house_id = get_field('house-id', $post_id);
            
            // 指定された物件IDに含まれる場合のみ処理
            if (in_array($house_id, $house_ids)) {
                $house_name = get_the_title($house_id);
                $room_number = get_field('room-num', $post_id);
                $room_id = get_field('room-id', $post_id);
                
                // 戻り値の配列に清掃報告書情報を追加
                $return_report_list[] = array(
                    'post_id'      => (int)$post_id,
                    'house_id'     => (int)$house_id,
                    'house_name'   => (string)$house_name,
                    'room_number'  => (string)$room_number,
                    'room_id'      => (int)$room_id,
                    'created_date' => get_the_date('Y-m-d', $post_id)
                );
            }
        }
    }

    // // 作成日順で昇順ソート
    // usort($return_report_list, function($a, $b) {
    //     return strcmp($a['created_date'], $b['created_date']);
    // });

    // エラーチェック
    if (empty($return_report_list)) {
        return new WP_REST_Response(
            array(
                'message' => '該当する清掃報告書が見つかりませんでした。',
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
            'data' => $return_report_list
        ),
        200,
        array('Content-Type' => 'application/json; charset=utf-8')
    );
}

/**
 * POSTMANでテストする時の情報
 * 
 * 1. エンドポイント
 * GET: https://[your-domain]/wp-json/cleaning-management/v1/cleaning-report-list
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
 *       "post_id": 123,
 *       "house_id": 1,
 *       "house_name": "サンプルハウス1",
 *       "room_number": "101",
 *       "room_id": 1001,
 *       "created_date": "2024-01-15"
 *     }
 *   ]
 * }
 * 
 * 4. エラーレスポンス例
 * {
 *   "message": "該当する清掃報告書が見つかりませんでした。",
 *   "data": []
 * }
 * 
 * 5. テスト手順
 * a) WordPressの管理画面で以下を確認
 *    - 清掃報告書のカスタムフィールドに設定された物件IDを確認
 *    - 過去30日以内に作成された清掃報告書が存在することを確認
 * 
 * b) POSTMANで以下をテスト
 *    - 存在する物件IDで正常系テスト
 *    - 存在しない物件IDでエラーレスポンス確認
 *    - 複数の物件IDを指定してレスポンス確認
 *    - 30日以上前の清掃報告書が含まれないことを確認
 * 
 * 6. 注意点
 * - 日付はYYYY-MM-DD形式で返却
 * - カスタムフィールドから物件IDを取得
 * - 過去30日分のデータのみを返却
 */