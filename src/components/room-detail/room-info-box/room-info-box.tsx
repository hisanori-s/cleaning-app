import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';



export function HouseInfoBox({ room }: RoomInfoBoxProps) {
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

export function RoomInfoBox({ room }: RoomInfoBoxProps) {
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

        ここに部屋情報表示
      </CardContent>
    </Card>
  );
} 