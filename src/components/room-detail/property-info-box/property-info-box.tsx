import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { RoomDetail } from '../../../types/room-detail';

export interface PropertyInfoBoxProps {
  room: RoomDetail;
}

export function PropertyInfoBox({ room }: PropertyInfoBoxProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>物件情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">物件名:</p>
            <p>{room.property_name}</p>
          </div>
          <div>
            <p className="font-semibold">物件ID:</p>
            <p>{room.property_id}</p>
          </div>
          <div>
            <p className="font-semibold">住所:</p>
            <p>{room.property_address}</p>
          </div>
          <div>
            <p className="font-semibold">鍵情報:</p>
            <p>部屋: {room.room_key_number}</p>
            <p>玄関: {room.entrance_key_number}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 