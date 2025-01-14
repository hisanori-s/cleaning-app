<?php
header('Content-Type: application/json; charset=utf-8');

// CORSヘッダーの設定
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストへの対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// リクエストパスの取得
$request_path = $_SERVER['REQUEST_URI'];
$path_parts = explode('/', trim($request_path, '/'));

// モックデータの読み込み
require_once 'auth.php';
require_once 'properties-rooms.php';
require_once 'room-detail.php';
require_once 'reports.php';

// リクエストに応じてモックデータを返す
switch (true) {
    // 認証API
    case preg_match('#^/wp-json/cleaning-management/v1/auth/login#', $request_path):
        echo json_encode($mock_auth_response);
        break;

    // 部屋一覧API
    case preg_match('#^/wp-json/cleaning-management/v1/properties/\d+/rooms$#', $request_path):
        echo json_encode($mock_rooms_list);
        break;

    // 部屋詳細API
    case preg_match('#^/wp-json/cleaning-management/v1/properties/\d+/rooms/\d+$#', $request_path):
        echo json_encode($mock_room_detail);
        break;

    // 清掃完了報告API
    case preg_match('#^/wp-json/cleaning-management/v1/reports#', $request_path):
        echo json_encode($mock_report_response);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
} 