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
  groupByStatus?: boolean;
}

interface StatusGroup {
  label: string;
  color: string;
  rooms: Room[];
}

export function RoomListBox({ 
  title, 
  rooms, 
  titleColor, 
  onError,
  groupByStatus = false 
}: RoomListBoxProps) {
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

  // ステータスグループの生成（メモ化）
  const statusGroups = useMemo(() => {
    if (!groupByStatus) return null;

    const groups: Record<string, StatusGroup> = {};
    validRooms.forEach(room => {
      const statusText = room.status['label-text'];
      if (!groups[statusText]) {
        groups[statusText] = {
          label: statusText,
          color: room.status['label-color'],
          rooms: []
        };
      }
      groups[statusText].rooms.push(room);
    });

    return Object.values(groups);
  }, [validRooms, groupByStatus]);

  const renderRoomTable = (roomsToRender: Room[]) => (
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
        {roomsToRender.map((room, index) => (
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
                  backgroundColor: `${room.status['label-color']}33`
                }}
              >
                {room.status['label-text']}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  try {
    // エラーコールバックが呼ばれた場合はエラー表示
    if (onError && rooms.length === 0) {
      throw new Error('ネットワークエラーが発生しました');
    }

    // 有効なデータがない場合は何も表示しない
    if (validRooms.length === 0) {
      return null;
    }

    if (groupByStatus && statusGroups) {
      return (
        <div className="space-y-6">
          {statusGroups.map(group => (
            <Card key={group.label}>
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-2"
                  style={{ color: group.color }}
                >
                  {group.label}
                  <span className="text-sm font-normal text-gray-500">
                    ({group.rooms.length}件)
                  </span>
                </CardTitle>
              </CardHeader>
              {renderRoomTable(group.rooms)}
            </Card>
          ))}
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleColor}>{title}</CardTitle>
        </CardHeader>
        {renderRoomTable(validRooms)}
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