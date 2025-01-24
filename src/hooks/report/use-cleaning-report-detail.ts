import { useState, useEffect } from 'react';
import { getCleaningReportDetail } from '../../api/wordpress';
import type { CleaningReportDetail } from '../../types/report-detail';

interface UseCleaningReportDetailResult {
  report: CleaningReportDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 清掃レポート詳細を取得するカスタムフック
 * @param reportId 清掃レポートID
 */
export const useCleaningReportDetail = (reportId: number): UseCleaningReportDetailResult => {
  const [report, setReport] = useState<CleaningReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCleaningReportDetail(reportId);
      if (response.data) {
        setReport(response.data);
      } else {
        setReport(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '清掃レポートの取得に失敗しました');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  return {
    report,
    isLoading,
    error,
    refetch: fetchReport
  };
}; 