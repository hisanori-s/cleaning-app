import { useState, useEffect } from 'react';
import { MessageBox } from '@/components/dashboard/message-box/message-box';
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box'; // 本番データ
import { useRoomsList } from '@/hooks/dashboard/useRoomsList';


export default function DashboardPage() {
  const [error, setError] = useState<Error | null>(null);

  // 本番APIから部屋一覧を取得
  const { rooms: apiRooms, isLoading, error: apiError } = useRoomsList();

  // エラーハンドリングの統合
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <MessageBox
          title="データ読み込み中"
          message="データを読み込んでいます..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <MessageBox
          title="エラーが発生しました"
          message={error.message}
        />
      </div>
    );
  }

  // 本番データが空の場合
  if (apiRooms.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <MessageBox
          title="部屋情報"
          message="現在表示対象の部屋がありません"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <MessageBox
        title="清掃管理システムへようこそ"
        message="このダッシュボードでは、担当する部屋の清掃状況を確認できます。"
      />
      
      {/* ステータスごとの部屋一覧 */}
      <RoomListBox
        title="【本番：このタイトルは表示されない】ステータス別部屋一覧"
        rooms={apiRooms}
        groupByStatus={true}
        onError={(error) => setError(error)}
      />

      {/* 全部屋一覧 */}
      <RoomListBox
        title="【本番】全部屋一覧"
        rooms={apiRooms}
        onError={(error) => setError(error)}
      />

    </div>
  );
} 