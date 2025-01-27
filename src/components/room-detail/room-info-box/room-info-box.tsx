import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import type { RoomDetail } from '../../../types/room-detail';
import { Skeleton } from '../../ui/skeleton';
import { useAuth } from '../../../hooks/use-auth';

interface RoomInfoBoxProps {
  room: RoomDetail;
  isLoading?: boolean;
  error?: Error | null;
}

// 共通のラベルスタイル
const LABEL_BASE_STYLE = 'px-2 py-1 rounded-full text-sm';

// エラー表示コンポーネント
const ErrorDisplay = ({ error }: { error: Error }) => (
  <Card>
    <CardContent className="text-center text-red-500 py-4">
      {error.message || 'エラーが発生しました'}
    </CardContent>
  </Card>
);

// ローディング表示コンポーネント
const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardContent>
  </Card>
);

// 清掃担当者メモコンポーネント
const CleanerNoteCard = ({ note }: { note: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>伝達事項（物件単位）</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="whitespace-pre-wrap">{note}</p>
    </CardContent>
  </Card>
);

// アクションボタンコンポーネント
const ActionButtons = ({ room }: { room: RoomDetail }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const generateReportUrl = () => {
    const baseUrl = import.meta.env.VITE_WP_REPORT_ENTRY_URL;
    
    const params = new URLSearchParams({
      user_id: user?.user_id?.toString() || '0',
      house_id: room?.house_id?.toString() || '0',
      room_id: room?.room_id?.toString() || '0',
      room_number: room?.room_number || '',
      customer_id: room?.customer_id?.toString() || '0'
    });

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex justify-end space-x-4 mt-6">
      <Button
        variant="outline"
        onClick={() => navigate('/')}
      >
        部屋一覧に戻る
      </Button>
      <Button asChild>
        <a
          href={generateReportUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          清掃報告を作成
        </a>
      </Button>
    </div>
  );
};

export function PropertyInfoBox({ room, isLoading, error }: RoomInfoBoxProps) {
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 必須フィールドの存在チェック
  if (!room.house_name || !room.address) {
    return (
      <Card>
        <CardContent className="text-center text-red-500 py-4">
          データの表示に問題が発生しました
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>物件情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">物件名:</p>
              <p>{room.house_name}</p>
            </div>
            <div>
              <p className="font-semibold">物件ID:</p>
              <p>{room.house_id}</p>
            </div>
            <div>
              <p className="font-semibold">住所:</p>
              <p>{room.address}</p>
            </div>
            <div>
              <p className="font-semibold">鍵情報:</p>
              <p>部屋: {room.room_key}</p>
              <p>玄関: {room.building_key}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {room.cleaner_note && <CleanerNoteCard note={room.cleaner_note} />}
    </>
  );
}

export function RoomInfoBox({ room, isLoading, error }: RoomInfoBoxProps) {
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 必須フィールドの存在チェック
  if (!room.room_number || !room.moveout_date || !room.vacancy_date) {
    return (
      <Card>
        <CardContent className="text-center text-red-500 py-4">
          データの表示に問題が発生しました
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>部屋情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">部屋番号:</p>
              <p>{room.room_number}</p>
            </div>
            <div>
              <p className="font-semibold">退去日:</p>
              <p>{room.moveout_date}</p>
            </div>
            <div>
              <p className="font-semibold">顧客ID:</p>
              <p>{room.customer_id}</p>
            </div>
            <div>
              <p className="font-semibold">空室予定日:</p>
              <p>{room.vacancy_date}</p>
            </div>
            <div>
              <p className="font-semibold">ステータス:</p>
              <div className="flex gap-2">
                <span
                  className={LABEL_BASE_STYLE}
                  style={{
                    color: room.status_label.color,
                    backgroundColor: `${room.status_label.color}33`
                  }}
                >
                  {room.status_label.text}
                </span>
                {room.early_leave && (
                  <span
                    className={LABEL_BASE_STYLE}
                    style={{
                      color: '#9C27B0',
                      backgroundColor: '#9C27B033'
                    }}
                  >
                    早期退去済み
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ActionButtons room={room} />
    </>
  );
}