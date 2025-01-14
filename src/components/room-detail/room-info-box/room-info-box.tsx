import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { Room } from '../../../types';

export interface RoomInfoBoxProps {
  room: Room;
}

export function RoomInfoBox({ room }: RoomInfoBoxProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'clean':
        return '清掃済み';
      case 'dirty':
        return '要清掃';
      case 'in_progress':
        return '清掃中';
      default:
        return '不明';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>部屋情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">状態:</p>
            <p>{getStatusText(room.status)}</p>
          </div>
          <div>
            <p className="font-semibold">最終清掃:</p>
            <p>{room.lastCleaned}</p>
          </div>
          <div>
            <p className="font-semibold">担当者:</p>
            <p>{room.assignedCleaners.length > 0 ? room.assignedCleaners.join(', ') : '未割り当て'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 