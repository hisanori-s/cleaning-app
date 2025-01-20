import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
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
    console.log('=== Test Setup Start ===');
    
    const onDataLoaded = vi.fn();
    const onError = vi.fn();
    const mockRender = vi.fn(({ room }) => <div>Rendered with room data</div>);

    // セッションストレージのモックデータを設定
    const sessionData = {
      property_id: mockRoom.property_id,
      room_number: mockRoom.room_number,
      timestamp: Date.now()
    };
    console.log('Setting session storage:', sessionData);
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(sessionData));

    // APIモックの設定
    console.log('Setting up API mock');
    mockGetRoomDetails.mockImplementation(async (propertyId, roomNumber) => {
      console.log('API called with:', { propertyId, roomNumber });
      return Promise.resolve({
        success: true,
        data: mockRoom
      });
    });

    console.log('=== Component Render Start ===');
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter>
          <RoomDetailFetch 
            onDataLoaded={onDataLoaded} 
            onError={onError}
            render={({ room }) => {
              console.log('Render prop called with:', room);
              return mockRender({ room });
            }}
          />
        </MemoryRouter>
      );
    });
    console.log('=== Component Render Complete ===');

    // ローディング状態の確認
    console.log('Checking loading state...');
    try {
      const loadingElement = screen.queryByText('データを読み込んでいます...');
      console.log('Loading element found:', !!loadingElement);
    } catch (error) {
      console.error('Error finding loading element:', error);
    }

    // データ取得後の確認
    console.log('=== Waiting for Data ===');
    await waitFor(() => {
      console.log('Current mockRender calls:', mockRender.mock.calls.length);
      expect(mockRender).toHaveBeenCalledWith({ room: mockRoom });
    }, { timeout: 1000 });
    console.log('=== Data Check Complete ===');

    // コールバックの確認
    console.log('Checking callbacks...');
    expect(onDataLoaded).toHaveBeenCalledWith(mockRoom);
    expect(onError).not.toHaveBeenCalled();
    console.log('=== Test Complete ===');
  });

  it('異常系: APIエラー時のエラー表示', async () => {
    const onDataLoaded = vi.fn();
    const onError = vi.fn();
    const errorMessage = '不明なエラーが発生しました';
    const mockRender = vi.fn(() => <div>Should not be rendered</div>);

    // セッションストレージのモックデータを設定
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify({
      property_id: mockRoom.property_id,
      room_number: mockRoom.room_number,
      timestamp: Date.now()
    }));

    // APIモックの設定
    mockGetRoomDetails.mockRejectedValueOnce(new Error(errorMessage));

    await act(async () => {
      render(
        <MemoryRouter>
          <RoomDetailFetch 
            onDataLoaded={onDataLoaded} 
            onError={onError}
            render={mockRender}
          />
        </MemoryRouter>
      );
    });

    // エラー表示の確認
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // コールバックの確認
    expect(onDataLoaded).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(new Error(errorMessage));
    expect(mockRender).not.toHaveBeenCalled();
  });

  it('異常系: APIレスポンスが失敗の場合', async () => {
    // セッションストレージのモックデータを設定
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify({
      property_id: mockRoom.property_id,
      room_number: mockRoom.room_number,
      timestamp: Date.now()
    }));

    const mockRender = vi.fn(() => <div>Should not be rendered</div>);

    // 失敗レスポンスのモックを設定
    mockGetRoomDetails.mockResolvedValue({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '部屋が見つかりません'
      }
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <RoomDetailFetch render={mockRender} />
        </MemoryRouter>
      );
    });

    // エラー表示の確認
    await waitFor(() => {
      expect(screen.getByText('部屋情報の取得に失敗しました')).toBeInTheDocument();
    });

    // エラー時にrenderが呼ばれていないことを確認
    expect(mockRender).not.toHaveBeenCalled();
  });

  it('異常系: セッション情報なしの場合はリダイレクト', () => {
    // セッションストレージが空の場合
    mockSessionStorage.getItem.mockReturnValue(null);
    const mockRender = vi.fn(() => <div>Should not be rendered</div>);

    render(
      <MemoryRouter>
        <RoomDetailFetch render={mockRender} />
      </MemoryRouter>
    );

    // リダイレクトの確認
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockRender).not.toHaveBeenCalled();
  });
}); 