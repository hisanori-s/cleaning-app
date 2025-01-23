import { User, RoomDetail, CleaningReport, ApiResponse } from '../types/index';
import type { RoomList } from '../types/room-list';
// エンドポイントの型
// fetch('https://your-site.com/wp-json/cleaning-management/v1/users', {
//   headers: {
//       'X-API-Key': 'test123'  // APIキー認証
//   }
// })


// APIエンドポイントの設定
const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;
const API_USERS_ENDPOINT = import.meta.env.VITE_WP_API_USERS_ENDPOINT;
const API_ROOMS_LIST_ENDPOINT = import.meta.env.VITE_WP_API_ROOMS_LIST_ENDPOINT;
const API_KEY = import.meta.env.VITE_WP_API_KEY;

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

class WordPressApiClient {

  /**
   * 部屋一覧を取得する
   * @param houseIds 物件IDの配列
   * @returns Promise<ApiResponse<RoomList[]>>
   */
  async getRooms(houseIds: number[]): Promise<ApiResponse<RoomList[]>> {
    const requestUrl = `${API_BASE_URL}${API_ROOMS_LIST_ENDPOINT}`;
    console.log('API Request:', {
      url: requestUrl,
      headers: this.getHeaders(),
      params: { house_ids: houseIds }
    });

    try {
      // クエリパラメータを構築
      const queryParams = houseIds.map(id => `house_ids[]=${id}`).join('&');
      const response = await fetch(`${requestUrl}?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await this.handleResponse<{ message: string; data: RoomList[] }>(response);
      console.log('API Response:', result);

      if (!result.data?.data) {
        throw new ApiError(
          '部屋情報の取得に失敗しました',
          'PARSE_ERROR',
          500
        );
      }

      return {
        success: true,
        data: result.data.data
      };
    } catch (error) {
      console.error('API Request failed:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        '部屋情報の取得に失敗しました',
        'FETCH_ERROR',
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
    console.log('API Request:', {
      url: requestUrl,
      headers: this.getHeaders()
    });

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
        'ユーザー情報の取得に失敗しました',
        'FETCH_ERROR',
        500
      );
    }
  }


  async getRoom(propertyId: number, roomNumber: string): Promise<ApiResponse<RoomDetail>> {
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
        '部屋の詳細情報の取得に失敗しました',
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
        '清掃レポートの送信に失敗しました',
        'SUBMIT_ERROR',
        500
      );
    }
  }

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

      let errorMessage = 'APIリクエストに失敗しました';
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
        data: data
      };
    } catch (error) {
      console.error('Failed to parse response:', error);
      throw new ApiError(
        'レスポンスの解析に失敗しました',
        'PARSE_ERROR',
        500
      );
    }
  }
}

const client = new WordPressApiClient();

// APIメソッドのエクスポート
export const getUsers = () => client.getUsers();
export const getRooms = (houseIds: number[]) => client.getRooms(houseIds);
export const getRoomDetails = (propertyId: number, roomNumber: string) => client.getRoom(propertyId, roomNumber);
export const uploadReport = (report: Omit<CleaningReport, 'id'>) => client.submitReport(report);