/**
 * 部屋の情報を表す型
 * 使用箇所:
 * - src/pages/dashboard/page.tsx (部屋一覧の表示)
 * - src/pages/rooms/[id]/page.tsx (部屋詳細の表示)
 * - src/components/dashboard/room-list-box/room-list-box.tsx (部屋リストの表示)
 * - src/components/room-detail/property-info-box/property-info-box.tsx (物件情報の表示)
 * - src/components/room-detail/room-info-box/room-info-box.tsx (部屋情報の表示)
 */
export type Room = {
    id: number;
    name: string;
    floor: number;
    status: 'clean' | 'dirty' | 'in_progress';
    lastCleaned: string;
    assignedCleaners: number[];
    images: string[];
};

/**
 * ユーザー情報を表す型
 * 使用箇所:
 * - src/hooks/use-auth.tsx (認証状態の管理)
 * - src/app.tsx (ユーザーメニューの表示)
 */
export type User = {
    id: number;
    username: string;
    email: string;
    role: 'cleaner';
    assigned_rooms: number[];
};

export interface CleaningReport {
  id: number;
  roomId: number;
  cleanerId: number;
  date: string;
  checklist: {
    floor: boolean;
    bathroom: boolean;
    kitchen: boolean;
    windows: boolean;
    furniture: boolean;
  };
  comments: string;
  images: string[];
  status: 'submitted' | 'approved' | 'rejected';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 基本的な型定義のエクスポート
export * from './room';
export * from './room-detail';
export * from './user';
export * from './cleaning-report';
export * from './api';

// レスポンス型の定義
export type LoginResponse = ApiResponse<{
  token: string;
  user: User;
}>;

export type RoomListResponse = ApiResponse<PaginatedResponse<Room>>;

export type ReportSubmitResponse = ApiResponse<{
  report: CleaningReport;
}>;