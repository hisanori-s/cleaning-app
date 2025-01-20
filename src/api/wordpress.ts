import { User, RoomDetail, CleaningReport, ApiResponse } from '../types/index';
import roomDetailMock from '../__tests__/mocks/api/room-detail.json';

// エンドポイントの型
// fetch('https://your-site.com/wp-json/cleaning-management/v1/users', {
//   headers: {
//       'Authorization': 'Bearer your-secret-here'  // ここにシークレットを含める
//   }
// })


const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_MOCK = IS_DEVELOPMENT || import.meta.env.VITE_USE_MOCK === 'true';

/**
 * APIエラーを表現するカスタムエラークラス
 */
class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * モックデータプロバイダーのインターフェース
 */
interface MockDataProvider {
  getRoomDetail: (propertyId: number, roomNumber: string) => ApiResponse<RoomDetail>;
  getRooms: () => ApiResponse<RoomDetail[]>;
}

/**
 * デフォルトのモックデータプロバイダー
 */
const defaultMockProvider: MockDataProvider = {
  getRoomDetail: (propertyId: number, roomNumber: string) => ({
    success: true,
    data: roomDetailMock.mock_room_detail
  }),
  getRooms: () => ({
    success: true,
    data: [roomDetailMock.mock_room_detail]
  })
};

interface LoginCredentials {
  username: string;
  password: string;
}

class WordPressApiClient {
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse<{ token: string; user: User }>(response);
      this.token = data.data?.token || null;
      return {
        success: true,
        data: data.data?.user
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Login failed',
        'LOGIN_ERROR',
        500
      );
    }
  }

  async logout(): Promise<void> {
    if (!this.token) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.warn('Logout failed:', error);
    } finally {
      this.token = null;
    }
  }

  async getRooms(): Promise<ApiResponse<RoomDetail[]>> {
    if (IS_MOCK) {
      return defaultMockProvider.getRooms();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse<RoomDetail[]>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to fetch rooms',
        'FETCH_ERROR',
        500
      );
    }
  }

  async getRoom(propertyId: number, roomNumber: string): Promise<ApiResponse<RoomDetail>> {
    if (IS_MOCK) {
      return defaultMockProvider.getRoomDetail(propertyId, roomNumber);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${propertyId}/${roomNumber}`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse<RoomDetail>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to fetch room details',
        'FETCH_ERROR',
        500
      );
    }
  }

  async submitReport(report: Omit<CleaningReport, 'id'>): Promise<ApiResponse<CleaningReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(report),
      });
      return this.handleResponse<CleaningReport>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to submit report',
        'SUBMIT_ERROR',
        500
      );
    }
  }

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/media`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: formData,
      });
      return this.handleResponse<{ url: string }>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to upload image',
        'UPLOAD_ERROR',
        500
      );
    }
  }

  private getHeaders(isFormData = false): HeadersInit {
    if (!this.token) {
      throw new ApiError(
        'Authentication token is missing',
        'AUTH_REQUIRED',
        401
      );
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${this.token}`,
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        code: 'UNKNOWN_ERROR',
        message: response.statusText
      }));

      throw new ApiError(
        errorData.message || 'API request failed',
        errorData.code || 'API_ERROR',
        response.status
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T
    };
  }
}

const client = new WordPressApiClient();

// APIメソッドのエクスポート
export const login = (credentials: LoginCredentials) => client.login(credentials);
export const logout = () => client.logout();
export const getRooms = () => client.getRooms();
export const getRoomDetails = (propertyId: number, roomNumber: string) => client.getRoom(propertyId, roomNumber);
export const uploadReport = (report: Omit<CleaningReport, 'id'>) => client.submitReport(report);
export const uploadImage = (file: File) => client.uploadImage(file);
export const getRoomCleaningHistory = async (roomId: number) => {
  // 履歴取得のメソッドを実装
  return [];
};