import React from 'react';
import { render, screen, waitFor, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { RoomListBox } from '@/components/dashboard/room-list-box/room-list-box';
import { BrowserRouter } from 'react-router-dom';
import type { Room, RoomListResponse } from '@/types/room';
import mockData from '@/__tests__/mocks/api/properties-rooms.json';

// モックデータの型アサーション
const typedMockData = mockData as RoomListResponse;

// テストヘルパー
interface RenderWithRouterOptions {
  title?: string;
  rooms?: Room[];
  titleColor?: string;
  onError?: (error: Error) => void;
}

const renderWithRouter = ({
  title = '清掃予定の部屋',
  rooms = typedMockData.mock_rooms_list,
  titleColor,
  onError,
}: RenderWithRouterOptions = {}): RenderResult => {
  return render(
    <BrowserRouter>
      <RoomListBox
        title={title}
        rooms={rooms}
        titleColor={titleColor}
        onError={onError}
      />
    </BrowserRouter>
  );
};

// 大量データ生成ヘルパー
const generateLargeDataset = (count: number): Room[] => {
  const statuses = [
    {
      'label-color': '#FF4444',
      'label-text': '期限超過'
    },
    {
      'label-color': '#888888',
      'label-text': '退去予定'
    },
    {
      'label-color': '#44BB44',
      'label-text': '退去済み'
    }
  ];

  return Array.from({ length: count }, (_, index) => ({
    property_id: Math.floor(index / 10) + 1,
    property_name: `シェアハウスA`,
    room_number: `${(index + 1).toString().padStart(3, '0')}`,
    vacancy_date: new Date(2024, 0, 1 + index % 30).toISOString().split('T')[0],
    cleaning_deadline: new Date(2024, 0, 8 + index % 30).toISOString().split('T')[0],
    status: statuses[index % 3]
  }));
};

// パフォーマンス測定ヘルパー
const measurePerformance = (name: string, fn: () => void): number => {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`【${name}】: ${duration}ms`);
  return duration;
};

