/**
 * 部屋のステータスラベルを表す型
 */
export interface StatusLabel {
  color: string;
  text: string;
}

/**
 * 部屋詳細情報の型定義
 */
export interface RoomDetail {
  house_id: number;
  house_name: string;
  room_id: number;
  room_number: string;
  customer_id: string;
  moveout_date: string | '';
  vacancy_date: string | '';
  early_leave: boolean;
  status_label: StatusLabel;
  room_key: string;
  building_key: string;
  address: string;
  cleaner_note: string;
}

/**
 * 部屋詳細のレスポンス型
 */
export interface RoomDetailResponse {
  mock_room_detail: RoomDetail;
}