import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Home, ArrowRight } from 'lucide-react';
import { useCleaningReportDetail } from '../../hooks/report/use-cleaning-report-detail';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';

type ReportDetailProps = {
  reportId: number;
  onBackClick: () => void;
  onDashboardClick: () => void;
};

/**
 * 清掃報告書詳細を表示するコンポーネント
 */
export const ReportDetail: React.FC<ReportDetailProps> = ({
  reportId,
  onBackClick,
  onDashboardClick
}) => {
  const { report, isLoading, error } = useCleaningReportDetail(reportId);

  // ========== デバッグエリア変数ここから ==========
  {/* const debugArea = (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-800 text-white p-4 rounded-lg opacity-90 shadow-lg overflow-auto max-h-96">
      <h3 className="text-lg font-bold mb-2">デバッグ情報</h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-300">レポートID:</p>
          <pre className="text-xs bg-gray-700 p-1 rounded">{reportId}</pre>
        </div>
        <div>
          <p className="text-sm text-gray-300">ローディング状態:</p>
          <pre className="text-xs bg-gray-700 p-1 rounded">{String(isLoading)}</pre>
        </div>
        <div>
          <p className="text-sm text-gray-300">エラー:</p>
          <pre className="text-xs bg-gray-700 p-1 rounded">{error || 'なし'}</pre>
        </div>
        <div>
          <p className="text-sm text-gray-300">レスポンスデータ:</p>
          <pre className="text-xs bg-gray-700 p-1 rounded overflow-auto max-h-40">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  ); */}
  // ========== デバッグエリア変数ここまで ==========

  if (isLoading) {
    return (
      <>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>清掃報告書詳細</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ArrowLeft className="mr-2 h-4 w-4" />
                一覧に戻る
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Home className="mr-2 h-4 w-4" />
                ダッシュボードに戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* {debugArea} */}
      </>
    );
  }

  if (error) {
    return (
      <>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>清掃報告書詳細</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={onBackClick}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                一覧に戻る
              </Button>
              <Button variant="outline" size="sm" onClick={onDashboardClick}>
                <Home className="mr-2 h-4 w-4" />
                ダッシュボードに戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        {/* {debugArea} */}
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>清掃報告書詳細</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={onBackClick}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                一覧に戻る
              </Button>
              <Button variant="outline" size="sm" onClick={onDashboardClick}>
                <Home className="mr-2 h-4 w-4" />
                ダッシュボードに戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center p-8 text-gray-500">
              <p>報告書が見つかりませんでした</p>
            </div>
          </CardContent>
        </Card>
        {/* {debugArea} */}
      </>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>清掃報告書詳細</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              一覧に戻る
            </Button>
            <Button variant="outline" size="sm" onClick={onDashboardClick}>
              <Home className="mr-2 h-4 w-4" />
              ダッシュボードに戻る
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* 基本情報 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">基本情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">物件名</p>
                  <p className="text-base">{report.house_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">部屋番号</p>
                  <p className="text-base">{report.room_number}</p>
                </div>
              </div>
            </div>

            {/* ビフォーアフター画像 */}
            {report.comparison_images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">ビフォーアフター画像</h3>
                <div className="space-y-4">
                  {report.comparison_images.map((comparison, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      {/* ビフォー画像 */}
                      <div className="space-y-2">
                        {comparison.before ? (
                          <>
                            <img
                              src={comparison.before.url}
                              alt={comparison.before.note || 'ビフォー画像'}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {comparison.before.note && (
                              <p className="text-sm text-gray-500">{comparison.before.note}</p>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">画像なし</p>
                          </div>
                        )}
                      </div>

                      {/* アフター画像 */}
                      <div className="space-y-2 relative">
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="bg-white rounded-full p-2 shadow-md">
                            <ArrowRight className="h-6 w-6 text-blue-500" />
                          </div>
                        </div>
                        {comparison.after ? (
                          <>
                            <img
                              src={comparison.after.url}
                              alt={comparison.after.note || 'アフター画像'}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {comparison.after.note && (
                              <p className="text-sm text-gray-500">{comparison.after.note}</p>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">画像なし</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 特別清掃・修繕提案画像 */}
            {report.proposal_images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">特別清掃・修繕提案</h3>
                <div className="grid grid-cols-3 gap-4">
                  {report.proposal_images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={image.url}
                        alt={image.note || '提案画像'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {image.note && (
                        <p className="text-sm text-gray-500">{image.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 残置物/汚損・破損個所画像 */}
            {report.damage_images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">残置物/汚損・破損個所</h3>
                <div className="grid grid-cols-3 gap-4">
                  {report.damage_images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={image.url}
                        alt={image.note || '破損画像'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {image.note && (
                        <p className="text-sm text-gray-500">{image.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 添付ファイル */}
            {report.attached_files.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">添付ファイル</h3>
                <div className="space-y-2">
                  {report.attached_files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {file.note || 'ファイル'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 部屋の状態と全体メモ */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">部屋の状態</h3>
                <p>{report.room_status}</p>
              </div>
              {report.overall_note && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">全体メモ</h3>
                  <p className="whitespace-pre-wrap">{report.overall_note}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* {debugArea} */}
    </>
  );
};
