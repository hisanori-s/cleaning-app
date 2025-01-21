import { User, RoomDetail, CleaningReport, ApiResponse } from '../types/index';
import roomDetailMock from '../__tests__/mocks/api/room-detail.json';

// エンドポイントの型
// fetch('https://your-site.com/wp-json/cleaning-management/v1/users', {
//   headers: {
//       'X-API-Key': 'test123'  // APIキー認証
//   }
// })

// APIエンドポイントの設定
const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;
const API_NAMESPACE = import.meta.env.VITE_WP_API_NAMESPACE;
const API_USERS_ENDPOINT = import.meta.env.VITE_WP_API_USERS_ENDPOINT;
const API_KEY = import.meta.env.VITE_WP_API_KEY;
const AUTH_LOGIN_ENDPOINT = import.meta.env.VITE_WP_API_AUTH_LOGIN;
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

  /**
   * ログイン処理
   * @param credentials ログイン情報
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/${API_NAMESPACE}${AUTH_LOGIN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY || 'test123'
        },
        body: JSON.stringify({
          login_id: credentials.username,
          password: credentials.password
        }),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Login error:', error);
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
        headers: this.getHeaders()
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
// サンプルのAPIコールここから
async getHello(): Promise<ApiResponse<{ message: string }>> {
  const requestUrl = `${API_BASE_URL}${import.meta.env.VITE_WP_API_SAMPLE_ENDPOINT}`;
  console.log('Requesting hello from:', requestUrl);
  console.log('Using headers:', this.getHeaders()); // デバッグ用

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return await this.handleResponse<{ message: string }>(response);
  } catch (error) {
    console.error('Hello API Request failed:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to fetch hello',
      'FETCH_ERROR',
      500
    );
  }
}
// サンプルのAPIコールここまで
  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {
      'X-API-Key': API_KEY || 'test123'
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
export const getHello = () => client.getHello();
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