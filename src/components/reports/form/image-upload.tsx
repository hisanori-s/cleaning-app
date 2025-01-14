import React from 'react';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
}

export function ImageUpload({ onChange }: ImageUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">画像アップロード</h2>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
    </div>
  );
} 