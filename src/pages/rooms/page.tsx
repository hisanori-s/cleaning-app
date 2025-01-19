import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { RoomDetailFetch } from '../../components/room-detail/room-detail-fetch/room-detail-fetch';
import { PropertyInfoBox } from '../../components/room-detail/property-info-box/property-info-box';
import { RoomInfoBox } from '../../components/room-detail/room-info-box/room-info-box';
import type { Room } from '../../types/room';

// 部屋詳細ページ
export default function RoomDetailPage() {
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleDataLoaded = (data: Room | null) => {
    setRoom(data);
    setError(null);
  };

  const handleError = (err: Error) => {
    setError(err);
    setRoom(null);
  };

  return (
    <div className="container mx-auto p-4">
      <RoomDetailFetch 
        onDataLoaded={handleDataLoaded}
        onError={handleError}
      />

      {room && (
        <div className="space-y-6 mb-6">
          <PropertyInfoBox room={room} />
          <RoomInfoBox room={room} />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 mb-6">
          エラーが発生しました: {error.message}
        </div>
      )}

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
    </div>
  );
} 