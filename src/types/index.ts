export interface User {
  id: number;
  username: string;
  email: string;
  role: 'cleaner' | 'admin';
  assignedRooms: number[];
}

export interface Room {
  id: number;
  name: string;
  floor: number;
  status: 'clean' | 'dirty' | 'in_progress';
  lastCleaned: string;
  assignedCleaners: number[];
  images: string[];
}

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

export type LoginResponse = ApiResponse<{
  token: string;
  user: User;
}>;

export type RoomListResponse = ApiResponse<PaginatedResponse<Room>>;

export type ReportSubmitResponse = ApiResponse<{
  report: CleaningReport;
}>;