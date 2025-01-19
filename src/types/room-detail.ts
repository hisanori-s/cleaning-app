/**
 * 部屋詳細の状態を表す型
 */
export interface RoomDetailStatus {
  'label-color': string;
  'label-text': string;
}

/**
 * 部屋詳細情報の型定義
 * WordPressから取得する詳細な部屋情報を表現します
 */
export interface RoomDetail {
  id: number;
  property_id: number;
  property_name: string;
  property_address: string;
  room_number: string;
  vacancy_date: string;
  cleaning_deadline: string;
  room_key_number: string;
  entrance_key_number: string;
  notes: string;
  status: RoomDetailStatus;
}

/**
 * 部屋詳細のレスポンス型
 */
export interface RoomDetailResponse {
  mock_room_detail: RoomDetail;
} 