import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Room } from '@/types/room';
import { useMemo } from 'react';

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
            !room.vacancy_date ||
            !room.cleaning_deadline || 
            !room.status ||
            !room.status['label-color'] ||
            !room.status['label-text']) {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>退去予定日</TableHead>
              <TableHead>清掃期限</TableHead>
              <TableHead>物件名</TableHead>
              <TableHead>部屋番号</TableHead>
              <TableHead>ステータス</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validRooms.map((room, index) => (
              <TableRow
                key={`${room.property_id}-${room.room_number}-${index}`}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/rooms/${room.property_id}`)}
              >
                <TableCell>{room.vacancy_date}</TableCell>
                <TableCell>{room.cleaning_deadline}</TableCell>
                <TableCell>{room.property_name}</TableCell>
                <TableCell>{room.room_number || ''}</TableCell>
                <TableCell>
                  <span
                    className="px-2 py-1 rounded-full text-sm"
                    style={{
                      color: room.status['label-color'],
                      backgroundColor: `${room.status['label-color']}33` // 透明度20%
                    }}
                  >
                    {room.status['label-text']}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  } catch (error) {
    if (error instanceof Error && onError) {
      onError(error);
    }
    return (
      <Card>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center text-red-500">
                {error instanceof Error ? error.message : 'データの取得に失敗しました'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    );
  }
} 