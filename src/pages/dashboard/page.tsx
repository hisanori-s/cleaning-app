import { useState } from 'react';
import { MessageBox } from '@/components/dashboard/message-box/message-box';
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box';
import type { Room, RoomListResponse } from '@/types/room';
import mockData from '@/__tests__/mocks/api/properties-rooms.json';

// モックデータの型アサーション
const mockRooms = (mockData as RoomListResponse).mock_rooms_list;

export default function DashboardPage() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [isLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  if (rooms.length === 0) {
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
        title="ステータス別部屋一覧"
        rooms={rooms}
        groupByStatus={true}
        onError={(error) => setError(error)}
      />

      {/* 全部屋一覧 */}
      <RoomListBox
        title="全部屋一覧"
        rooms={rooms}
        onError={(error) => setError(error)}
      />
    </div>
  );
} 