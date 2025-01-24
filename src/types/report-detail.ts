/**
 * 画像情報の型定義
 */
export interface ImageInfo {
  url: string;
  note: string;
}

/**
 * ビフォーアフター画像ペアの型定義
 */
export interface ComparisonImage {
  before: ImageInfo | null;
  after: ImageInfo | null;
}

/**
 * 清掃レポート詳細のレスポンス型定義
 */
export interface CleaningReportDetail {
  post_id: number;
  house_id: number;
  house_name: string;
  room_id: number;
  room_number: string;
  comparison_images: ComparisonImage[];
  proposal_images: ImageInfo[];
  damage_images: ImageInfo[];
  attached_files: ImageInfo[];
  room_status: string;
  overall_note: string;
}

/**
 * 清掃レポート詳細のAPIレスポンス型定義
 */
export interface CleaningReportDetailResponse {
  message: string;
  data: CleaningReportDetail | null;
}
