import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../../components/rooms/list/room-list';
import type { Room } from '../../types';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // TODO: 実際のAPIエンドポイントに変更する
        const response = await fetch('/wp-json/cleaning-management/v1/properties/1/rooms');
        if (!response.ok) {
          throw new Error('部屋情報の取得に失敗しました');
        }
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">清掃対象の部屋一覧</h1>
      <RoomList rooms={rooms} onRoomClick={handleRoomClick} />
    </div>
  );
} 