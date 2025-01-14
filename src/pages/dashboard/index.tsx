import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getRooms } from '../../api/wordpress';
import type { Room } from '../../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await getRooms();
        if (response.success && response.data) {
          setRooms(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              データを読み込んでいます...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dirtyRooms = rooms.filter(room => room.status === 'dirty');
  const cleanRooms = rooms.filter(room => room.status === 'clean');
  const inProgressRooms = rooms.filter(room => room.status === 'in_progress');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">清掃管理システムへようこそ</h2>
            <p className="text-gray-600">
              このダッシュボードでは、担当する部屋の清掃状況を確認できます。
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* 状態概要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">要清掃</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dirtyRooms.length}</p>
            <p className="text-sm text-gray-600">部屋</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-500">清掃中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{inProgressRooms.length}</p>
            <p className="text-sm text-gray-600">部屋</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-500">清掃済み</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{cleanRooms.length}</p>
            <p className="text-sm text-gray-600">部屋</p>
          </CardContent>
        </Card>
      </div>

      {/* 要清掃の部屋一覧 */}
      {dirtyRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>要清掃の部屋</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dirtyRooms.map(room => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  <span>{room.name}</span>
                  <span className="text-sm text-gray-600">最終清掃: {room.lastCleaned}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => navigate('/rooms')}
          variant="primary"
        >
          部屋一覧を表示
        </Button>
      </div>
    </div>
  );
} 