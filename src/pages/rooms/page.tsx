import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { PropertyInfoBox, RoomInfoBox } from '../../components/room-detail/room-info-box/room-info-box';
import { useRoomDetail } from '../../hooks/room-detail/useRoomDetail';
import { Card } from '../../components/ui/card';

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
      <div className="space-y-6 mb-6">
        {isLoading && (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center">
              <video autoPlay loop muted className="w-16 h-16">
                <source src="/loading.webm" type="video/webm" />
              </video>
              <p className="mt-4 text-gray-500">読み込み中...</p>
            </div>
          </Card>
        )}
        {error && (
          <Card className="p-6">
            <div className="text-center text-red-500">
              {error.message || 'エラーが発生しました'}
            </div>
          </Card>
        )}
        {!isLoading && !error && !room && (
          <Card className="p-6">
            <div className="text-center text-gray-500">
              部屋情報が見つかりませんでした
            </div>
          </Card>
        )}
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