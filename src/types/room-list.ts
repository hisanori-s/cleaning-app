/**
 * 部屋のステータスラベルを表す型
 */
export interface RoomStatusLabel {
  color: string;  // HEXカラーコード
  text: string;   // 表示テキスト
}

/**
 * 部屋情報の型定義
 * 物件に紐づく個別の部屋情報を表現します
 */
export interface RoomList {
  /** 物件ID */
  house_id: number;
  /** 物件名 */
  house_name: string;
  /** 部屋番号 */
  room_number: string;
  /** 退去日（ISO 8601形式） */
  moveout_date: string;
  /** 空室予定日（ISO 8601形式） */
  vacancy_date: string;
  /** 早期退去フラグ */
  early_leave: boolean;
  /** 部屋のステータスラベル */
  'status-label': RoomStatusLabel;
}

/**
 * 部屋一覧のレスポンス型
 * APIから返される部屋一覧データの形式を定義します
 */
export interface RoomListResponse {
  mock_rooms_list: RoomList[];
} 