/**
 * 部屋の状態を表す型
 * - urgent: 緊急（清掃期限が迫っている）
 * - normal: 通常
 * - overdue: 期限超過
 */
export type RoomStatus = 'urgent' | 'normal' | 'overdue';

/**
 * 部屋情報の型定義
 * 物件に紐づく個別の部屋情報を表現します
 */
export interface Room {
  /** 物件ID */
  property_id: number;
  /** 物件名 */
  property_name: string;
  /** 部屋番号 */
  room_number: string;
  /** 空室予定日（ISO 8601形式） */
  vacancy_date: string;
  /** 清掃期限（ISO 8601形式） */
  cleaning_deadline: string;
  /** 部屋の状態 */
  status: RoomStatus;
}

/**
 * 部屋一覧のレスポンス型
 * APIから返される部屋一覧データの形式を定義します
 */
export interface RoomListResponse {
  mock_rooms_list: Room[];
} 