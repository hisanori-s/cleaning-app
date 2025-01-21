import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomDetails } from '../../../api/wordpress';
import type { RoomDetail } from '../../../types/room-detail';

interface RoomDetailFetchMockProps {
  onDataLoaded?: (room: RoomDetail | null) => void;
  onError?: (error: Error) => void;
  render: (props: { room: RoomDetail }) => React.ReactNode;
}

interface SelectedRoomInfo {
  property_id: number;
  room_number: string;
  timestamp: number;
}

// セッションストレージから選択された部屋の情報を取得
const getSelectedRoom = (): SelectedRoomInfo | null => {
  try {
    const data = sessionStorage.getItem('selected_room_info');
    if (!data) return null;
    
    const info = JSON.parse(data) as SelectedRoomInfo;
    const now = Date.now();
    // 1時間 = 3600000ミリ秒
    if (now - info.timestamp > 3600000) {
      sessionStorage.removeItem('selected_room_info');
      return null;
    }
    return info;
  } catch {
    return null;
  }
};

export function RoomDetailFetchMock({ onDataLoaded, onError, render }: RoomDetailFetchMockProps) {
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const selectedRoom = getSelectedRoom();

    if (!selectedRoom) {
      navigate('/');
      return;
    }

    const fetchRoomData = async () => {
      try {
        const roomResponse = await getRoomDetails(
          selectedRoom.property_id,
          selectedRoom.room_number
        );
        
        if (roomResponse.success && roomResponse.data) {
          setRoom(roomResponse.data);
          onDataLoaded?.(roomResponse.data);
        } else {
          setError(new Error('部屋情報の取得に失敗しました'));
          onDataLoaded?.(null);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch room data:', error);
        const errorObj = error instanceof Error ? error : new Error('不明なエラーが発生しました');
        setError(errorObj);
        onError?.(errorObj);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [navigate, onDataLoaded, onError]);

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        データを読み込んでいます...
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="text-center text-red-600">
        {error?.message || '部屋が見つかりませんでした'}
      </div>
    );
  }
  
  if (!render || typeof render !== 'function') {
    return null;  // または適切なエラーメッセージ
  }
  return <>{render({ room })}</>;
} 