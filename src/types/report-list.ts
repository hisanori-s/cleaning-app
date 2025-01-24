/**
 * 清掃報告書一覧のレスポンス型
 */
export type CleaningReportListResponse = {
  message: string;
  data: CleaningReportItem[];
};

/**
 * 清掃報告書一覧の各アイテムの型
 */
export type CleaningReportItem = {
  post_id: number;
  house_id: number;
  house_name: string;
  room_number: string;
  room_id: number;
  created_date: string; // YYYY-MM-DD形式
};

/**
 * 清掃報告書一覧のUIコンポーネント用の型
 */
export type CleaningReportListProps = {
  reports: CleaningReportItem[];
  onReportClick: (reportId: number) => void;
  isLoading?: boolean;
  error?: string;
};
