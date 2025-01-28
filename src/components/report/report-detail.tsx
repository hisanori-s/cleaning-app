import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useCleaningReportDetail } from '../../hooks/report/use-cleaning-report-detail';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';

type ImageInfo = {
  url: string;
  note?: string;
};

type ReportDetailProps = {
  reportId: number;
  onBackClick: () => void;
};

// Common card header component
const ReportHeader: React.FC<{ onBackClick?: () => void; disabled?: boolean }> = ({ 
  onBackClick, 
  disabled = false 
}) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>清掃報告書詳細</CardTitle>
    <div className="space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBackClick} 
        disabled={disabled}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        一覧に戻る
      </Button>
    </div>
  </CardHeader>
);

// 画像モーダルコンポーネント
const ImageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  note?: string;
}> = ({ isOpen, onClose, imageUrl, note }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // クリックされた要素がオーバーレイ自体の場合のみ閉じる
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 bg-white hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <img
          src={imageUrl}
          alt={note || '画像'}
          className="rounded-lg max-w-full max-h-[90vh] object-contain"
        />
        {note && (
          <p className="mt-2 text-sm text-white text-center bg-black bg-opacity-50 p-2 rounded">
            {note}
          </p>
        )}
      </div>
    </div>
  );
};

// Image display component
const ImageDisplay: React.FC<{
  url?: string;
  note?: string;
  placeholder?: string;
  className?: string;
}> = ({ url, note, placeholder = '画像なし', className = 'h-48' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-2">
      {url ? (
        <>
          <div
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <img
              src={url}
              alt={note || placeholder}
              className={`w-full ${className} object-cover rounded-lg`}
            />
            {note && <p className="text-sm text-gray-500">{note}</p>}
          </div>
          <ImageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            imageUrl={url}
            note={note}
          />
        </>
      ) : (
        <div className={`w-full ${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
          <p className="text-gray-400">{placeholder}</p>
        </div>
      )}
    </div>
  );
};

// Section header component
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
);

// Before/After comparison component
const ComparisonImages: React.FC<{
  comparison: {
    before: ImageInfo | null;
    after: ImageInfo | null;
  };
}> = ({ comparison }) => (
  <div className="grid grid-cols-2 gap-4">
    <ImageDisplay 
      url={comparison.before?.url} 
      note={comparison.before?.note} 
    />
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-white rounded-full p-2 shadow-md">
          <ArrowRight className="h-6 w-6 text-blue-500" />
        </div>
      </div>
      <ImageDisplay 
        url={comparison.after?.url} 
        note={comparison.after?.note} 
      />
    </div>
  </div>
);

export const ReportDetail: React.FC<ReportDetailProps> = ({
  reportId,
  onBackClick
}) => {
  const { report, isLoading, error } = useCleaningReportDetail(reportId);

  // ========== デバッグエリア開始 ==========
  // const debugArea = (
  //   <div className="fixed bottom-4 right-4 w-96 bg-gray-800 text-white p-4 rounded-lg opacity-90 shadow-lg overflow-auto max-h-96">
  //     <h3 className="text-lg font-bold mb-2">デバッグ情報</h3>
  //     <div className="space-y-2">
  //       <div>
  //         <p className="text-sm text-gray-300">レポートID:</p>
  //         <pre className="text-xs bg-gray-700 p-1 rounded">{reportId}</pre>
  //       </div>
  //       <div>
  //         <p className="text-sm text-gray-300">ローディング状態:</p>
  //         <pre className="text-xs bg-gray-700 p-1 rounded">{String(isLoading)}</pre>
  //       </div>
  //       <div>
  //         <p className="text-sm text-gray-300">エラー:</p>
  //         <pre className="text-xs bg-gray-700 p-1 rounded">{error || 'なし'}</pre>
  //       </div>
  //       <div>
  //         <p className="text-sm text-gray-300">レスポンスデータ:</p>
  //         <pre className="text-xs bg-gray-700 p-1 rounded overflow-auto max-h-40">
  //           {JSON.stringify(report, null, 2)}
  //         </pre>
  //       </div>
  //     </div>
  //   </div>
  // );
  // ========== デバッグエリア終了 ==========

  if (isLoading) {
    return (
      <Card className="w-full">
        <ReportHeader disabled />
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
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <ReportHeader onBackClick={onBackClick} />
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="w-full">
        <ReportHeader onBackClick={onBackClick} />
        <CardContent className="p-6">
          <div className="text-center p-8 text-gray-500">
            <p>報告書が見つかりませんでした</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <ReportHeader onBackClick={onBackClick} />
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <SectionHeader title="基本情報" />
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

            {report.comparison_images.length > 0 && (
              <div>
                <SectionHeader title="ビフォーアフター画像" />
                <div className="space-y-4">
                  {report.comparison_images.map((comparison, index) => (
                    <ComparisonImages key={index} comparison={comparison} />
                  ))}
                </div>
              </div>
            )}

            {report.proposal_images.length > 0 && (
              <div>
                <SectionHeader title="特別清掃・修繕提案" />
                <div className="grid grid-cols-3 gap-4">
                  {report.proposal_images.map((image, index) => (
                    <ImageDisplay
                      key={index}
                      url={image.url}
                      note={image.note}
                      className="h-32"
                    />
                  ))}
                </div>
              </div>
            )}

            {report.damage_images.length > 0 && (
              <div>
                <SectionHeader title="残置物/汚損・破損個所" />
                <div className="grid grid-cols-3 gap-4">
                  {report.damage_images.map((image, index) => (
                    <ImageDisplay
                      key={index}
                      url={image.url}
                      note={image.note}
                      className="h-32"
                    />
                  ))}
                </div>
              </div>
            )}

            {report.attached_files.length > 0 && (
              <div>
                <SectionHeader title="添付ファイル" />
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

            <div className="space-y-4">
              <div>
                <SectionHeader title="部屋の状態" />
                <p>{report.room_status}</p>
              </div>
              {report.overall_note && (
                <div>
                  <SectionHeader title="全体メモ" />
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

export default ReportDetail;