import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Room, RoomStatus } from '@/types/room';
import { useMemo } from 'react';

const VALID_STATUSES: RoomStatus[] = ['urgent', 'normal', 'overdue'];

export interface RoomListBoxProps {
  title: string;
  rooms: Room[];
  titleColor?: string;
  onError?: (error: Error) => void;
}

export function RoomListBox({ title, rooms, titleColor, onError }: RoomListBoxProps) {
  const navigate = useNavigate();

  // メモ化によるパフォーマンス最適化
  const validRooms = useMemo(() => {
    try {
      return rooms.filter(room => {
        if (!room || 
            !room.property_id || 
            !room.property_name || 
            room.room_number === undefined || // 空文字は許可
            !room.cleaning_deadline || 
            !room.status ||
            !VALID_STATUSES.includes(room.status)) {
          return false;
        }
        return true;
      });
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
      return [];
    }
  }, [rooms, onError]);

  try {
    // エラーコールバックが呼ばれた場合はエラー表示
    if (onError && rooms.length === 0) {
      throw new Error('ネットワークエラーが発生しました');
    }

    // 有効なデータがない場合は何も表示しない
    if (validRooms.length === 0) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleColor}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {validRooms.map((room, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => navigate(`/rooms/${room.property_id}`)}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">{room.property_name}</span>
                  <span>{room.room_number || ''}</span>
                </div>
                <span className="text-sm text-gray-600">最終清掃: {room.cleaning_deadline}</span>
              </div>
            ))}
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
          <div className="text-red-500">{error instanceof Error ? error.message : 'データの取得に失敗しました'}</div>
        </CardContent>
      </Card>
    );
  }
} 