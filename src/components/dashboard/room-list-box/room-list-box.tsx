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
import type { RoomList } from '@/types/room-list';
import { useMemo, useEffect, useState } from 'react';
import { getRooms } from '@/api/wordpress';
import type { ApiResponse } from '@/types/api';

// デバッグ情報表示コンポーネント
function DebugInfo() {
  const [roomList, setRoomList] = useState<RoomList[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userInfo = localStorage.getItem('auth_user');
  const parsedInfo = userInfo ? JSON.parse(userInfo) : null;

  // ユーザーの担当物件IDがある場合、部屋一覧を取得
  useEffect(() => {
    const fetchRooms = async () => {
      if (parsedInfo?.data?.house_ids) {
        try {
          const response: ApiResponse<RoomList[]> = await getRooms(parsedInfo.data.house_ids);
          if (response.success && response.data) {
            setRoomList(response.data);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '部屋一覧の取得に失敗しました');
        }
      }
    };

    fetchRooms();
  }, [parsedInfo]);


}

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
  groupByStatus = false 
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
            !room['status-label'] ||
            !room['status-label'].color ||
            !room['status-label'].text) {
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
      const statusText = room['status-label'].text;
      if (!groups[statusText]) {
        groups[statusText] = {
          label: statusText,
          color: room['status-label'].color,
          rooms: []
        };
      }
      groups[statusText].rooms.push(room);
    });

    return Object.values(groups);
  }, [validRooms, groupByStatus]);

  const renderRoomTable = (roomsToRender: RoomList[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>退去日</TableHead>
          <TableHead>空室予定日</TableHead>
          <TableHead>物件名</TableHead>
          <TableHead>部屋番号</TableHead>
          <TableHead>ステータス</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roomsToRender.map((room, index) => (
          <TableRow
            key={`${room.house_id}-${room.room_number}-${index}`}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => {
              // リンク機能の作成部分
              // 部屋の詳細情報へ移動
              // セッションストレージに選択された部屋の情報を保存（物件ID＆部屋番号）
              const selectedRoom = {
                house_id: room.house_id,
                room_number: room.room_number,
                timestamp: Date.now()
              };
              sessionStorage.setItem('selected_room_info', JSON.stringify(selectedRoom));
              navigate('/rooms');
            }}
          >
            <TableCell>{room.moveout_date}</TableCell>
            <TableCell>{room.vacancy_date}</TableCell>
            <TableCell>{room.house_name}</TableCell>
            <TableCell>{room.room_number || ''}</TableCell>
            <TableCell className="space-x-2">
              <span
                className={LABEL_BASE_STYLE}
                style={{
                  color: room['status-label'].color,
                  backgroundColor: `${room['status-label'].color}33`
                }}
              >
                {room['status-label'].text}
              </span>
              {room.early_leave && (
                <span
                  className={LABEL_BASE_STYLE}
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
                  {`${group.label}`}
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
      <>
        <DebugInfo />
        <Card>
          <CardHeader>
            <CardTitle className={titleColor}>{title}</CardTitle>
          </CardHeader>
          {renderRoomTable(validRooms)}
        </Card>
      </>
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