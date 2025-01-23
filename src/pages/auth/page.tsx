import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useAuth } from '../../hooks/use-auth';
import { getUsers } from '../../api/wordpress';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  /* デバッグ用の状態管理（一時的に非表示）
  const [debugInfo, setDebugInfo] = useState<{
    userList?: any[];
    loginAttempt?: { id: string; success: boolean };
    apiResponse?: any;
    error?: any;
  }>({});

  // ユーザーリスト取得のデバッグ用
  useEffect(() => {
    const fetchDebugUsers = async () => {
      try {
        const response = await getUsers();
        setDebugInfo(prev => ({
          ...prev,
          userList: response.data,
          apiResponse: response
        }));
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          error: error
        }));
      }
    };
    fetchDebugUsers();
  }, []);
  */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(loginId, password);
      /* デバッグ用（一時的に非表示）
      setDebugInfo(prev => ({
        ...prev,
        loginAttempt: {
          id: loginId,
          success
        }
      }));
      */

      if (success) {
        navigate('/');
      } else {
        setError('IDまたはパスワードが間違っています');
      }
    } catch (error) {
      setError('ログインに失敗しました。もう一度お試しください');
      console.error('Login error:', error);
      /* デバッグ用（一時的に非表示）
      setDebugInfo(prev => ({
        ...prev,
        error: error
      }));
      */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-4">
        <Card className="mb-4 w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              シェアハウス清掃管理システム
            </CardTitle>
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="loginId" className="text-sm font-medium">
                  ログインID
                </label>
                <Input
                  id="loginId"
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* デバッグ情報（一時的に非表示） */}
        {/* <Card className="w-full">
          <CardHeader>
            <CardTitle>デバッグ情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">APIレスポンス:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.apiResponse, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-bold mb-2">取得したユーザーリスト:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.userList, null, 2)}
                </pre>
              </div>

              {debugInfo.loginAttempt && (
                <div>
                  <h3 className="font-bold mb-2">最後のログイン試行:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(debugInfo.loginAttempt, null, 2)}
                  </pre>
                </div>
              )}

              {debugInfo.error && (
                <div>
                  <h3 className="font-bold mb-2 text-red-500">エラー情報:</h3>
                  <pre className="bg-red-50 p-4 rounded overflow-auto">
                    {JSON.stringify(debugInfo.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
} 