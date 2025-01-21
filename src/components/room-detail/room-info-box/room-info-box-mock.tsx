import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { RoomDetail } from '../../../types/room-detail';

export interface RoomInfoBoxMockProps {
  room: RoomDetail;
}

export function RoomInfoBoxMock({ room }: RoomInfoBoxMockProps) {
  // 必須フィールドの存在チェック
  if (!room.property_name || !room.room_number) {
    return (
      <Card>
        <CardContent className="text-center text-red-500 py-4">
          データの表示に問題が発生しました
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>部屋情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">物件名</div>
            <div>{room.property_name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">部屋番号</div>
            <div>{room.room_number}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">空室予定日</div>
            <div>{room.vacancy_date}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">清掃期限</div>
            <div>{room.cleaning_deadline}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-2">状態</div>
          <div 
            className="inline-block px-2 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: room.status['label-color'],
              color: '#ffffff'
            }}
          >
            {room.status['label-text']}
          </div>
        </div>
        {room.notes && (
          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">備考</div>
            <div className="whitespace-pre-wrap text-sm">{room.notes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 