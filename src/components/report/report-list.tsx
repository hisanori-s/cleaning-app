import React from 'react';
import type { CleaningReportListProps } from '../../types/report-list';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 清掃報告書一覧を表示するコンポーネント
 */
export const ReportList: React.FC<CleaningReportListProps> = ({
  reports,
  onReportClick,
  isLoading = false,
  error
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>清掃報告書が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card
          key={report.post_id}
          className="w-full hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onReportClick(report.post_id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{report.house_name}</h3>
                <p className="text-gray-600">部屋番号: {report.room_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{report.created_date}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReportClick(report.post_id);
                  }}
                >
                  詳細を見る
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};