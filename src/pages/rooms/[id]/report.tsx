import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from '../../../components/ui/form';
import { Button } from '../../../components/ui/button';
import { CleaningChecklist } from '../../../components/reports/form/cleaning-checklist';
import { ImageUpload } from '../../../components/reports/form/image-upload';
import { uploadReport, uploadImage } from '../../../api/wordpress';
import type { CleaningReport } from '../../../types';

export default function ReportFormPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState('');

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [itemId]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;

    try {
      setIsSubmitting(true);
      
      // 画像のアップロード
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const response = await uploadImage(image);
          return response.success && response.data ? response.data.url : '';
        })
      );

      // レポートの作成
      const report: Omit<CleaningReport, 'id'> = {
        roomId: parseInt(roomId, 10),
        cleanerId: 1, // 開発用の固定値
        date: new Date().toISOString(),
        checklist: {
          floor: checklist.floor || false,
          bathroom: checklist.bathroom || false,
          kitchen: checklist.kitchen || false,
          windows: checklist.windows || false,
          furniture: checklist.furniture || false,
        },
        comments,
        images: imageUrls.filter(Boolean),
        status: 'submitted',
      };

      const response = await uploadReport(report);
      if (response.success) {
        navigate('/report-complete');
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
      
      <Form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <CleaningChecklist
            checklist={checklist}
            onChange={handleChecklistChange}
          />

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">コメント</h2>
            <textarea
              name="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="特記事項があればご記入ください"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <ImageUpload onChange={setImages} />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? '送信中...' : '報告書を提出'}
          </Button>
        </div>
      </Form>
    </div>
  );
} 