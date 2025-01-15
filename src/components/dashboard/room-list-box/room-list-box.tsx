import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Room } from '@/types/room';

export interface RoomListBoxProps {
  title: string;
  rooms: Room[];
  titleColor?: string;
  onError?: (error: Error) => void;
}

export function RoomListBox({ title, rooms, titleColor, onError }: RoomListBoxProps) {
  const navigate = useNavigate();

  if (rooms.length === 0) {
    return null;
  }

  try {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleColor}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rooms.map(room => {
              if (!room || !room.property_id || !room.room_number) {
                return null;
              }
              return (
                <div
                  key={room.property_id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => navigate(`/rooms/${room.property_id}`)}
                >
                  <span>{room.room_number}</span>
                  <span className="text-sm text-gray-600">最終清掃: {room.cleaning_deadline}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    if (error instanceof Error && onError) {
      onError(error);
    }
    return (
      <Card>
        <CardContent>
          <div className="text-red-500">データの取得に失敗しました</div>
        </CardContent>
      </Card>
    );
  }
} 