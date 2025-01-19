import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoomDetailFetch } from '../../../../components/room-detail/room-detail-fetch/room-detail-fetch';
import { getRoomDetails } from '../../../../api/wordpress';
import roomDetailMock from '../../../mocks/api/room-detail.json';
import type { RoomDetail } from '../../../../types/room-detail';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// モックの設定
vi.mock('../../../../api/wordpress');

// react-router-domのモックを設定
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// グローバルなモック関数を定義
const mockNavigate = vi.fn();

const mockGetRoomDetails = vi.mocked(getRoomDetails);

// テスト用のセッションストレージモック
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
};

describe('RoomDetailFetch', () => {
  const mockRoom: RoomDetail = roomDetailMock.mock_room_detail;

  beforeEach(() => {
    // セッションストレージのモックを設定
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
    // 各テスト前にモックをリセット
    vi.clearAllMocks();
    mockNavigate.mockReset();
  });

  it('正常系: 部屋情報を取得して表示する', async () => {
    const onDataLoaded = vi.fn();
    const onError = vi.fn();

    // APIモックの設定
    mockGetRoomDetails.mockResolvedValueOnce({
      success: true,
      data: mockRoom
    });

    render(
      <MemoryRouter>
        <RoomDetailFetch onDataLoaded={onDataLoaded} onError={onError} />
      </MemoryRouter>
    );

    // データ取得後の表示を確認
    await waitFor(() => {
      // 物件情報の確認
      expect(screen.getByText('物件情報')).toBeDefined();
      expect(screen.getByText('物件名:')).toBeDefined();
      expect(screen.getByText(mockRoom.property_name)).toBeDefined();
      expect(screen.getByText('物件ID:')).toBeDefined();
      expect(screen.getByText(mockRoom.property_id.toString())).toBeDefined();
      expect(screen.getByText('住所:')).toBeDefined();
      expect(screen.getByText(mockRoom.property_address)).toBeDefined();
      expect(screen.getByText('鍵情報:')).toBeDefined();
      expect(screen.getByText(`部屋: ${mockRoom.room_key_number}`)).toBeDefined();
      expect(screen.getByText(`玄関: ${mockRoom.entrance_key_number}`)).toBeDefined();

      // 部屋情報の確認
      expect(screen.getByText('部屋情報')).toBeDefined();
      expect(screen.getByText('部屋番号')).toBeDefined();
      expect(screen.getByText(mockRoom.room_number)).toBeDefined();
      expect(screen.getByText('空室予定日')).toBeDefined();
      expect(screen.getByText(mockRoom.vacancy_date)).toBeDefined();
      expect(screen.getByText('清掃期限')).toBeDefined();
      expect(screen.getByText(mockRoom.cleaning_deadline)).toBeDefined();
      expect(screen.getByText(mockRoom.status['label-text'])).toBeDefined();

      // 備考の確認
      expect(screen.getByText('備考')).toBeDefined();
      expect(screen.getByText(mockRoom.notes)).toBeDefined();
    }, { timeout: 5000 });

    // コールバックの確認
    expect(onDataLoaded).toHaveBeenCalledWith(mockRoom);
    expect(onError).not.toHaveBeenCalled();
  });

  it('異常系: APIエラー時のエラー表示', async () => {
    const onDataLoaded = vi.fn();
    const onError = vi.fn();

    // APIモックの設定
    mockGetRoomDetails.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <RoomDetailFetch onDataLoaded={onDataLoaded} onError={onError} />
      </MemoryRouter>
    );

    // エラー表示の確認
    await waitFor(() => {
      expect(screen.getByText('API error')).toBeDefined();
    }, { timeout: 5000 });

    // コールバックの確認
    expect(onDataLoaded).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('API error');
  });

  it('異常系: APIレスポンスが失敗の場合', async () => {
    // セッションストレージのモックデータを設定
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify({
      property_id: mockRoom.property_id,
      room_number: mockRoom.room_number,
      timestamp: Date.now()
    }));

    // 失敗レスポンスのモックを設定
    mockGetRoomDetails.mockResolvedValue({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '部屋が見つかりません'
      }
    });

    render(
      <MemoryRouter>
        <RoomDetailFetch />
      </MemoryRouter>
    );

    // エラー表示の確認
    await waitFor(() => {
      expect(screen.getByText('部屋情報の取得に失敗しました')).toBeDefined();
    });
  });

  it('異常系: セッション情報なしの場合はリダイレクト', () => {
    // セッションストレージが空の場合
    mockSessionStorage.getItem.mockReturnValue(null);

    render(
      <MemoryRouter>
        <RoomDetailFetch />
      </MemoryRouter>
    );

    // リダイレクトの確認
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('開発環境: デバッグ情報の表示', async () => {
    // 開発環境の設定
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // セッションストレージのモックデータを設定
    const sessionData = {
      property_id: mockRoom.property_id,
      room_number: mockRoom.room_number,
      timestamp: Date.now()
    };
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(sessionData));

    // API応答のモックを設定
    const apiResponse = {
      success: true,
      data: mockRoom
    };
    mockGetRoomDetails.mockResolvedValue(apiResponse);

    render(
      <MemoryRouter>
        <RoomDetailFetch />
      </MemoryRouter>
    );

    // デバッグ情報の表示を確認
    await waitFor(() => {
      expect(screen.getByText('デバッグ情報')).toBeDefined();
      expect(screen.getByText('セッションストレージの情報:')).toBeDefined();
      expect(screen.getByText('API レスポンス:')).toBeDefined();

      // デバッグ情報の内容を確認
      const debugInfo = screen.getAllByText(/"property_id": 1/);
      expect(debugInfo.length).toBeGreaterThan(0);
    });

    // 環境設定を元に戻す
    process.env.NODE_ENV = originalEnv;
  });
}); 