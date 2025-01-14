import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { RoomInfo } from '../../components/rooms/detail/room-info';
import { CleaningHistory } from '../../components/rooms/detail/cleaning-history';
import { getRoomDetails, getRoomCleaningHistory } from '../../api/wordpress';
import type { Room, CleaningReport } from '../../types';

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

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>Room not found</div>;

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