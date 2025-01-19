/**
 * 清掃レポートの型定義
 * 清掃作業の報告内容を表現します
 */
export interface CleaningReport {
  id: number;
  roomId: number;
  cleanerId: number;
  date: string;
  checklist: {
    floor: boolean;
    bathroom: boolean;
    kitchen: boolean;
    windows: boolean;
    furniture: boolean;
  };
  comments: string;
  images: string[];
  status: 'submitted' | 'approved' | 'rejected';
} 