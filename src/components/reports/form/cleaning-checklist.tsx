import React from 'react';

interface CleaningItem {
  id: string;
  label: string;
}

const CLEANING_ITEMS: CleaningItem[] = [
  { id: 'floor', label: '床清掃' },
  { id: 'bathroom', label: '浴室清掃' },
  { id: 'kitchen', label: 'キッチン清掃' },
  { id: 'toilet', label: 'トイレ清掃' },
  { id: 'common', label: '共用部清掃' },
];

interface CleaningChecklistProps {
  checklist: Record<string, boolean>;
  onChange: (itemId: string, checked: boolean) => void;
}

export function CleaningChecklist({ checklist, onChange }: CleaningChecklistProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">清掃チェックリスト</h2>
      {CLEANING_ITEMS.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            name={item.id}
            checked={checklist[item.id] || false}
            onChange={(e) => onChange(item.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label>{item.label}</label>
        </div>
      ))}
    </div>
  );
} 