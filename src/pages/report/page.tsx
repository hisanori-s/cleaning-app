import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportFormBox } from '../../../../components/report/report-form-box/report-form-box';
import { uploadReport, uploadImage } from '../../../../api/wordpress';
import type { CleaningReport } from '../../../../types';

export default function ReportFormPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (report: Partial<CleaningReport>) => {
    if (!roomId) return;

    try {
      setIsSubmitting(true);
      
      // 画像のアップロード
      const imageUrls = await Promise.all(
        report.images?.map(async (image) => {
          const response = await uploadImage(image);
          return response.success && response.data ? response.data.url : '';
        }) ?? []
      );

      // レポートの作成
      const cleaningReport: Omit<CleaningReport, 'id'> = {
        roomId: parseInt(roomId, 10),
        cleanerId: 1, // 開発用の固定値
        date: report.date ?? new Date().toISOString(),
        checklist: report.checklist ?? {},
        comments: report.comments ?? '',
        images: imageUrls.filter(Boolean),
        status: 'submitted',
      };

      const response = await uploadReport(cleaningReport);
      if (response.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Report submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">清掃報告書作成</h1>
      <ReportFormBox
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 