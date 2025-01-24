import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Home } from 'lucide-react';

type ReportDetailProps = {
  reportId: number;
  onBackClick: () => void;
  onDashboardClick: () => void;
};

/**
 * 清掃報告書詳細を表示するコンポーネント（プレースホルダー）
 */
export const ReportDetail: React.FC<ReportDetailProps> = ({
  reportId,
  onBackClick,
  onDashboardClick
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>清掃報告書詳細</CardTitle>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDashboardClick}
          >
            <Home className="mr-2 h-4 w-4" />
            ダッシュボードに戻る
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center p-8 text-gray-500">
          <p className="text-lg">報告書ID: {reportId}</p>
          <p className="mt-4">ここに報告書の詳細が表示されます</p>
        </div>
      </CardContent>
    </Card>
  );
};
