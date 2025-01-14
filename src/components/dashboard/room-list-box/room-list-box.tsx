import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { Room } from '../../../types';

export interface RoomListBoxProps {
  title: string;
  rooms: Room[];
  titleColor?: string;
}

export function RoomListBox({ title, rooms, titleColor }: RoomListBoxProps) {
  const navigate = useNavigate();

  if (rooms.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={titleColor}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rooms.map(room => (
            <div
              key={room.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              <span>{room.name}</span>
              <span className="text-sm text-gray-600">最終清掃: {room.lastCleaned}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 