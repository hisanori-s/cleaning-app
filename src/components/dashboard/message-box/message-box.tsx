import { Card, CardContent } from '../../ui/card';

export interface MessageBoxProps {
  title: string;
  message: React.ReactNode;
}

export function MessageBox({ title, message }: MessageBoxProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 