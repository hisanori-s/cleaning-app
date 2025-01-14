import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { getRoomDetails, getRoomCleaningHistory } from '../../../api/wordpress';
import type { Room, CleaningReport } from '../../../types';

// 部屋情報コンポーネント
function RoomInfo({ room }: { room: Room }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">階:</p>
            <p>{room.floor}</p>
          </div>
          <div>
            <p className="font-semibold">状態:</p>
            <p>{room.status === 'clean' ? '清掃済み' : room.status === 'dirty' ? '要清掃' : '清掃中'}</p>
          </div>
          <div>
            <p className="font-semibold">最終清掃:</p>
            <p>{room.lastCleaned}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 清掃履歴コンポーネント
function CleaningHistory({ history }: { history: CleaningReport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>清掃履歴</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="border-b pb-4">
              <p className="font-semibold">{entry.date}</p>
              <p>清掃者: {entry.cleanerId}</p>
              <p>{entry.comments}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 部屋詳細ページ
export default function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [history, setHistory] = useState<CleaningReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        const [roomResponse, historyResponse] = await Promise.all([
          getRoomDetails(parseInt(roomId, 10)),
          getRoomCleaningHistory(parseInt(roomId, 10))
        ]);

        if (roomResponse.success && roomResponse.data) {
          setRoom(roomResponse.data);
        }
        setHistory(historyResponse);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-gray-600">
          データを読み込んでいます...
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-gray-600">
          部屋が見つかりませんでした
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <RoomInfo room={room} />
      <CleaningHistory history={history} />

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/rooms')}
        >
          部屋一覧に戻る
        </Button>
        <Button
          onClick={() => navigate(`/rooms/${roomId}/report`)}
        >
          清掃報告を作成
        </Button>
      </div>
    </div>
  );
} 