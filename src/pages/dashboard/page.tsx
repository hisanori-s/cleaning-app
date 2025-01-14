import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { MessageBox } from '../../components/dashboard/message-box/message-box';
import { RoomListBox } from '../../components/dashboard/room-list-box/room-list-box';
import { getRooms } from '../../api/wordpress';
import type { Room } from '../../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await getRooms();
        if (response.success && response.data) {
          setRooms(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRooms();
  }, []);

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

  const dirtyRooms = rooms.filter(room => room.status === 'dirty');
  const cleanRooms = rooms.filter(room => room.status === 'clean');
  const inProgressRooms = rooms.filter(room => room.status === 'in_progress');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <MessageBox
        title="清掃管理システムへようこそ"
        message="このダッシュボードでは、担当する部屋の清掃状況を確認できます。"
      />
      
      {/* 状態概要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoomListBox
          title="要清掃"
          rooms={dirtyRooms}
          titleColor="text-red-500"
        />
        <RoomListBox
          title="清掃中"
          rooms={inProgressRooms}
          titleColor="text-yellow-500"
        />
        <RoomListBox
          title="清掃済み"
          rooms={cleanRooms}
          titleColor="text-green-500"
        />
      </div>

      {/* 要清掃の部屋一覧 */}
      <RoomListBox
        title="要清掃の部屋"
        rooms={dirtyRooms}
      />

      <div className="flex justify-end">
        <Button
          onClick={() => navigate('/rooms')}
          variant="primary"
        >
          部屋一覧を表示
        </Button>
      </div>
    </div>
  );
} 