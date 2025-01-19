import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { Room } from '../../../types';

export interface RoomInfoBoxProps {
  room: Room;
}

export function RoomInfoBox({ room }: RoomInfoBoxProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>部屋情報</CardTitle>
      </CardHeader>
      <CardContent>
        ここに部屋情報を書きます
      </CardContent>
    </Card>
  );
} 