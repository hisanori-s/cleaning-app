import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { RoomInfoBox } from '../../../../components/room-detail/room-info-box/room-info-box';
import type { Room } from '../../../../types/room';

describe('RoomInfoBox', () => {
  const mockRoom: Room = {
    property_id: 1,
    property_name: 'シェアハウスA',
    room_number: '101',
    vacancy_date: '2024-02-01',
    cleaning_deadline: '2024-01-25',
    status: {
      'label-color': '#4CAF50',
      'label-text': '清掃待ち'
    }
  };

  it('モックデータの全フィールドが正しく表示される', () => {
    render(<RoomInfoBox room={mockRoom} />);

    // 各フィールドの表示を確認
    expect(screen.getByText('物件名')).toBeInTheDocument();
    expect(screen.getByText('シェアハウスA')).toBeInTheDocument();
    expect(screen.getByText('部屋番号')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('空室予定日')).toBeInTheDocument();
    expect(screen.getByText('2024-02-01')).toBeInTheDocument();
    expect(screen.getByText('清掃期限')).toBeInTheDocument();
    expect(screen.getByText('2024-01-25')).toBeInTheDocument();
    expect(screen.getByText('状態')).toBeInTheDocument();
    expect(screen.getByText('清掃待ち')).toBeInTheDocument();
  });

  it('必須フィールドが欠落している場合、エラーメッセージを表示', () => {
    const invalidRoom = {
      ...mockRoom,
      property_name: undefined,
      room_number: undefined
    } as unknown as Room;

    render(<RoomInfoBox room={invalidRoom} />);
    expect(screen.getByText('データの表示に問題が発生しました')).toBeInTheDocument();
  });
}); 