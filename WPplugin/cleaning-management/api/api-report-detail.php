<?php

add_action('rest_api_init', 'register_cleaning_report_detail_route');

function register_cleaning_report_detail_route() {
    register_rest_route(
        'cleaning-management/v1',
        '/cleaning-report-detail',
        array(
            'methods' => 'GET',
            'callback' => 'get_cleaning_report_detail',
            'args' => array(
                'report_id' => array(
                    'required' => true,
                    'type' => 'integer',
                    'description' => '清掃報告書の投稿ID'
                )
            ),
            'permission_callback' => 'verify_api_key'
        )
    );
}

/**
 * 清掃報告書の詳細情報を取得するAPI
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 * 
 * @typedef {Object} ComparisonImage
 * @property {Object} before - ビフォー画像情報 {url: string, note: string}
 * @property {Object} after - アフター画像情報 {url: string, note: string}
 * 
 * @typedef {Object} CleaningReportDetail
 * @property {number} post_id - 投稿ID
 * @property {number} house_id - 物件ID
 * @property {string} house_name - 建物名
 * @property {number} room_id - ルームID
 * @property {string} room_number - 部屋番号
 * @property {Array<ComparisonImage>} comparison_images - ビフォーアフター画像ペア配列
 * @property {Array} proposal_images - 特別清掃・修繕提案画像配列 [{url: string, note: string}]
 * @property {Array} damage_images - 残置物/汚損・破損個所画像配列 [{url: string, note: string}]
 * @property {Array} attached_files - 添付ファイル配列 [{url: string, note: string}]
 * @property {string} room_status - 清掃後の部屋状態
 * @property {string} overall_note - 全体を通したメモ
 * 
 * @returns {CleaningReportDetail}
 */
function get_cleaning_report_detail(WP_REST_Request $request) {
    $report_id = $request->get_param('report_id');
    
    // 投稿の存在確認
    $report = get_post($report_id);
    if (!$report || $report->post_type !== 'moveout-check') {
        return new WP_REST_Response(
            array(
                'message' => '指定された清掃報告書は存在しません。',
                'data' => null
            ),
            404,
            array('Content-Type' => 'application/json; charset=utf-8')
        );
    }

    // 基本情報の取得
    $house_id = get_field('house-id', $report_id);
    $house_name = get_the_title($house_id);
    
    // フィールドデータの取得
    $check_contents = get_field('check-conts', $report_id);
    
    // 画像配列の作成関数
    function create_image_info($image) {
        if (!isset($image['img'])) {
            return null;
        }
        $image_url = wp_get_attachment_url($image['img']);
        if (!$image_url) {
            return null;
        }
        return array(
            'url' => $image_url,
            'note' => $image['note'] ?? ''
        );
    }

    // ビフォーアフター画像のペアリング
    function create_comparison_pairs($before_images, $after_images) {
        $comparison_pairs = array();
        $max_count = max(
            is_array($before_images) ? count($before_images) : 0,
            is_array($after_images) ? count($after_images) : 0
        );
        
        for ($i = 0; $i < $max_count; $i++) {
            $before_info = isset($before_images[$i]) ? create_image_info($before_images[$i]) : null;
            $after_info = isset($after_images[$i]) ? create_image_info($after_images[$i]) : null;
            
            // ペアのどちらかが存在する場合のみ追加
            if ($before_info || $after_info) {
                $comparison_pairs[] = array(
                    'before' => $before_info,
                    'after' => $after_info
                );
            }
        }
        
        return $comparison_pairs;
    }

    // 単体画像配列の作成
    function create_image_array($images) {
        if (!$images) return array();
        
        $result = array();
        foreach ($images as $image) {
            $image_info = create_image_info($image);
            if ($image_info) {
                $result[] = $image_info;
            }
        }
        return $result;
    }

    // ファイル配列の作成
    function create_file_array($files) {
        if (!$files) return array();
        
        $result = array();
        foreach ($files as $file) {
            if (isset($file['file']['url'])) {
                $result[] = array(
                    'url' => $file['file']['url'],
                    'note' => $file['note'] ?? ''
                );
            }
        }
        return $result;
    }

    // レスポンスデータの作成
    $response_data = array(
        'post_id' => (int)$report_id,
        'house_id' => (int)$house_id,
        'house_name' => $house_name,
        'room_id' => (int)get_field('room-id', $report_id),
        'room_number' => get_field('room-num', $report_id),
        'comparison_images' => create_comparison_pairs(
            $check_contents['img-before-block'],
            $check_contents['img-after-block']
        ),
        'proposal_images' => create_image_array($check_contents['img-other-block']),
        'damage_images' => create_image_array($check_contents['img-other-block2']),
        'attached_files' => create_file_array($check_contents['files-block']),
        'room_status' => $check_contents['status']['label'] ?? '',
        'overall_note' => $check_contents['note'] ?? ''
    );

    return new WP_REST_Response(
        array(
            'message' => 'success',
            'data' => $response_data
        ),
        200,
        array('Content-Type' => 'application/json; charset=utf-8')
    );
}

/**
 * POSTMANでテストする時の情報
 * 
 * 1. エンドポイント
 * GET: https://[your-domain]/wp-json/cleaning-management/v1/cleaning-report-detail
 * 
 * 2. クエリパラメータ
 * report_id: 清掃報告書の投稿ID（数値）
 * 例: ?report_id=123
 * 
 * 3. レスポンス例
 * {
 *   "message": "success",
 *   "data": {
 *     "post_id": 123,
 *     "house_id": 456,
 *     "house_name": "サンプルハウス",
 *     "room_id": 789,
 *     "room_number": "101",
 *     "comparison_images": [
 *       {
 *         "before": {
 *           "url": "https://example.com/before1.jpg",
 *           "note": "玄関の様子"
 *         },
 *         "after": {
 *           "url": "https://example.com/after1.jpg",
 *           "note": "清掃後の玄関"
 *         }
 *       },
 *       {
 *         "before": {
 *           "url": "https://example.com/before2.jpg",
 *           "note": "キッチンの様子"
 *         },
 *         "after": null
 *       }
 *     ],
 *     "proposal_images": [...],
 *     "damage_images": [...],
 *     "attached_files": [...],
 *     "room_status": "ok",
 *     "overall_note": "特に問題なく清掃完了"
 *   }
 * }
 * 
 * 4. エラーレスポンス例
 * {
 *   "message": "指定された清掃報告書は存在しません。",
 *   "data": null
 * }
 * 
 * 5. テスト手順
 * a) WordPressの管理画面で以下を確認
 *    - 清掃報告書の投稿IDを確認
 *    - カスタムフィールドに画像や情報が正しく設定されているか確認
 * 
 * b) POSTMANで以下をテスト
 *    - 存在する投稿IDで正常系テスト
 *    - 存在しない投稿IDでエラーレスポンス確認
 *    - ビフォーアフター画像のペアリングが正しく行われているか確認
 *    - ビフォーまたはアフターの片方のみ存在する場合の動作確認
 *    - 画像URLが正しく取得できているか確認
 *    - 添付ファイルのURLが正しく取得できているか確認
 * 
 * 6. 注意点
 * - 画像・ファイルURLは絶対パスで返却
 * - ビフォーアフター画像は配列インデックスでペアリング
 * - 存在しない項目は空配列で返却
 * - 片方のみ存在する画像ペアの場合、存在しない方はnullで返却
 * - room_statusはACFのボタングループの値をそのまま返却
 */