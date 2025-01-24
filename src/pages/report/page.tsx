// 作成済み報告書一覧を確認できるページ
// 表示のみで、基本的にビジネスロジックは持たせない。

// 機能としては
// ページ読み込み時に対象ユーザーに紐づけられた報告書を一覧で表示し、詳細を見たいレポートはクリックでSPAのように表示切替。
// 対象のレポート情報の取得はクリック時にAPIを叩いて取得。

// ロード時はローディングアニメーションを利用
{/* <Card className="p-6">
<div className="flex flex-col items-center justify-center">
  <video autoPlay loop muted className="w-16 h-16">
    <source src="/loading.webm" type="video/webm" />
  </video>
  <p className="mt-4 text-gray-500">読み込み中...</p>
</div>
</Card> */}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCleaningReports } from '../../hooks/report/use-cleaning-reports';
import { ReportList } from '../../components/report/report-list';
import { ReportDetail } from '../../components/report/report-detail';
import { Card, CardContent } from '@/components/ui/card';

/**
 * 清掃報告書ページ
 */
export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { reports, isLoading, error } = useCleaningReports();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const handleReportClick = (reportId: number) => {
    setSelectedReportId(reportId);
  };

  const handleBackClick = () => {
    setSelectedReportId(null);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">清掃報告書一覧</h1>

      {/* 開発用デバッグ情報 - 後で削除 */}
      <Card className="mb-6 bg-gray-50">
        <CardContent className="p-4">
          <h2 className="font-bold mb-2">デバッグ情報</h2>
          <div className="space-y-2 text-sm font-mono">
            <p>API URL: {import.meta.env.VITE_WP_API_BASE_URL}{import.meta.env.VITE_WP_API_CLEANING_REPORT_LIST_ENDPOINT}</p>
            <p>Loading: {isLoading ? 'true' : 'false'}</p>
            <p>Error: {error || 'なし'}</p>
            <details>
              <summary>レスポンスデータ</summary>
              <pre className="mt-2 p-2 bg-white rounded">
                {JSON.stringify(reports, null, 2)}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>
      {/* 開発用デバッグ情報ここまで */}

      {selectedReportId ? (
        <ReportDetail
          reportId={selectedReportId}
          onBackClick={handleBackClick}
          onDashboardClick={handleDashboardClick}
        />
      ) : (
        <ReportList
          reports={reports}
          onReportClick={handleReportClick}
          isLoading={isLoading}
          error={error || undefined}
        />
      )}
    </div>
  );
};