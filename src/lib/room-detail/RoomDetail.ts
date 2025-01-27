import type { RoomDetail } from '../../types/room-detail';

type ApiRoomDetailData = {
  house_id: number;
  house_name: string;
  room_id: number;
  room_number: string;
  customer_id: string;
  moveout_date: string;
  vacancy_date: string;
  early_leave: boolean;
  status_label: {
    color: string;
    text: string;
  } | null;
  room_key: string;
  building_key: string;
  address: string;
  cleaner_note: string;
};

/**
 * HTMLタグを改行に変換する
 * @param text HTMLタグを含むテキスト
 * @returns 改行に変換されたテキスト
 */
const convertHtmlToText = (text: string): string => {
  return text
    //.replace(/<br\s*\/?>/gi, '\n')  // <br>タグを削除
    .replace(/<[^>]*>/g, '');       // その他のHTMLタグを削除
};

/**
 * APIレスポンスを表示用の部屋詳細情報に変換
 * @param apiData APIから取得した部屋詳細情報
 * @returns 表示用に加工された部屋詳細情報
 */
export const transformRoomDetailData = (apiData: ApiRoomDetailData): RoomDetail => {
  // 必須フィールドの存在チェック
  if (!apiData.house_id ||
    !apiData.house_name ||
    apiData.room_number === undefined ||
    apiData.room_id === undefined ||
    apiData.customer_id === undefined ||
    apiData.moveout_date === undefined ||
    apiData.vacancy_date === undefined ||
    apiData.early_leave === undefined ||
    apiData.room_key === undefined ||
    apiData.building_key === undefined ||
    !apiData.address) {
    throw new Error('必須フィールドが不足しています');
  }

  // 日付形式のバリデーション（空文字列の場合はスキップ）
  const isValidDate = (dateStr: string) => {
    if (dateStr === '') return true;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  };

  if (!isValidDate(apiData.moveout_date) || !isValidDate(apiData.vacancy_date)) {
    throw new Error('不正な日付形式です');
  }

  // デフォルトのステータスラベル
  const defaultStatusLabel = {
    color: '#808080',
    text: '未設定'
  };

  return {
    house_id: apiData.house_id,
    house_name: apiData.house_name,
    room_id: apiData.room_id,
    room_number: apiData.room_number,
    customer_id: apiData.customer_id,
    moveout_date: apiData.moveout_date,
    vacancy_date: apiData.vacancy_date,
    early_leave: apiData.early_leave,
    status_label: apiData.status_label || defaultStatusLabel,
    room_key: apiData.room_key,
    building_key: apiData.building_key,
    address: apiData.address,
    cleaner_note: apiData.cleaner_note ? convertHtmlToText(apiData.cleaner_note) : ''
  };
};