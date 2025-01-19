import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { getRoomDetails } from '../../../api/wordpress';
import type { RoomDetail } from '../../../types/room-detail';
import type { ApiResponse } from '../../../types/api';
import { PropertyInfoBox } from '../property-info-box/property-info-box';
import { RoomInfoBox } from '../room-info-box/room-info-box';

interface RoomDetailFetchProps {
  onDataLoaded?: (room: RoomDetail | null) => void;
  onError?: (error: Error) => void;
}

interface SelectedRoomInfo {
  property_id: number;
  room_number: string;
  timestamp: number;
}

interface DebugInfo {
  sessionData: SelectedRoomInfo | null;
  apiResponse: ApiResponse<RoomDetail> | { error: string } | null;
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

export function RoomDetailFetch({ onDataLoaded, onError }: RoomDetailFetchProps) {
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    sessionData: null,
    apiResponse: null
  });

  useEffect(() => {
    const selectedRoom = getSelectedRoom();
    setDebugInfo(prev => ({ ...prev, sessionData: selectedRoom }));

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
        setDebugInfo(prev => ({ ...prev, apiResponse: roomResponse }));
        
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
        setDebugInfo(prev => ({ 
          ...prev, 
          apiResponse: { error: errorObj.message } 
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [navigate, onDataLoaded, onError]);

  // デバッグ情報の表示（開発環境のみ）
  const renderDebugInfo = () => (
    <Card className="mt-6 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-sm">デバッグ情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs font-mono">
        <div>
          <div className="font-bold mb-1">セッションストレージの情報:</div>
          <pre className="bg-white p-2 rounded">
            {JSON.stringify(debugInfo.sessionData, null, 2)}
          </pre>
        </div>
        <div>
          <div className="font-bold mb-1">API レスポンス:</div>
          <pre className="bg-white p-2 rounded">
            {JSON.stringify(debugInfo.apiResponse, null, 2)}
          </pre>
        </div>
        {error && (
          <div>
            <div className="font-bold mb-1 text-red-600">エラー情報:</div>
            <pre className="bg-white p-2 rounded text-red-600">
              {error.message}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        データを読み込んでいます...
      </div>
    );
  }

  if (error || !room) {
    return (
      <div>
        <div className="text-center text-red-600">
          {error?.message || '部屋が見つかりませんでした'}
        </div>
        {process.env.NODE_ENV === 'development' && renderDebugInfo()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
        ここが二重表示の根源？表示機能は不要なんですが。
      <PropertyInfoBox room={room} />
      <RoomInfoBox room={room} />
      {process.env.NODE_ENV === 'development' && renderDebugInfo()}
    </div>
  );
} 