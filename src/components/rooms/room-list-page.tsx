import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div 
            key={room.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleRoomClick(room.id)}
          >
            <Card>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">最終清掃: {room.lastCleaned}</p>
                <p className="text-sm text-gray-600">担当者: {room.assignedCleaners.join(', ')}</p>
                <p className={`mt-2 text-sm ${room.status === 'dirty' ? 'text-red-500' : 'text-green-500'}`}>
                  状態: {room.status === 'clean' ? '清掃済み' : room.status === 'dirty' ? '要清掃' : '清掃中'}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}