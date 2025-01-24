import { useState, useEffect, useCallback } from 'react';
import { getCleaningReports } from '../../api/wordpress';
import type { CleaningReportItem } from '../../types/report-list';
import { useAuth } from '../use-auth';

/**
* 清掃報告書一覧を取得するカスタムフック
* @returns {Object} reports - 清掃報告書一覧
* @returns {boolean} isLoading - 読み込み中フラグ
* @returns {string|null} error - エラーメッセージ
* @returns {Function} refetch - データを再取得する関数
*/
export const useCleaningReports = () => {
  const [reports, setReports] = useState<CleaningReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const houseIds = user?.house_ids || [];

  /**
   * 清掃報告書一覧を取得する
   */
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCleaningReports(houseIds);
      if (response.success && response.data) {
        setReports(response.data);
      } else {
        setError('清掃報告書の取得に失敗しました');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [houseIds]);

  useEffect(() => {
    if (houseIds.length > 0) {
      fetchReports();
    } else {
      setReports([]);
      setIsLoading(false);
    }
  }, [houseIds, fetchReports]);

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports
  };
};