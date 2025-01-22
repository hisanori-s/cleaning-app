<?php 
/*
Template Name:【外部】退去予定者リスト
*/
if ( !defined( 'ABSPATH' ) ) { exit; /*直接アクセスの禁止*/}
$site_url  = site_url();
$self_url  = get_permalink();
$current_url = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];//クエリ文字などすべて含む
$escaped_current_url = esc_url( $current_url );

//清掃業者用権限があれば閲覧可能
$login_url = wp_login_url($escaped_current_url); //ログイン後はこのページへ戻る
if( current_user_can('edit_moveout-checks') !== true ){
    header("Location: {$login_url}"); //対象外権限者はログインページへリダイレクト
    exit;
}


//投稿画面へのデータ提供
$target_house_id    = isset($_GET['h-id']) ? sanitize_text_field($_GET['h-id']) : 0;
$target_room_id     = isset($_GET['r-id']) ? sanitize_text_field($_GET['r-id']) : 0;
$target_room_num    = isset($_GET['r-num']) ? sanitize_text_field($_GET['r-num']) : 0;
$target_room_key    = isset($_GET['r-key']) ? sanitize_text_field($_GET['r-key']) : '-';	//個室ID準備出来たらGETパラメータは取得しない
$target_room_post   = isset($_GET['r-post']) ? sanitize_text_field($_GET['r-post']) : '-';	//個室ID準備出来たらGETパラメータは取得しない
$target_customer_id = isset($_GET['c-id']) ? sanitize_text_field($_GET['c-id']) : 0;
$post_moveout       = false;

if (!empty((int)$target_room_id)) {
    $room_post = get_post($target_room_id);
    if ($room_post && $room_post->post_type === 'sharehouse-rooms') {
        $post_moveout = true;
    }
}
if ( $post_moveout == false && !empty((int)$target_customer_id)) {
    $customer_post = get_post($target_customer_id);
    if ($customer_post && $customer_post->post_type === 'customer') {
        $post_moveout = true;
    }
}

//投稿完了後処理
$done_id = isset($_GET['done-id']) ? sanitize_text_field($_GET['done-id']) : 0;//投稿した退去確認ポストID
$add_note = '';
if( !empty( $done_id ) && get_post_type( (int)$done_id === 'moveout-check' )){
    
    $now_title = get_the_title( $done_id );

    $done_house_id = get_field( 'house-id', $done_id );
    $house_name_full  = get_the_title( $done_house_id );
    $house_name_short  = get_field( 'housename-short', (int)$done_house_id ) ?? $house_name_full;
    $done_room_num = get_field( 'room-num', $done_id );
    $done_coutomer_id = get_field( 'customer-id', $done_id );
    $done_customer_name = get_field( 'customer-data2', $done_coutomer_id )['name'];
    $post_date = get_the_date( 'y/m/d', $done_id );
    $new_title = "{$house_name_short} {$done_room_num}：[{$done_coutomer_id}]{$done_customer_name}様_{$post_date}";
    
    if( $now_title != $new_title ){
        $new_post = array(
            'ID'           => $done_id,
            'post_title'   => $new_title
        );
        // データを更新します
        wp_update_post( $new_post );
        $add_note = "<div class='box-blue m20-b border-radius-5'>『{$house_name_full}：{$done_room_num}室』の記録を作成しました。</div>";

        

        //通知メール---------------------------------------------------
        $posted_url = get_permalink( $done_id );
        $conts = get_field( 'check-conts', $done_id );
        $status = $conts['status']['label'];
        $note = $conts['note'];
        
        $to			= get_field( 'kanri-mail', 'option' ); //管理メアド
        $subject	= '【清掃記録】'.$new_title ;
        $body		= '◆清掃後の状態：'.$status."\n".
                    '◆備考：'.strip_tags($note)."\n".
                    '◆詳細確認：'.$posted_url;
        //実行 --------------------------------------------------------
        wp_mail( $to, $subject, $body );

    }
    
}


acf_form_head();
get_header();

$today			= date_i18n('Y/m/d');
$today_data		  = new DateTime( $today );


