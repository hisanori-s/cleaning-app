import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageBox } from '@/components/dashboard/message-box/message-box';
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box'; // 本番データ
import { useRoomsList } from '@/hooks/dashboard/useRoomsList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';


export default function DashboardPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);

  // 本番APIから部屋一覧を取得
  const { rooms: apiRooms, isLoading, error: apiError } = useRoomsList();

  // エラーハンドリングの統合
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  const handleReportListClick = () => {
    navigate('/report');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center">
            <video autoPlay loop muted className="w-16 h-16">
              <source src="/loading.webm" type="video/webm" />
            </video>
            <p className="mt-4 text-gray-500">読み込み中...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <MessageBox
          title="エラーが発生しました"
          message={error.message}
        />
      </div>
    );
  }

  // 本番データが空の場合
  if (apiRooms.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <Card className="p-6">
          <div className="text-center text-gray-500">
            現在表示対象の部屋がありません
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ダッシュボード</h1>
        <Button
          onClick={handleReportListClick}
          className="flex items-center shadow-sm"
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          作成済み報告書一覧
        </Button>
      </div>

      <MessageBox
        title="清掃管理システムへようこそ"
        message="このダッシュボードでは、担当する部屋の清掃状況を確認できます。"
      />
      
      {/* ステータスごとの部屋一覧 */}
      <RoomListBox
        title="【このタイトルは表示されない】ステータス別部屋一覧"
        rooms={apiRooms}
        groupByStatus={true}
        onError={(error) => setError(error)}
        isLoading={isLoading}
      />

    </div>
  );
} 