import { useState, useEffect } from 'react';
import { MessageBox } from '@/components/dashboard/message-box/message-box';
import { RoomListBoxMock } from '@/components/dashboard/room-list-box/room-list-box-mock'; // モックデータ
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box'; // 本番データ
import type { RoomList, RoomListResponse } from '@/types';
import mockData from '@/__tests__/mocks/api/properties-rooms.json';
import { useRoomsList } from '@/hooks/dashboard/useRoomsList';
import { useAuth } from '@/hooks/use-auth';

// モックデータの型アサーション
const mockRooms = (mockData as RoomListResponse).mock_rooms_list;

export default function DashboardPage() {
  const [MockRooms] = useState<RoomList[]>(mockRooms);
  const [error, setError] = useState<Error | null>(null);

  // 本番APIから部屋一覧を取得
  const { rooms: apiRooms, isLoading, error: apiError } = useRoomsList();
  const { user } = useAuth();

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

  // モックと本番データの両方が空の場合
  if (MockRooms.length === 0 && apiRooms.length === 0) {
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
      
      {/* 【モック】ステータスごとの部屋一覧 */}
      <RoomListBoxMock
        title="【モック：このタイトルは表示されない】ステータス別部屋一覧"
        rooms={MockRooms}
        groupByStatus={true}
        onError={(error) => setError(error)}
      />

      {/* 【モック】全部屋一覧 */}
      <RoomListBoxMock
        title="【モック】全部屋一覧"
        rooms={MockRooms}
        onError={(error) => setError(error)}
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

      {/* デバッグ情報 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-2">デバッグ情報</h2>
          <div className="space-y-2">
            <p>ユーザー情報: {JSON.stringify(user, null, 2)}</p>
            <p>担当物件ID: {JSON.stringify(user?.house_ids, null, 2)}</p>
            <p>API部屋データ: {JSON.stringify(apiRooms, null, 2)}</p>
          </div>
        </div>
      )}
    </div>
  );
} 