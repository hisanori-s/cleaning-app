<?php
// デバッグログを有効化
error_log('Auth API called');

$mock_users = [
    [
        'id' => 1,
        'login_id' => 'demo1',
        'password' => '1234',
        'username' => '清掃 太郎',
        'email' => 'demo1@example.com',
        'role' => 'cleaner',
        'assigned_rooms' => [1, 2, 3]
    ],
    [
        'id' => 2,
        'login_id' => 'demo2',
        'password' => 'demo2pass',
        'username' => '清掃 次郎',
        'email' => 'demo2@example.com',
        'role' => 'cleaner',
        'assigned_rooms' => [4, 5, 6]
    ],
    [
        'id' => 3,
        'login_id' => 'demo3',
        'password' => 'demo3pass',
        'username' => '清掃 花子',
        'email' => 'demo3@example.com',
        'role' => 'cleaner',
        'assigned_rooms' => [7, 8, 9]
    ]
];

// ログイン認証のモック処理
function mock_authenticate($login_id, $password) {
    global $mock_users;
    
    // デバッグ: リクエストの内容を確認
    error_log('Login attempt - ID: ' . $login_id . ', Password: ' . $password);
    error_log('Available users: ' . json_encode($mock_users));
    
    foreach ($mock_users as $user) {
        // ユーザーIDの照合をデバッグ
        error_log('Checking user: ' . $user['login_id']);
        if ($user['login_id'] === $login_id) {
            error_log('User found, checking password');
            if ($user['password'] === $password) {
                error_log('Password matched - Login successful');
                return [
                    'success' => true,
                    'data' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'assigned_rooms' => $user['assigned_rooms']
                    ]
                ];
            } else {
                error_log('Password mismatch');
            }
        }
    }
    
    error_log('Authentication failed');
    return [
        'success' => false,
        'error' => 'Invalid credentials'
    ];
} 