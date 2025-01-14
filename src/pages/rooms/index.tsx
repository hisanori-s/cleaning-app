import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../../components/rooms/list/room-list';
import { getRooms } from '../../api/wordpress';
import type { Room } from '../../types';

export default function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleRoomClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">担当部屋一覧</h1>
      <RoomList rooms={rooms} onRoomClick={handleRoomClick} />
    </div>
  );
} 