describe('RoomListBox', () => {
  describe('正常系', () => {
    it('モックデータの全項目が正しく表示されること', () => {
      const mockRooms = [
        {
          property_id: 1,
          property_name: 'シェアハウスA',
          room_number: '101',
          vacancy_date: '2024-01-20',
          cleaning_deadline: '2024-02-01',
          status: {
            'label-color': '#FF4444',
            'label-text': '期限超過'
          }
        }
      ];

      renderWithRouter({ rooms: mockRooms });

      // 各要素が正しく表示されていることを確認
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('2024-01-20')).toBeInTheDocument();
      expect(screen.getByText('2024-02-01')).toBeInTheDocument();
      expect(screen.getByText('シェアハウスA')).toBeInTheDocument();
      expect(screen.getByText('期限超過')).toBeInTheDocument();
    });

    it('列の順序が仕様通りであること', () => {
      renderWithRouter();

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(5);
      expect(headers[0]).toHaveTextContent('退去予定日');
      expect(headers[1]).toHaveTextContent('清掃期限');
      expect(headers[2]).toHaveTextContent('物件名');
      expect(headers[3]).toHaveTextContent('部屋番号');
      expect(headers[4]).toHaveTextContent('ステータス');
    });

    it('ステータスの色とテキストが正しく適用されること', () => {
      const mockRooms = [
        {
          property_id: 1,
          property_name: 'シェアハウスA',
          room_number: '101',
          vacancy_date: '2024-01-20',
          cleaning_deadline: '2024-02-01',
          status: {
            'label-color': '#FF4444',
            'label-text': 'カスタムステータス'
          }
        }
      ];

      renderWithRouter({ rooms: mockRooms });

      const statusElement = screen.getByText('カスタムステータス');
      const statusSpan = statusElement.closest('span');
      expect(statusSpan).toHaveStyle({ color: '#FF4444' });
      expect(statusSpan).toHaveStyle({ backgroundColor: '#FF444433' });
    });

    it('タイトルの色が正しく適用されること', () => {
      const testTitle = 'テストタイトル';
      renderWithRouter({
        title: testTitle,
        titleColor: 'text-red-500',
      });

      const title = screen.getByText(testTitle);
      expect(title).toHaveClass('text-red-500');
    });
  });

  describe('異常系', () => {
    it('部屋が空の場合、何も表示されないこと', () => {
      renderWithRouter({ rooms: [] });
      expect(screen.queryByText('清掃予定の部屋')).not.toBeInTheDocument();
    });

    it('不正なデータ形式の場合、エラーを発生させずにスキップすること', () => {
      const invalidRooms = [
        {
          property_id: 1,
          property_name: 'サンプルマンション',
          room_number: '101',
          vacancy_date: '2024-01-20',
          cleaning_deadline: '2024-01-15',
          status: {
            'label-color': '#FF4444',
            'label-text': '期限超過'
          }
        },
        {
          property_id: 2,
          property_name: 'サンプルマンション',
          room_number: '102',
          vacancy_date: '2024-01-21',
          cleaning_deadline: '2024-01-14',
          status: {} // 不正なステータス
        },
      ] as unknown as Room[];

      expect(() => {
        renderWithRouter({ rooms: invalidRooms });
      }).not.toThrow();

      // 正常なデータの部屋は表示されることを確認
      expect(screen.getByText('101')).toBeInTheDocument();
      // 不正なデータを含む部屋は表示されないことを確認
      expect(screen.queryByText('102')).not.toBeInTheDocument();
    });

    it('ネットワークエラー時にエラーメッセージが表示されること', async () => {
      const errorMessage = 'ネットワークエラーが発生しました';
      
      renderWithRouter({
        rooms: [],
        onError: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('パフォーマンス', () => {
    const LARGE_DATASET_SIZE = 50;
    const RENDER_TIME_LIMIT = 500;
    const RERENDER_TIME_LIMIT = 250;
    const MEMORY_LIMIT = 50 * 1024 * 1024;

    it('大量データでも正常に表示できること', () => {
      const largeDataset = generateLargeDataset(LARGE_DATASET_SIZE);
      
      const renderTime = measurePerformance('レンダリング時間', () => {
        renderWithRouter({ rooms: largeDataset });
      });

      // 最初と最後のデータが表示されていることを確認
      expect(screen.getByText('001')).toBeInTheDocument();
      expect(screen.getByText('050')).toBeInTheDocument();
      
      // レンダリング時間が制限以内であることを確認
      expect(renderTime).toBeLessThan(RENDER_TIME_LIMIT);
    });

    it('大量データの再レンダリングが最適化されていること', () => {
      const largeDataset = generateLargeDataset(LARGE_DATASET_SIZE);
      const { rerender } = renderWithRouter({ rooms: largeDataset });

      const rerenderTime = measurePerformance('再レンダリング時間', () => {
        rerender(
          <BrowserRouter>
            <RoomListBox
              title="タイトル変更"
              rooms={largeDataset}
            />
          </BrowserRouter>
        );
      });

      // 再レンダリング時間が制限以内であることを確認
      expect(rerenderTime).toBeLessThan(RERENDER_TIME_LIMIT);
      
      // タイトルが更新されていることを確認
      expect(screen.getByText('タイトル変更')).toBeInTheDocument();
    });

    it('メモリリークが発生しないこと', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const largeDataset = generateLargeDataset(LARGE_DATASET_SIZE);
      
      // 複数回レンダリングと破棄を繰り返す
      for (let i = 0; i < 5; i++) {
        const { unmount } = renderWithRouter({ rooms: largeDataset });
        unmount();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDiff = finalMemory - initialMemory;
      
      console.log(`【メモリ使用量の変化】: ${memoryDiff / 1024 / 1024}MB`);
      
      // メモリ使用量の増加が制限以内であることを確認
      expect(memoryDiff).toBeLessThan(MEMORY_LIMIT);
    });
  });
}); 