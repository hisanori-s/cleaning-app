src/api/wordpress.ts
wordpressのAPIを呼ぶためのファイル。生データの取得だけで加工は行わない
src/components/*
関数コンポーネント。ビジネスロジックは基本的に持たせない。
src/pages/*
ページコンポーネント。ビジネスロジックは基本的に持たせない。
src/hooks/*
フック。ビジネスロジックは基本的に持たせない。
src/lib/*
ビジネスロジックを持たせる。
src/types/*
型定義

---

src/pages/dashboard/page.tsx
ダッシュボードページ。ビジネスロジックは持たせない。

src/components/dashboard/room-list-box/room-list-box.tsx
部屋一覧ボックス。ビジネスロジックは持たせない。

現場はダッシュボートのページコンポーネントにモックのJsonをIMPORTして、それをデータとして扱う。
データを部屋一覧ボックスに流し込む、という流れだよね？

これを本番環境にする場合、
APIの生データを呼び出す
APIの生データを受け取る
APIの生データを表示用の部屋情報の配列に加工する
表示用の部屋情報の配列を部屋一覧ボックスに流し込む

という流れにする必要があるよね？

１：ページがマウントされる
２：useRoomsフックが実行される（src/hooks/dashboard/useRoomsList.ts）
３：useEffect内でWPのAPIを呼び出す（src/api/wordpress.ts）
４：取得した生データをlib/roomの関数で加工（src/lib/dashboard/RoomList.ts）
５：加工したデータをステートにセット（src/hooks/dashboard/useRoomsList.ts）
６：RoomListBoxコンポーネントに加工済みデータを渡して表示（src/components/dashboard/room-list-box/room-list-box.tsx）

この流れでいい？
その場合、新規作成するファイルと、そのファイルの中身の作成をしてほしい。
page.tsxの書き換えはするけど、モックデータに関する部分は触ってはダメで、そのまま表示を継続。
room-list-box.tsxに関しては一旦変更なしにして。デバッグウィンドウが邪魔かも知れないけど今は残してほしいので触らないで。

何をすべきかをdoc/milestoneのなかに作業計画立ててみてほしいです。

APIから情報を受け取る方法はsrc/components/dashboard/room-list-box/room-list-box.tsxのでバッグウィンドウを観るとやり方が分かります。
A:ユーザー情報はlocalStorageのauth_userから取得
B:ユーザーの担当物件IDはparsedInfo.data.house_idsに格納
C:getRooms関数にそのhouse_idsを渡している
これらを参考にしてください。

既存のコードを破壊しないようにね。
基本的に新規作成と追加のみ。
唯一既存情報で変更するのは、page.tsxの中で本番用の部屋リストを呼び出すときに、モックデータを流し込んでいるフローの部分だけだよ。

今回のコードでちゃんとAPI空データが取得できているのか、それが表示用のコンポーネントにわたっているのかをデバッグウィンドウを作成して表示させたい。
適切な場所にデバッグ窓を作成し、ブラウザでユーザーが目視できるようにして。