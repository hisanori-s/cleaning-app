## ディレクトリ構成と役割
src/api/wordpress.ts：
wordpressのAPIを呼ぶためのファイル。生データの取得だけで加工は行わない

src/components/*：
関数コンポーネント。ビジネスロジックは基本的に持たせない

src/pages/*：
ページコンポーネント。ビジネスロジックは基本的に持たせない

src/hooks/*：
フック。ビジネスロジックは基本的に持たせない

src/lib/*：
ビジネスロジックを持たせる

src/types/*：
型定義
────────

## ダッシュボード関連の既存ファイル
src/pages/dashboard/page.tsx：
ダッシュボードページ。ビジネスロジックは持たせない。
現在はモックのJsonをIMPORTして、それをデータとして扱い、部屋一覧ボックスに流し込んでいる。

src/components/dashboard/room-list-box/room-list-box.tsx：
部屋一覧ボックス。ビジネスロジックは持たせない。
デバッグウィンドウがあるが、今はそのまま残しておく。
────────

## 現在のモックデータの流れと、本番環境での流れ
【モックデータを使った現状の流れ】

1. ダッシュボードのページコンポーネントにモックJsonをIMPORT
2. そのモックJsonを部屋一覧ボックスに流し込む

【本番環境で必要な流れ】

1. APIの生データを呼び出す
2. APIの生データを受け取る
3. APIの生データを表示用の部屋情報の配列に加工する
4. 表示用の部屋情報の配列を部屋一覧ボックスに流し込む
────────

## フックを使ったデータ取得と表示までの具体的ステップ
1. ページがマウントされる
2. useRoomsフックが実行される（src/hooks/dashboard/useRoomsList.ts）
3. useEffect内でWPのAPIを呼び出す（src/api/wordpress.ts）
4. 取得した生データをlib/roomの関数（src/lib/dashboard/RoomList.ts）で加工
5. 加工したデータをステートにセット（src/hooks/dashboard/useRoomsList.ts）
6. RoomListBoxコンポーネントに加工済みデータを渡して表示（src/components/dashboard/room-list-box/room-list-box.tsx）
────────

## 今回やりたい作業の概要
1. page.tsxの書き換え（ただしモックデータに関する部分はそのまま残す）
2. room-list-box.tsxは変更しない（デバッグウィンドウは邪魔かもしれないが、残しておく）
3. 新規作成ファイルと追加のみで、既存のコードを破壊しない。
4. 既存情報を変更するのは、page.tsxの中で本番用の部屋リストを呼び出す部分だけ。
5. ちゃんとAPIからデータが取得できて、表示用コンポーネントに渡っているかをデバッグ窓で目視できるようにしたい。
6. ログイン機能を潰さないように要注意。先ほどpage.tsxを何か書き換えた影響でログイン機能が潰れたことがある。
7. 型の定義はsrc/types/room-list.tsを使う（APIからのレスポンス用に新しい型が必要なら追加作成）。
ただ、すでにユーザー情報と部屋リストのデバッグ表示が行われているところでエラーが出ていないので、既存だけで対応できる可能性が高い。
────────

## デバッグウィンドウやAPIの使い方
src/components/dashboard/room-list-box/room-list-box.tsxのデバッグウィンドウを見れば、APIから情報を受け取る方法がわかる。
A: ユーザー情報はlocalStorageのauth_userから取得
B: ユーザーの担当物件IDはparsedInfo.data.house_idsに格納
C: getRooms関数にhouse_idsを渡している
この流れを参考にして、本番用でも部屋一覧を取得する。
────────

## APIレスポンスの例（参考）
```
{
    "message": "success",
    "data": [
        {
            "house_id": 10,
            "house_name": "LAFESTA新宿",
            "room_number": "302",
            "moveout_date": "2024-09-30",
            "vacancy_date": "2024-10-07",
            "early_leave": false,
            "status_label": {
                "color": "#FF4444",
                "text": "期限超過"
            }
        },
        {
            "house_id": 10,
            "house_name": "LAFESTA新宿",
            "room_number": "305",
            "moveout_date": "2024-10-25",
            "vacancy_date": "2024-11-01",
            "early_leave": false,
            "status_label": {
                "color": "#FF4444",
                "text": "期限超過"
            }
        }
    ]
}
```

────────

## 型定義の扱い
部屋リストのタイプは、表示用に最適化済みなので書き換え禁止。
APIレスポンスを受けるための型定義が必要なら追加で作る。
しかし、ユーザー情報と部屋リストをデバッグ表示するときにエラーは出ていないため、現状の型定義だけで問題なくいける可能性が高い。
────────

## doc/milestoneに作業計画ファイルを作成
今回、必要なファイルを新規作成し、必要なロジックを追加する作業を段階的に進める。
まずは新規作成するファイル群や内容を一通り準備し、そこまでが完了したら一旦コミットするようユーザーに指示。
その後、page.tsxの書き換えやデバッグ窓設置を行う。
進捗をdoc/milestoneにまとめ、コミットのタイミングで報告してほしい。