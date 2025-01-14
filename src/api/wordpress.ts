import { User, Room, CleaningReport, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_WP_API_BASE_URL;

interface LoginCredentials {
  username: string;
  password: string;
}

class WordPressApiClient {
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async logout(): Promise<void> {
    if (!this.token) return;
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    this.token = null;
  }

  async getRooms(): Promise<ApiResponse<Room[]>> {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Room[]>(response);
  }

  async getRoom(id: number): Promise<ApiResponse<Room>> {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Room>(response);
  }

  async submitReport(report: Omit<CleaningReport, 'id'>): Promise<ApiResponse<CleaningReport>> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(report),
    });
    return this.handleResponse<CleaningReport>(response);
  }

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData,
    });
    return this.handleResponse<{ url: string }>(response);
  }

  private getHeaders(isFormData = false): HeadersInit {
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
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }
}

const client = new WordPressApiClient();

// APIメソッドのエクスポート
export const login = (credentials: LoginCredentials) => client.login(credentials);
export const logout = () => client.logout();
export const getRooms = () => client.getRooms();
export const getRoomDetails = (id: number) => client.getRoom(id);
export const uploadReport = (report: Omit<CleaningReport, 'id'>) => client.submitReport(report);
export const uploadImage = (file: File) => client.uploadImage(file);
export const getRoomCleaningHistory = async (roomId: number) => {
  // 履歴取得のメソッドを実装
  return [];
};