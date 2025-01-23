import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { PropertyInfoBox, RoomInfoBox } from '../../components/room-detail/room-info-box/room-info-box';
import { useRoomDetail } from '../../hooks/room-detail/useRoomDetail';

// 部屋詳細ページ
export default function RoomDetailPage() {
  const navigate = useNavigate();

  // セッションストレージから選択された部屋の情報を取得
  const selectedRoomInfo = JSON.parse(sessionStorage.getItem('selected_room_info') || '{}');
  const { house_id, room_number } = selectedRoomInfo;

  // 部屋詳細情報を取得
  const { room, isLoading, error } = useRoomDetail({
    propertyId: house_id,
    roomNumber: room_number
  });

  return (
    <div className="container mx-auto p-4">
      {/* ここからデバッグウィンドウ */}
      <Card className="mb-6 bg-gray-100">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">デバッグ情報</h3>
          <div className="space-y-2">
            <div>
              <p className="font-semibold">リクエストURL:</p>
              <code className="block bg-white p-2 rounded">
                {`${import.meta.env.VITE_WP_API_BASE_URL}${import.meta.env.VITE_WP_API_ROOMS_DETAIL_ENDPOINT}?house_id=${house_id}&room_number=${room_number}`}
              </code>
            </div>
            <div>
              <p className="font-semibold">APIレスポンス:</p>
              <pre className="block bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(room, null, 2)}
              </pre>
            </div>
            <div>
              <p className="font-semibold">ローディング状態:</p>
              <code className="block bg-white p-2 rounded">{isLoading ? 'true' : 'false'}</code>
            </div>
            <div>
              <p className="font-semibold">エラー:</p>
              <code className="block bg-white p-2 rounded">{error ? error.message : 'なし'}</code>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* ここまでデバッグウィンドウ */}

      <div className="space-y-6 mb-6">
        {room && (
          <>
            <PropertyInfoBox room={room} isLoading={isLoading} error={error} />
            <RoomInfoBox room={room} isLoading={isLoading} error={error} />
          </>
        )}
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
    </div>
  );
} 