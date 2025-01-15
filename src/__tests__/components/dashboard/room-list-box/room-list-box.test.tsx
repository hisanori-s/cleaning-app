import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box';
import { BrowserRouter } from 'react-router-dom';
import type { Room } from '@/types/room';

// テストデータ
const mockRooms: Room[] = [
  {
    property_id: 1,
    property_name: 'サンプルマンション',
    room_number: '101',
    vacancy_date: '2024-01-20',
    cleaning_deadline: '2024-01-15',
    status: 'normal',
  },
  {
    property_id: 2,
    property_name: 'サンプルマンション',
    room_number: '102',
    vacancy_date: '2024-01-21',
    cleaning_deadline: '2024-01-14',
    status: 'urgent',
  },
];

// 並び順テスト用データ
const unorderedRooms: Room[] = [
  {
    property_id: 3,
    property_name: 'サンプルマンション',
    room_number: '201',
    vacancy_date: '2024-01-22',
    cleaning_deadline: '2024-01-13',
    status: 'overdue',
  },
  {
    property_id: 1,
    property_name: 'サンプルマンション',
    room_number: '101',
    vacancy_date: '2024-01-20',
    cleaning_deadline: '2024-01-15',
    status: 'normal',
  },
  {
    property_id: 2,
    property_name: 'サンプルマンション',
    room_number: '102',
    vacancy_date: '2024-01-21',
    cleaning_deadline: '2024-01-14',
    status: 'urgent',
  },
];

// テストユーティリティ
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('RoomListBox', () => {
  it('タイトルと部屋一覧が正しく表示されること', () => {
    renderWithRouter(
      <RoomListBox
        title="清掃予定の部屋"
        rooms={mockRooms}
      />
    );

    // タイトルの確認
    expect(screen.getByText('清掃予定の部屋')).toBeInTheDocument();

    // 部屋情報の確認
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('最終清掃: 2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('最終清掃: 2024-01-14')).toBeInTheDocument();
  });

  it('部屋が空の場合、何も表示されないこと', () => {
    renderWithRouter(
      <RoomListBox
        title="清掃予定の部屋"
        rooms={[]}
      />
    );

    // タイトルが表示されていないことを確認
    expect(screen.queryByText('清掃予定の部屋')).not.toBeInTheDocument();
  });

  it('タイトルの色が正しく適用されること', () => {
    renderWithRouter(
      <RoomListBox
        title="緊急清掃"
        rooms={mockRooms}
        titleColor="text-red-500"
      />
    );

    const title = screen.getByText('緊急清掃');
    expect(title).toHaveClass('text-red-500');
  });

  it('データの並び順が表示順と一致すること', () => {
    renderWithRouter(
      <RoomListBox
        title="清掃予定の部屋"
        rooms={unorderedRooms}
      />
    );

    const roomElements = screen.getAllByText(/^[0-9]{3}$/);
    expect(roomElements).toHaveLength(3);
    expect(roomElements[0]).toHaveTextContent('201');
    expect(roomElements[1]).toHaveTextContent('101');
    expect(roomElements[2]).toHaveTextContent('102');
  });

  it('不正なデータ形式の場合、エラーを発生させずにスキップすること', () => {
    // @ts-expect-error 意図的に不正なデータを渡す
    const invalidRooms: Room[] = [
      {
        property_id: 1,
        property_name: 'サンプルマンション',
        vacancy_date: '2024-01-20',
        cleaning_deadline: '2024-01-15',
        status: 'normal',
      } as Room,
      {
        property_name: 'サンプルマンション',
        room_number: '102',
        vacancy_date: '2024-01-21',
        cleaning_deadline: '2024-01-14',
        status: 'urgent',
      } as Room,
    ];

    // エラーが発生しないことを確認
    expect(() => {
      renderWithRouter(
        <RoomListBox
          title="清掃予定の部屋"
          rooms={invalidRooms}
        />
      );
    }).not.toThrow();

    // 不正なデータはスキップされ、有効なデータのみ表示されることを確認
    expect(screen.queryByText('102')).not.toBeInTheDocument();
  });

  it('ネットワークエラー時にエラーメッセージが表示されること', async () => {
    // モックエラーメッセージ
    const errorMessage = 'ネットワークエラーが発生しました';
    
    // エラーを投げるモック関数
    const mockFetchRooms = vi.fn().mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(
      <RoomListBox
        title="清掃予定の部屋"
        rooms={[]}
        onError={(error) => {
          expect(error.message).toBe(errorMessage);
        }}
      />
    );

    // エラーメッセージの表示を待機
    await waitFor(() => {
      expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument();
    });
  });
}); 