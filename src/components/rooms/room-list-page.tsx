import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { fetchRooms } from '../api/wordpress';
import type { Room } from '../types';

export function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card 
            key={room.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleRoomClick(room.id)}
          >
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">最終清掃: {room.lastCleanedAt}</p>
              <p className="text-sm text-gray-600">担当者: {room.assignedTo}</p>
              <p className={`mt-2 text-sm ${room.status === '要清掃' ? 'text-red-500' : 'text-green-500'}`}>
                状態: {room.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}