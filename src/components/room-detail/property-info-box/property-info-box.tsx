import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { Room } from '../../../types';

export interface PropertyInfoBoxProps {
  room: Room;
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
            <p>{room.name}</p>
          </div>
          <div>
            <p className="font-semibold">階:</p>
            <p>{room.floor}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 