import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { Room } from '../../../types';

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
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