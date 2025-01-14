import React from 'react';
import type { Room } from '../../../types';

interface RoomCardProps {
  room: Room;
  onClick: (roomId: number) => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  // ステータスに応じた背景色のクラスを設定
  const statusColorClass = {
    normal: 'bg-white',
    urgent: 'bg-yellow-50',
    overdue: 'bg-red-50'
  }[room.status];

  // ステータスに応じたバッジの色とテキストを設定
  const statusBadge = {
    normal: { color: 'bg-green-100 text-green-800', text: '通常' },
    urgent: { color: 'bg-yellow-100 text-yellow-800', text: '期限間近' },
    overdue: { color: 'bg-red-100 text-red-800', text: '期限切れ' }
  }[room.status];

  return (
    <div
      className={`${statusColorClass} border rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onClick(room.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{room.room_number}号室</h3>
        <span className={`${statusBadge.color} px-2 py-1 rounded-full text-xs font-medium`}>
          {statusBadge.text}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>{room.property_name}</p>
        <div className="border-t pt-2 space-y-1">
          <p>
            <span className="font-medium">空室予定日：</span>
            {new Date(room.vacancy_date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">清掃期限：</span>
            {new Date(room.cleaning_deadline).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 