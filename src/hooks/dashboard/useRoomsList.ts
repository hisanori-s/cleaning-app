import { useState, useEffect } from 'react';
import { getRooms } from '../../api/wordpress';
import type { RoomList } from '../../types/room-list';
import { useAuth } from '../use-auth';

/**
 * 部屋一覧を取得・管理するカスタムフック
 * @returns {Object} 部屋一覧のステートと読み込み状態
 */
export const useRoomsList = () => {
  const [rooms, setRooms] = useState<RoomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 認証情報から担当物件IDを取得
  const { user } = useAuth();
  const houseIds = user?.house_ids || [];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // APIから部屋一覧を取得
        const response = await getRooms(houseIds);
        
        if (!response.success || !response.data) {
          throw new Error('部屋情報の取得に失敗しました');
        }

        // APIレスポンスをそのまま使用
        setRooms(response.data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err instanceof Error ? err : new Error('部屋情報の取得中にエラーが発生しました'));
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