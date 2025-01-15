import { useEffect, useState } from 'react';
import { MessageBox } from '@/components/dashboard/message-box/message-box';
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box';
import type { Room } from '@/types/room';

// 開発用モックデータ
const mockRooms: Room[] = [
  {
    property_id: 1,
    property_name: 'シェアハウスA',
    room_number: '101',
    vacancy_date: '2024-01-20',
    cleaning_deadline: '2024-02-01',
    status: 'urgent',
  },
  {
    property_id: 1,
    property_name: 'シェアハウスA',
    room_number: '102',
    vacancy_date: '2024-01-25',
    cleaning_deadline: '2024-02-05',
    status: 'normal',
  },
  {
    property_id: 2,
    property_name: 'シェアハウスB',
    room_number: '201',
    vacancy_date: '2024-01-15',
    cleaning_deadline: '2024-01-30',
    status: 'overdue',
  },
];

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isLoading, setIsLoading] = useState(false);
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

  const urgentRooms = rooms.filter(room => room.status === 'urgent');
  const normalRooms = rooms.filter(room => room.status === 'normal');
  const overdueRooms = rooms.filter(room => room.status === 'overdue');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <MessageBox
        title="清掃管理システムへようこそ"
        message="このダッシュボードでは、担当する部屋の清掃状況を確認できます。"
      />
      
      {/* 状態別の部屋一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoomListBox
          title="緊急清掃"
          rooms={urgentRooms}
          titleColor="text-red-500"
          onError={(error) => setError(error)}
        />
        <RoomListBox
          title="通常清掃"
          rooms={normalRooms}
          titleColor="text-green-500"
          onError={(error) => setError(error)}
        />
        <RoomListBox
          title="期限超過"
          rooms={overdueRooms}
          titleColor="text-yellow-500"
          onError={(error) => setError(error)}
        />
      </div>

      {/* 全部屋一覧 */}
      <RoomListBox
        title="全部屋一覧"
        rooms={rooms}
        onError={(error) => setError(error)}
      />
    </div>
  );
} 