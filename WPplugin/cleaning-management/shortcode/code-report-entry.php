<?php

/**
 * Shortcode implementation for moveout check form
 * 
 * 使用方法：
 * 1. テンプレートファイルの先頭に以下を追加：
 *    <?php acf_form_head(); ?>
 *    <?php get_header(); ?>
 * 
 * 2. ショートコード [report-entry] を投稿または固定ページに配置
 * 
 * 3. 以下のクエリパラメータを付与してアクセス：
 *    - user_id: 顧客ID
 *    - house_id: 物件ID
 *    - room_id: 部屋ID
 *    - room_number: 部屋番号
 * 
 * 例：
 * https://example.com/report-page/?user_id=123&house_id=456&room_id=789&room_number=101
 * 
 * 注意事項：
 * - 必要なクエリパラメータが不足している場合はエラーメッセージを表示
 * - ACFフィールドに自動的に値が入力される
 * - 投稿タイプは 'moveout-check' に保存される
 * - テンプレート側でacf_form_head();がヘッダー直前に入っている必要がある
 */


// 投稿が完了したかどうかをチェック
function validate_report_done_query_params()
{
    $required_params = [
        'report_id'
    ];

    foreach ($required_params as $param) {
        if (!isset($_GET[$param]) || empty($_GET[$param])) {
            return false;
        }
    }

    // タイトルの上書き
    $report_id = sanitize_text_field($_GET['report_id']);
    $now_title = get_the_title($report_id);

    $done_house_id         = get_field('house-id', $report_id);
    $house_name_full       = get_the_title($done_house_id);
    $house_name_short      = get_field('housename-short', (int)$done_house_id) ?? $house_name_full;
    $done_room_num         = get_field('room-num', $report_id);
    $done_customer_id      = get_field('customer-id', $report_id);
    $done_customer_name    = get_field('customer-data2', $done_customer_id)['name'];
    $post_date             = get_the_date('y/m/d', $report_id);
    $new_title             = "{$house_name_short} {$done_room_num}：[{$done_customer_id}]{$done_customer_name}様_{$post_date}";

    if ($now_title != $new_title) {
        $new_post = array(
            'ID'           => $report_id,
            'post_title'   => $new_title
        );
        wp_update_post($new_post);
    }
    return true;
}

// フロントからわたってきたクエリパラメータのチェック
function validate_report_query_params()
{
    $required_params = [
        'user_id',
        'house_id',
        'room_id',
        'room_number',
        'customer_id'
    ];

    foreach ($required_params as $param) {
        // 数字の0は許容
        if (!isset($_GET[$param]) || $_GET[$param] === '') {
            return false;
        }
    }
    return true;
}

// 投稿フォームの表示
function report_entry_shortcode()
{

    if ( validate_report_done_query_params()) {
        return '<div class="report-done">投稿が完了しました。このページを閉じてください。<br>内容の確認は報告書一覧からお願いします。</div>';
    }

    if ( !validate_report_query_params()) {
        return '<div class="report-error">アクセス権限がありません。必要なパラメータが不足しています。</div>';
    }
    ob_start();


    // クエリパラメータを取得してサニタイズ
    $house_id       = sanitize_text_field($_GET['house_id']);
    $room_id        = sanitize_text_field($_GET['room_id']);
    $room_number    = sanitize_text_field($_GET['room_number']);
    $cleaner_id     = sanitize_text_field($_GET['user_id']);  // 清掃業者ID
    $customer_id    = sanitize_text_field($_GET['customer_id']);  // 顧客ID
    $customer_name  = ($customer_id) ? get_field('customer-data2', $customer_id)['name'] : '';  // 顧客名

    $self_url  = get_permalink();

    $form_args = array(
        'post_id' => 'new_post',
        'new_post'      => array(
            'post_type'     => 'moveout-check',
            'post_status'   => 'publish'
        ),
        'field_groups' => array(), // 使用するフィールドグループのIDを指定
        'updated_message' => '保存しました',
        "return"        => $self_url . "?report_id=%post_id%",
        'submit_value' => '投稿する'
    );
?>
    <script type="text/javascript">
        (function($) {
            $(document).ready(function() {
                // 値の設定を遅延させて確実にフォームが読み込まれた後に実行
                setTimeout(function() {
                    $('div.acf-field-649402cfd6bee ul li:first-child input').parent().contents().last()[0].textContent = " すべて選択";
                    $('#acf-field_64890c43c0378').val('<?php echo esc_js($house_id); ?>');
                    $('#acf-field_648953b0d6670').val('<?php echo esc_js($room_id); ?>');
                    $('#acf-field_649d3b1c44fe3').val('<?php echo esc_js($room_number); ?>');
                    $('#acf-field_67959e80e2bde').val('<?php echo esc_js($cleaner_id); ?>');
                    $('#acf-field_648977c1919f5').val('<?php echo esc_js($customer_id); ?>'); 
                    $('#acf-field_649e4abf44f40').val('<?php echo esc_js($customer_name); ?>'); 
                }, 100);
            });
        })(jQuery);
    </script>
<?php
    echo '<h2>' . get_the_title($house_id) . '：' . $room_number . '</h2>';
    acf_form($form_args);

    return ob_get_clean();
}

add_shortcode('report-entry', 'report_entry_shortcode'); //[report-entry]