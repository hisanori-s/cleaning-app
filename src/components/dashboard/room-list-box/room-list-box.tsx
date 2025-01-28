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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home } from 'lucide-react';
import type { RoomList } from '@/types/room-list';
import { useMemo } from 'react';

// 共通のラベルスタイル
const LABEL_BASE_STYLE = 'px-2 py-1 rounded-full text-sm';
// 早期退去ラベルのスタイル設定
const EARLY_LEAVE_LABEL_STYLES = {
  color: '#9C27B0',
  backgroundColor: '#9C27B033',
  text: '早期退去済み'
} as const;

export interface RoomListBoxProps {
  title: string;
  rooms: RoomList[];
  titleColor?: string;
  onError?: (error: Error) => void;
  groupByStatus?: boolean;
  isLoading?: boolean;
}

interface StatusGroup {
  label: string;
  color: string;
  rooms: RoomList[];
}

export function RoomListBox({ 
  title, 
  rooms, 
  titleColor, 
  onError,
  groupByStatus = false,
  isLoading = false
}: RoomListBoxProps) {
  const navigate = useNavigate();

  // メモ化によるパフォーマンス最適化
  const validRooms = useMemo(() => {
    try {
      return rooms.filter(room => {
        if (!room || 
            !room.house_id || 
            !room.house_name || 
            room.room_number === undefined || // 空文字は許可
            !room.moveout_date ||
            !room.vacancy_date || 
            room.early_leave === undefined ||
            !room['status_label'] ||
            !room['status_label'].color ||
            !room['status_label'].text) {
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
      const statusText = room['status_label'].text;
      if (!groups[statusText]) {
        groups[statusText] = {
          label: statusText,
          color: room['status_label'].color,
          rooms: []
        };
      }
      groups[statusText].rooms.push(room);
    });

    return Object.values(groups);
  }, [validRooms, groupByStatus]);

  // ローディング表示
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleColor}>{title}</CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <video autoPlay loop muted className="w-16 h-16">
            <source src="/loading.webm" type="video/webm" />
          </video>
          <p className="mt-4 text-gray-500">読み込み中...</p>
        </div>
      </Card>
    );
  }

  // データなし表示
  if (!isLoading && validRooms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleColor}>{title}</CardTitle>
        </CardHeader>
        <div className="text-center p-6 text-gray-500">
          現在表示対象の部屋がありません
        </div>
      </Card>
    );
  }

  const renderRoomTable = (roomsToRender: RoomList[]) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100/80">
          <TableHead className="py-4 pl-6 text-gray-700 font-medium">退去日</TableHead>
          <TableHead className="py-4 pl-6 text-gray-700 font-medium">空室予定日</TableHead>
          <TableHead className="py-4 pl-6 text-gray-700 font-medium">物件名</TableHead>
          <TableHead className="py-4 pl-6 text-gray-700 font-medium">部屋番号</TableHead>
          <TableHead className="py-4 pl-6 text-gray-700 font-medium">ステータス</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roomsToRender.map((room, index) => (
          <TableRow
            key={`${room.house_id}-${room.room_number}-${index}`}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              const selectedRoom = {
                house_id: room.house_id,
                room_number: room.room_number,
                timestamp: Date.now()
              };
              sessionStorage.setItem('selected_room_info', JSON.stringify(selectedRoom));
              navigate('/rooms');
            }}
          >
            <TableCell className="py-4 pl-6">{room.moveout_date}</TableCell>
            <TableCell className="py-4 pl-6">{room.vacancy_date}</TableCell>
            <TableCell className="py-4 pl-6">{room.house_name}</TableCell>
            <TableCell className="py-4 pl-6">{room.room_number || ''}</TableCell>
            <TableCell className="py-4 pl-6 space-x-2">
              <span
                className={`${LABEL_BASE_STYLE} inline-flex items-center justify-center`}
                style={{
                  color: room['status_label'].color,
                  backgroundColor: `${room['status_label'].color}33`
                }}
              >
                {room['status_label'].text}
              </span>
              {room.early_leave && (
                <span
                  className={`${LABEL_BASE_STYLE} inline-flex items-center justify-center`}
                  style={{
                    color: EARLY_LEAVE_LABEL_STYLES.color,
                    backgroundColor: EARLY_LEAVE_LABEL_STYLES.backgroundColor
                  }}
                >
                  {EARLY_LEAVE_LABEL_STYLES.text}
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  try {
    if (onError && rooms.length === 0) {
      throw new Error('ネットワークエラーが発生しました');
    }

    if (validRooms.length === 0) {
      return null;
    }

    if (groupByStatus && statusGroups) {
      return (
        <Tabs defaultValue="all" className="w-full space-y-6">
          <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Home className="w-4 h-4" />
              全部屋一覧
            </TabsTrigger>
            {statusGroups.map(group => (
              <TabsTrigger
                key={group.label}
                value={group.label}
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ color: group.color }}
              >
                {group.label}
                <span className="ml-1 text-sm font-medium">({group.rooms.length})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-8 py-5 border-b">
                <CardTitle className={`${titleColor} text-xl`}>全部屋一覧</CardTitle>
              </CardHeader>
                {renderRoomTable(validRooms)}
            </Card>
          </TabsContent>

          {statusGroups.map(group => (
            <TabsContent key={group.label} value={group.label}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="px-8 py-5 border-b">
                  <CardTitle 
                    className="flex items-center gap-2 text-xl"
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
            </TabsContent>
          ))}
        </Tabs>
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