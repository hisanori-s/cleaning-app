import React, { ChangeEvent } from 'react';
import { Input } from '../../ui/input';

interface ReportFormImageProps {
  onChange: (files: File[]) => void;
}

export function ReportFormImage({ onChange }: ReportFormImageProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">画像アップロード</h2>
      <Input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="cursor-pointer"
      />
      <p className="text-sm text-gray-500">
        清掃前後の写真をアップロードしてください
      </p>
    </div>
  );
} 