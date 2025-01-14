import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../components/auth/auth-context';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 開発中は即座にログイン成功とする
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();  // 認証状態を更新
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <h1 className="text-center text-2xl font-bold">シェアハウス清掃管理システム</h1>
        <div className="text-center text-sm text-gray-600">
          開発モード: 認証バイパス中
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Button
            type="submit"
            className="w-full"
          >
            開発用ログイン
          </Button>
        </form>
      </div>
    </div>
  );
} 