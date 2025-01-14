import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import type { CleaningReport } from '../../../types';

interface CleaningHistoryProps {
  history: CleaningReport[];
}

export function CleaningHistory({ history }: CleaningHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>清掃履歴</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="border-b pb-4">
              <p className="font-semibold">{entry.date}</p>
              <p>清掃者: {entry.cleanerId}</p>
              <p>{entry.comments}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 