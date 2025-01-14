import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { Room } from '../../../types';

interface RoomCardProps {
  room: Room;
  onClick: (roomId: number) => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  return (
    <div 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(room.id)}
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
  );
} 