import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

export const ReportCompletePage = () => {
  const navigate = useNavigate();

  const handleBackToRooms = () => {
    navigate('/rooms');
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
            onClick={handleBackToRooms}
            className="w-full"
            variant="default"
          >
            部屋一覧に戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCompletePage;