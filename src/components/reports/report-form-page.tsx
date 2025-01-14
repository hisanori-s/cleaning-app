import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { uploadReport, uploadImage } from '../../api/wordpress';

const CLEANING_ITEMS = [
  { id: 'floor', label: '床清掃' },
  { id: 'bathroom', label: '浴室清掃' },
  { id: 'kitchen', label: 'キッチン清掃' },
  { id: 'toilet', label: 'トイレ清掃' },
  { id: 'common', label: '共用部清掃' },
];

export const ReportFormPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm({
    defaultValues: {
      cleaningItems: {},
      comment: '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const imageUrls = await Promise.all(
        images.map(image => uploadImage(image))
      );

      await uploadReport({
        roomId,
        cleaningItems: data.cleaningItems,
        comment: data.comment,
        images: imageUrls,
      });

      navigate(`/reports/complete`);
    } catch (error) {
      console.error('Report submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">清掃報告書作成</h1>
      
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">清掃チェックリスト</h2>
            {CLEANING_ITEMS.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  {...form.register(`cleaningItems.${item.id}`)}
                />
                <label>{item.label}</label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">コメント</h2>
            <Input
              as="textarea"
              rows={4}
              placeholder="特記事項があればご記入ください"
              {...form.register('comment')}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">画像アップロード</h2>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
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
};

export default ReportFormPage;