import { useState, useEffect } from 'react';
import { getRoomDetails } from '../../api/wordpress';
import type { RoomDetail } from '../../types/room-detail';
import { transformRoomDetailData } from '../../lib/room-detail/RoomDetail';

interface UseRoomDetailProps {
  propertyId: number;
  roomNumber: string;
}

interface UseRoomDetailReturn {
  room: RoomDetail | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 部屋詳細情報を取得・管理するカスタムフック
 * @param propertyId 物件ID
 * @param roomNumber 部屋番号
 * @returns 部屋詳細情報のステートと読み込み状態
 */
export const useRoomDetail = ({ propertyId, roomNumber }: UseRoomDetailProps): UseRoomDetailReturn => {
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoomDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // APIから部屋詳細を取得
      const response = await getRoomDetails(propertyId, roomNumber);
      
      if (!response.success || !response.data) {
        throw new Error('部屋詳細情報の取得に失敗しました');
      }

      // APIレスポンスを表示用データに変換
      const transformedRoom = transformRoomDetailData(response.data);
      setRoom(transformedRoom);
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError(err instanceof Error ? err : new Error('部屋詳細情報の取得中にエラーが発生しました'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId && roomNumber) {
      fetchRoomDetail();
    } else {
      setRoom(null);
      setIsLoading(false);
    }
  }, [propertyId, roomNumber]);

  return {
    room,
    isLoading,
    error,
    refetch: fetchRoomDetail
  };
};