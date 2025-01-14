import React from 'react';
import { RoomCard } from './room-card';
import type { Room } from '../../../types';

interface RoomListProps {
  rooms: Room[];
  onRoomClick: (roomId: number) => void;
}

export function RoomList({ rooms, onRoomClick }: RoomListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={onRoomClick}
        />
      ))}
    </div>
  );
} 