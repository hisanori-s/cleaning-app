import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { RoomDetailFetchMock } from '../../components/room-detail/room-detail-fetch/room-detail-fetch-mock';
import { PropertyInfoBoxMock } from '../../components/room-detail/property-info-box/property-info-box-mock';
import { RoomInfoBoxMock } from '../../components/room-detail/room-info-box/room-info-box-mock';
import type { RoomDetail } from '../../types/room-detail';

interface RoomContentProps {
  room: RoomDetail;
}

// 部屋詳細ページ
export default function RoomDetailPage() {
  const navigate = useNavigate();

  const RoomContent: React.FC<RoomContentProps> = ({ room }) => (
    <>
      <div className="space-y-6 mb-6">
        <PropertyInfoBoxMock room={room} />
        <RoomInfoBoxMock room={room} />
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          部屋一覧に戻る
        </Button>
        <Button disabled={true}>
          清掃報告を作成
        </Button>
      </div>
    </>
  );

  return (
    <div className="container mx-auto p-4">
      <RoomDetailFetchMock
        render={({ room }) => <RoomContent room={room} />}
      />
    </div>
  );
} 