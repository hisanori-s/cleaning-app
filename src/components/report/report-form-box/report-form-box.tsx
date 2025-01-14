import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { ReportFormChecklist } from './report-form-box-checklist';
import { ReportFormImage } from './report-form-box-image';
import { Textarea } from '../../ui/form/textarea';

export interface CleaningReport {
  checklist: Record<string, boolean>;
  images: File[];
  comments: string;
  date: string;
}

export interface ReportFormBoxProps {
  onSubmit: (report: Partial<CleaningReport>) => void;
  isSubmitting?: boolean;
}

export function ReportFormBox({ onSubmit, isSubmitting = false }: ReportFormBoxProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<File[]>([]);
  const [comments, setComments] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      checklist,
      images,
      comments,
      date: new Date().toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>清掃レポート作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ReportFormChecklist
            checklist={checklist}
            onChange={(itemId: string, checked: boolean) => {
              setChecklist(prev => ({ ...prev, [itemId]: checked }));
            }}
          />

          <ReportFormImage
            onChange={setImages}
          />

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">コメント</h2>
            <Textarea
              value={comments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
              placeholder="清掃に関する特記事項があれば入力してください"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '送信中...' : 'レポートを提出'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 