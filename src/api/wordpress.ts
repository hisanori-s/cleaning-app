import { User, RoomDetail, CleaningReport, ApiResponse } from '../types/index';
import roomDetailMock from '../__tests__/mocks/api/room-detail.json';

// エンドポイントの型
// fetch('https://your-site.com/wp-json/cleaning-management/v1/users', {
//   headers: {
//       'Authorization': 'Bearer your-secret-here'  // ここにシークレットを含める
//   }
// })


const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;
const API_USERS_ENDPOINT = import.meta.env.VITE_WP_API_USERS_ENDPOINT;
const API_SECRET = import.meta.env.VITE_WP_API_SECRET;
// 開発環境判定は他の機能で必要な場合があるため残す
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

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
  getUsers: () => ApiResponse<User[]>;
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
  }),
  // ユーザー情報のモックは一時的に無効化（本番APIを使用）
  // getUsers: () => ({
  //   success: true,
  //   data: [
  //     {
  //       login_id: "sample456",
  //       password: "1234",
  //       house_ids: [3056, 13, 9600, 25],
  //       name: "サンプル業者２"
  //     },
  //     {
  //       login_id: "sample123",
  //       password: "1234",
  //       house_ids: [28570, 20861, 17924, 17124, 10, 10588],
  //       name: "サンプル業者"
  //     }
  //   ]
  // })
  // 本番APIを使用するためのダミー実装
  getUsers: () => {
    throw new Error('Mock is disabled, using production API');
  }
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
    if (IS_DEVELOPMENT) {
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
    if (IS_DEVELOPMENT) {
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

  /**
   * ユーザー情報を取得する
   * @returns Promise<ApiResponse<User[]>>
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    const requestUrl = `${API_BASE_URL}${API_USERS_ENDPOINT}`;
    console.log('Requesting users from:', requestUrl);
    console.log('Request headers:', this.getHeaders());

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });
      
      return await this.handleResponse<User[]>(response);
    } catch (error) {
      console.error('API Request failed:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to fetch users',
        'FETCH_ERROR',
        500
      );
    }
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    };
    
    // Content-Typeヘッダーの設定
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // エラーレスポンスの詳細なログ
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });

      let errorMessage = 'API request failed';
      let errorCode = 'API_ERROR';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code || errorCode;
      } catch (e) {
        console.warn('Failed to parse error response:', e);
      }

      throw new ApiError(
        errorMessage,
        errorCode,
        response.status
      );
    }

    try {
      const data = await response.json();
      return {
        success: true,
        data: data as T
      };
    } catch (error) {
      console.error('Failed to parse response:', error);
      throw new ApiError(
        'Invalid response format',
        'PARSE_ERROR',
        500
      );
    }
  }
}

const client = new WordPressApiClient();

// APIメソッドのエクスポート
export const getUsers = () => client.getUsers();
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