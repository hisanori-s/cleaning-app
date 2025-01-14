import { Card, CardContent } from '../../ui/card';

export interface MessageBoxProps {
  title: string;
  message: string;
}

export function MessageBox({ title, message }: MessageBoxProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 