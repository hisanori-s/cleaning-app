import { useState, useEffect } from 'react';
import { getRooms } from '../../api/wordpress';
import type { RoomList } from '../../types/room-list';
import { transformRoomData } from '../../lib/dashboard/RoomList';

/**
 * 部屋一覧を取得・管理するカスタムフック
 * @param houseIds 物件IDの配列
 * @returns {Object} 部屋一覧のステートと読み込み状態
 */
export const useRoomsList = (houseIds: number[]) => {
  const [rooms, setRooms] = useState<RoomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // APIから部屋一覧を取得
        const response = await getRooms(houseIds);
        
        if (!response.success || !response.data) {
          throw new Error('Failed to fetch rooms data');
        }

        // APIレスポンスを表示用データに変換
        const transformedRooms = transformRoomData(response.data);
        setRooms(transformedRooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    if (houseIds.length > 0) {
      fetchRooms();
    } else {
      setRooms([]);
      setIsLoading(false);
    }
  }, [houseIds]);

  return {
    rooms,
    isLoading,
    error
  };
}; 