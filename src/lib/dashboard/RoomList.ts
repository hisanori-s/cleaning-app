import type { RoomList } from '../../types/room-list';
import type { ApiResponse } from '../../types/api';

type ApiRoomData = {
  house_id: number;
  house_name: string;
  room_number: string;
  moveout_date: string;
  vacancy_date: string;
  early_leave: boolean;
  status_label: {
    color: string;
    text: string;
  };
};

/**
 * APIレスポンスを表示用の部屋情報に変換
 * @param apiData APIから取得した部屋情報の配列
 * @returns 表示用に加工された部屋情報の配列
 */
export const transformRoomData = (apiData: ApiRoomData[]): RoomList[] => {
  return apiData.map(room => ({
    house_id: room.house_id,
    house_name: room.house_name,
    room_number: room.room_number,
    moveout_date: room.moveout_date,
    vacancy_date: room.vacancy_date,
    early_leave: room.early_leave,
    'status-label': {
      color: room.status_label.color,
      text: room.status_label.text
    }
  }));
}; 