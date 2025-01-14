import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { uploadReport, uploadImage } from '../../api/wordpress';
import type { CleaningReport } from '../../types';

const CLEANING_ITEMS = [
  { id: 'floor', label: '床清掃' },
  { id: 'bathroom', label: '浴室清掃' },
  { id: 'kitchen', label: 'キッチン清掃' },
  { id: 'toilet', label: 'トイレ清掃' },
  { id: 'common', label: '共用部清掃' },
];

export default function ReportFormPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">清掃チェックリスト</h2>
            {CLEANING_ITEMS.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={item.id}
                  checked={checklist[item.id] || false}
                  onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label>{item.label}</label>
              </div>
            ))}
          </div>

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

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">画像アップロード</h2>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

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