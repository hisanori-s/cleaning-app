import { Checkbox } from '../../ui/form/checkbox';

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

interface ReportFormChecklistProps {
  checklist: Record<string, boolean>;
  onChange: (itemId: string, checked: boolean) => void;
}

export function ReportFormChecklist({ checklist, onChange }: ReportFormChecklistProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">清掃チェックリスト</h2>
      {CLEANING_ITEMS.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            id={item.id}
            checked={checklist[item.id] || false}
            onCheckedChange={(checked) => onChange(item.id, checked as boolean)}
          />
          <label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
} 