///////////////////////////////////////////////////////////////
/**退去予定一覧 */
///////////////////////////////////////////////////////////////
if( $post_moveout === false ){

    $sharehouse_list  = get_posts(array(
        'post_type'   => 'sharehouse',
        'numberposts' => -1,
        'post_status' => array( 'publish' ),
        'order'       => 'asc',
    ));
    $sharehouse_list2 = get_posts( array(
    'post_type'      => 'sharehouse',
    'posts_per_page' => -1,
    'post_status'    => array( 'private'),
    'order'          => 'ASC',
    'tax_query' => array( 
        array(
            'taxonomy' => 'exclude-from-list',
            'field'    => 'slug',
            'terms'    => 'exclude',
            'operator' => 'NOT IN', //管理対象外タクソノミーを除外
        )
    ),
    ));

    if( !empty( $sharehouse_list2 )){
        $sharehouse_list = array_merge( $sharehouse_list, $sharehouse_list2 );
    }
    $all_customer_id_arr = array();
    if( $sharehouse_list ){
        $all_house_arr = array();
        foreach( $sharehouse_list as $row ):
            $set_house_id    = $row->ID;
            if( !get_post( $set_house_id)){ continue; }
            $set_house_name = get_the_title( $set_house_id );
            //$set_house_name_short  = get_field( 'housename-short', $set_house_id ) ?? get_the_title( $set_house_id );

            $house_address = get_field( 'address', $set_house_id )[0]['address-closed'] ?? "";

            $rooms_loop		= get_field( 'rooms',$set_house_id );
            $room_data_arr	= array();
            $acf_row_num	= 0;
            if( $rooms_loop ){
                foreach( $rooms_loop as $rooms ):
                    $number		= $rooms["number"];
                    $now_id		= $rooms["customer-id"];
                    $next_id	= $rooms["customer-id-next"];
                    $room_img	= $rooms["room-img"];
                    //$theta		= $rooms["theta"];
                    //$bed		= $rooms["bed"]["wide"];
                    $type		= $rooms["type"];
                    $type_label = mb_substr( $type["label"], 0, 2, "UTF-8" );
//					$room_memo	= $rooms["memo"];
                    $troom_key	= $rooms['room-key'];
                    $room_post	= $rooms['mailbox'];
                    $acf_row_num++;
                
                    $room_data_arr[$number] = array(
                        "now_id_field"	=> $now_id,
                        "next_id_field"	=> $next_id,
                        "room_img"		=> $room_img,
                        //"theta"			=> $theta,
                        //"bed"			=> $bed,
                        "type_label"	=> $type_label,
//						"room_memo"		=> $room_memo,
                        'room-key'		=> $troom_key,
                        'mailbox'		=> $room_post,
                        "acf_row_num"	=> $acf_row_num,
                    );
                    if( $now_id ){
                        $all_customer_id_arr[] = $now_id;
                    }
                endforeach;
            }

            $all_house_arr[$set_house_id]  = array( 
                "house_id"		=> $set_house_id,
                "house_name"	=> $set_house_name,
                "rooms_data"	=> $room_data_arr,
                "house_address"	=> $house_address
            );

            //最後にcount()を使うため、変数をプリセット。
            $sort_by_house[$set_house_id] = array();

        endforeach;
    }
    $leave_customer_id_arr = array();
    foreach( $all_customer_id_arr as $target_customer_id ){

        //退去日確定者
        $target_customer_data1 = get_field( 'customer-data1', $target_customer_id );
        $move_check			 = $target_customer_data1["move-check"];
        $moveout_date_key	 = ( $move_check ) ? $target_customer_data1["move-out-date"] : "undecided";
        
        //再契約希望しなかった人
        $intention = $target_customer_data1["re-contract"]["intention-of-re-contract"];
        $intention_val = ( !empty( $intention["value"] )) ? $intention["value"] : "";
        $re_contract_deny = ( $intention_val == "no" ) ? true : false;

        //退去取りやめ＆営繕未チェック
        $customer_alert_check = $target_customer_data1["other-team-check"];
        $moveout_change_check = $customer_alert_check["moveout-change"];
        $moveout_change = ( $moveout_change_check == "waiting" ) ? true : false;

        //早期退去チェック在り → keyを閲覧日として上書き
        $early_leave = $target_customer_data1["early-leave-done"]; //早期退去済みチェック
        if( $early_leave ){
            $moveout_date_key = date( "Y/m/d", strtotime( $today ));
        }

        if( $moveout_date_key != "undecided" || $re_contract_deny === true || $moveout_change === true ){
            //退去日毎に連想配列で取得
            $leave_customer_id_arr[$moveout_date_key][] = $target_customer_id;
        }
    }
    
    $sort_by_date_arr = array();
    if( !empty( $leave_customer_id_arr )){
        ksort( $leave_customer_id_arr );//key(退去日)でソート
        foreach( $leave_customer_id_arr as $moveout_date_key => $customer_id_arr ): 
        foreach( $customer_id_arr as $customer_id ): 
        
            $customer_data1 = get_field( 'customer-data1', $customer_id );

            $memo        = '';
            $house_id    = $customer_data1["house-id"];
            $room        = $customer_data1["room"];

            $house_name  = get_the_title( $house_id );
            //$house_name_short  = get_field( 'housename-short', $house_id ) ?? get_the_title( $house_id );
            $house_address = get_field( 'address', $house_id )[0]['address-closed'] ?? "";

            $move_check			 = $customer_data1["move-check"];
            if( !$move_check ) continue;

            $moveout_date		 = ( $move_check ) ? $customer_data1["move-out-date"] : "";
            $moveout_date_format = ( $moveout_date ) ? date( "n/j", strtotime( $moveout_date )) : " - " ;
            $moveout_date_data	 = ( $moveout_date ) ? new DateTime( $moveout_date ) : "";

            $early_leave = $customer_data1["early-leave-done"]; //早期退去済みチェック

            $next_vacancy_date			= ( $moveout_date ) ? date( "Y/m/d", strtotime( "+7 day", strtotime( $moveout_date ))) : "";
            $next_vacancy_date_format	= ( $moveout_date ) ? date( "n/j", strtotime( $next_vacancy_date )) : " - ";
            $next_vacancy_date_data		= ( $moveout_date ) ? new DateTime( $next_vacancy_date ) : "";


            // 紹介会社タグ
            $quote_tax_broker = get_the_terms( $customer_id, 'broker' );
            $all_broker = "";
            if( $quote_tax_broker ){
                foreach( $quote_tax_broker as $broker):
                    $title      = $broker->name;
                    $term_id    = $broker->term_id;
                    $text_color = get_field( 'text-color', 'broker_' . $term_id );
                    $back_color = get_field( 'back-color', 'broker_' . $term_id );
                    $all_broker .= ' <span class="customer-label" style="color:' . $text_color . ';background-color:' . $back_color . ';">' . $title . '</span>';
                endforeach;
            }

            //▼▼ 物件ページ依存情報 ▼▼//
            $this_room_data = $all_house_arr[$house_id]["rooms_data"][$room]; 
            //$sharehouse_listのループで設定した情報
            /*$room_data_arr[$number] = array(
                "now_id_field" 	=> $now_id,
                "next_id_field"	=> $next_id,
                "room_img"		=> $room_img,
                "theta"			=> $theta,
                "bed"			=> $bed,
                "room_memo"		=> $room_memo
                "acf_row_num"   => $acf_row_num,
            );*/
            $acf_row = $this_room_data["acf_row_num"];
            //update_sub_field( array( "rooms", (int)$acf_row, "@@" ), $customer_id, $house_id );

            $room_id = 0;
            $room_type 		= $this_room_data["type_label"];
            $room_post 		= $this_room_data["mailbox"];	//個室IDが用意できたら取得不要
            $room_key 		= $this_room_data["room-key"];	//個室IDが用意できたら取得不要
//			$room_memo		= $this_room_data["room_memo"];

            $next_customer_id	= $this_room_data["next_id_field"];
            $next_contract		= ( $next_customer_id ) ? get_field( 'customer-data1', $next_customer_id )["contract-period"] : ""; //group
            $next_movein_check		= ( $next_contract ) ? $next_contract["check"] : "";
            $next_movein_date		= ( $next_movein_check ) ? $next_contract["start"] : "";
            $next_movein_date_data	= ( $next_movein_date ) ? new DateTime( $next_movein_date ) : "";
            //▲▲ 物件ページ依存情報 ▲▲//

            ////////////////////////
            //▼▼ 警告ラベル ▼▼//
            ////////////////////////
            $alert_label_arr = array();
            //$tr_color	= "";

            $customer_alert_check = $customer_data1["other-team-check"];
            //退去日変更の場合の警告
            $moveout_change_check = $customer_alert_check["moveout-change"];
            $moveout_change = ( $moveout_change_check == "waiting" && $moveout_date ) ? true : false;

            //退去取り消しの場合の警告
            $moveout_change_check = $customer_alert_check["moveout-change"];
            $moveout_cancel = ( $moveout_change_check == "waiting" && !$moveout_date ) ? true : false;

            //退去予定まで残り期間45日～０日orそれ以下
            $moveout_date_diff = ( $moveout_date_data ) ? $today_data->diff( $moveout_date_data ) : false;

            //日差が４５日以下、もしくはマイナス
            if( $moveout_date_diff && ( $moveout_date_diff->days <= 45 || $moveout_date_diff->invert == 1 )){
                //チンカク未登録の場合の警告
                $chinkaku_check = $customer_data1["system_update_day"];
                $chinkaku_check_tf = ( !$chinkaku_check ) ? true : false;

                //退去案内メール未完了の場合の警告
                $leaving_guide_mail_check = $customer_data1["leaving-guideline"];
                $leaving_guide_mail_check_tf = ( !$leaving_guide_mail_check ) ? true : false;

                //if( $chinkaku_check_tf || $leaving_guide_mail_check_tf ){
                //	$tr_color = "box-purple2";
                //}
            }else{
                $chinkaku_check_tf = false;
                $leaving_guide_mail_check_tf = false;
            }

            //空室予定日超過の警告 ＆ 早期退去チェック
            //$next_vacancy_pickup = "";
            $moveout_date_pickup = "";
            $over_vacancy_date = ( !empty( $next_vacancy_date_data ) && $next_vacancy_date_data < $today_data ) ? true : false;
            $early_leave_tf    = ( !empty( $early_leave )) ? true : false;

            if(( !empty( $moveout_date_data ) && $moveout_date_data < $today_data ) || $early_leave === true ){
                //$tr_color = "box-orange2";
                $moveout_date_pickup = "box-lightgreen b";

                if( $early_leave === true ){
                    $moveout_date_format .= '<div class="f09em">早期退去済</div>';
                }
            }
            
            ////////////////////////
            //▲▲ 警告ラベル ▲▲//
            ////////////////////////

            //GETパラメータ付与
            //これ、できれば全部のIDを取得したい
            //$target_url_query_arr = ( $room_id && get_post_type($room_id) === 'sharehouse-rooms' ) ? array( 'h-id' => $house_id, 'r-id' => $room_id ) : array( 'h-id' => $house_id, 'c-id' => $customer_id );
            $target_url_query_arr = array( 'h-id' => $house_id, 'r-id' => $room_id, 'r-num' => $room, 'r-key' => $room_key, 'r-post' => $room_post, 'c-id' => $customer_id );
            $target_url	= add_query_arg( $target_url_query_arr, $self_url );


            /*---- 物件ごとの一覧 ----*/
            $row_by_house = '
            <tbody>
                <tr>
                    <td class="al-c b">
                        ' . $room . '
                    </td><td class="al-c">
                        ' . $room_type . '
                    </td><td class="al-c ' . $moveout_date_pickup . '">
                        ' . $moveout_date_format . '
                    </td><td class="al-c">
                        ' . $next_vacancy_date_format . '
                    </td><td>
                        '.$house_address.'
                    </td><td class="al-c">
                        ' /*. implode( "", $alert_label_arr )*/ . '<a href="'.$target_url.'">報告</a>
                    </td>
                </tr>
            </tbody>';
            $sort_by_house[$house_id][$room] = $row_by_house;//物件ごと用の連想配列

            /*---- 日付順での一覧 ----*/
            $row_by_date = '
            <tbody>
                <tr>
                    <td class="b">
                        ' . $house_name . '
                    </td><td class="al-c b">
                        '.$room.'
                    </td><td class="al-c">
                        ' . $room_type . '
                    </td><td class="al-c ' . $moveout_date_pickup . '">
                        ' . $moveout_date_format . '
                    </td><td class="al-c">
                        ' . $next_vacancy_date_format . '
                    </td><td>
                        '.$house_address.'
                    </td><td class="al-c">
                        ' /*. implode( "", $alert_label_arr )*/ . '<a href="'.$target_url.'">報告</a>
                    </td>
                </tr>
            </tbody>';
            $sort_by_date_arr[] = $row_by_date ; //日付順でrow配列に格納

        endforeach;
        endforeach;
    }


    ////////////////////////////////////////////
    /////////取得データをもとに表を作成/////////
    ////////////////////////////////////////////
    
    $the_room_list_block = '';
    //説明
    $top_txt = '
    <section class="lh15">
        ◆退去予定日を超えた部屋は<span class="box-lightgreen border-radius-5" style="padding: 2px 5px; ">予定日セルの背景を緑に変更</span>しています。<br>
        ◆退去予定日の午前中には退室しているはずですが、室内立ち入りは翌日以降が確実です。<br>
        ◆『早期退去済』表記のある部屋はすぐに入室可能です。<br>
        <a href="'.get_permalink(13332).'" target="_blank" class="f12em b no-deco m10-t">&#x27A0; 報告済退去清掃 一覧ページ</a>
    </section>';


    //◆退去日別リスト
    $h2_title_by_date = '<h2 class="m50-t">退去日別リスト（' . count( $sort_by_date_arr ) . ' 名）</h2>';

    $title_row = '
    <tr class="title-row al-c">
        <td width="130">
            物件名
        </td><td width="50">
            部屋
        </td><td width="40">
            タイプ
        </td><td width="50">
            退去<br>予定
        </td><td width="50">
            空室<br>予定
        </td><td width="250">
            住所
        </td><td width="40">
            作業<br>報告
        </td>
    </tr>';


    if( !empty( $sort_by_date_arr )){
        $row_by_date_arr = array();
        foreach( $sort_by_date_arr as $row_by_date ){
            $row_by_date_arr[] = $row_by_date;
        }
        $row_by_date = implode( '', $row_by_date_arr );
    }else{
        $row_by_date = '<tbody><tr><td class="al-c box-gray" colspan="8"> - </td></tr></tbody>';
    }
    $table_by_date = $h2_title_by_date.'
    <table id="leave-tenants-date" class="slim_table onmouse-row-pickup f08em">
        <thead>' . $title_row . '</thead>'
        .$row_by_date.
        '<tfoot>' . $title_row . '</tfoot>
    </table>';


    //◆物件別リスト
    $h2_title_by_hosue = '<h2 class="m50-t switch">物件別リスト</h2>';
    $table_by_house_arr = array();
    if( $all_house_arr ){
        foreach( $all_house_arr as $house_id => $row_data ):

            //物件ごとのタイトルrowを設定
            $house_name = $row_data["house_name"];
            $house_address = $row_data["house_address"];

            $title_row = '
            <tbody>
                <tr class="title-row al-c">
                    <td width="60">
                        部屋
                    </td><td width="50">
                        タイプ
                    </td><td width="60">
                        退去予定
                    </td><td width="60">
                        空室予定
                    </td><td width="250">
                        住所
                    </td><td widrh="50">
                        作業報告
                    </td>
                </tr>
                <tr>
                    <td colspan="9" class="title2 b al-l f15em p10-l">' . $house_name . '<span class="f08em" style="font-weight: normal;">　('.$house_address.')</span><div class="fl-r m0-b m10-r">' . count( $sort_by_house[$house_id] ) . ' 名</div></td>
                </tr>
            </tbody>';
            
            $rows_arr = array();
            if( !empty( $sort_by_house[$house_id] )){
                foreach( $sort_by_house[$house_id] as $room_num => $row_by_house ){
                    $rows_arr[] = $row_by_house;
                }
            }else{
                $rows_arr[] = '<tbody><tr><td class="al-c box-gray" colspan="7"> - </td></tr></tbody>';
            }
            $table_by_house_arr[] = $title_row.implode( '', $rows_arr );
        endforeach;
    }
    $table_by_house = $h2_title_by_hosue.'<section class="contentWrap">
        <table id="leave-tenants-house" class="slim_table f08em">'
        .implode( '', $table_by_house_arr ).
        '</table>
        </section>';
        
    $the_room_list_block = $top_txt.$table_by_date.$table_by_house;
}else{
    $the_room_list_block = '';
}