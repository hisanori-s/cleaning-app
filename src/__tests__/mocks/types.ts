import { Room } from '@/types/room';

/**
 * 認証用のモックユーザー情報
 */
export interface MockUser {
  /** ユーザーID */
  id: number;
  /** ログインID */
  login_id: string;
  /** パスワード */
  password: string;
  /** ユーザー名 */
  username: string;
  /** メールアドレス */
  email: string;
  /** ユーザーロール */
  role: string;
  /** アクセス可能な物件ID配列 */
  allowed_properties: number[];
}

/**
 * 認証用のモックレスポンス
 */
export interface MockAuthResponse {
  mock_users: MockUser[];
}

/**
 * 部屋一覧のモックレスポンス
 */
export interface MockRoomListResponse {
  mock_rooms_list: Room[];
}

/**
 * 部屋詳細のモック情報
 */
export interface MockRoomDetail extends Room {
  /** 物件の住所 */
  property_address: string;
  /** 部屋の鍵番号 */
  room_key_number: string;
  /** エントランスの鍵番号 */
  entrance_key_number: string;
  /** 特記事項 */
  notes: string;
}

/**
 * 部屋詳細のモックレスポンス
 */
export interface MockRoomDetailResponse {
  mock_room_detail: MockRoomDetail;
}

/**
 * 清掃レポートのモック情報
 */
export interface MockCleaningReport {
  /** レポートID */
  id: number;
  /** 部屋ID */
  room_id: number;
  /** スタッフID */
  staff_id: number;
  /** 作成日時（ISO 8601形式） */
  created_at: string;
  /** 状態 */
  status: string;
  /** メッセージ */
  message: string;
}

/**
 * 清掃レポートのモックレスポンス
 */
export interface MockReportResponse {
  mock_report_response: MockCleaningReport;
} 