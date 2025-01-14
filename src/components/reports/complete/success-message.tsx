import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';

interface SuccessMessageProps {
  onBackClick: () => void;
}

export function SuccessMessage({ onBackClick }: SuccessMessageProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>報告完了</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-lg mb-4">
            清掃報告が正常に送信されました。
          </p>
          <p className="text-sm text-gray-600 mb-6">
            ご協力ありがとうございました。
          </p>
        </div>
        
        <Button
          onClick={onBackClick}
          className="w-full"
          variant="primary"
        >
          部屋一覧に戻る
        </Button>
      </CardContent>
    </Card>
  );
} 