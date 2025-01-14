import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useAuth } from '../../hooks/use-auth';

// API設定の定数
const MOCK_API_BASE_URL = import.meta.env.VITE_MOCK_API_BASE_URL;
const MOCK_API_AUTH_ENDPOINT = import.meta.env.VITE_MOCK_API_AUTH_ENDPOINT;

interface MockUser {
  id: number;
  login_id: string;
  password: string;
  username: string;
  email: string;
  role: string;
  assigned_rooms: number[];
}

interface DebugInfo {
  userList?: MockUser[];
  userListError?: any;
  attemptedLogin?: { login_id: string; password: string };
  foundUser?: MockUser | null;
  error?: any;
  loadingState?: string;
  requestUrl?: string;
  rawResponse?: string;
}

// キャッシュ関連の定数
const AUTH_CACHE_KEY = 'auth_user';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24時間

// キャッシュ操作のユーティリティ関数
const getAuthCache = () => {
  const cached = localStorage.getItem(AUTH_CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(AUTH_CACHE_KEY);
    return null;
  }

  return data;
};

const setAuthCache = (user: MockUser) => {
  localStorage.setItem(
    AUTH_CACHE_KEY,
    JSON.stringify({
      data: user,
      timestamp: Date.now(),
    })
  );
};

// APIパスを構築する関数
const getMockApiUrl = (endpoint: string) => {
  const baseUrl = MOCK_API_BASE_URL.startsWith('.') 
    ? new URL(MOCK_API_BASE_URL, window.location.href).pathname
    : MOCK_API_BASE_URL;
  return `${baseUrl}${endpoint}`;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<MockUser[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    loadingState: 'ユーザーリスト取得中...'
  });

  // コンポーネントマウント時にユーザーリストを即時取得
  useEffect(() => {
    let isMounted = true;

    const fetchUserList = async () => {
      try {
        setDebugInfo(prev => ({ 
          ...prev, 
          loadingState: 'APIリクエスト送信中...',
          requestUrl: getMockApiUrl(MOCK_API_AUTH_ENDPOINT)
        }));
        
        const apiUrl = getMockApiUrl(MOCK_API_AUTH_ENDPOINT);
        console.log('Requesting API:', apiUrl);

        const response = await fetch(apiUrl);
        if (!isMounted) return;

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Invalid content type: ${contentType}`);
        }

        const text = await response.text();
        console.log('Raw response:', text);

        try {
          const data = JSON.parse(text);
          console.log('Parsed Data:', data);

          if (data && Array.isArray(data.mock_users)) {
            setUserList(data.mock_users);
            setDebugInfo(prev => ({
              ...prev,
              userList: data.mock_users,
              loadingState: 'ユーザーリスト取得完了',
              rawResponse: text
            }));
          } else {
            throw new Error('Invalid data format: mock_users array not found');
          }
        } catch (parseError) {
          throw new Error(`JSON parse error: ${parseError.message}\nRaw text: ${text}`);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to fetch user list:', error);
        setDebugInfo(prev => ({
          ...prev,
          userListError: error,
          loadingState: 'エラーが発生しました: ' + (error instanceof Error ? error.message : String(error))
        }));
      }
    };

    fetchUserList();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = userList.find(u => u.login_id === loginId && u.password === password);
      
      setDebugInfo(prev => ({
        ...prev,
        attemptedLogin: { login_id: loginId, password },
        foundUser: user || null
      }));

      if (user) {
        setAuthCache(user);
        const success = await login(loginId, password);
        if (success) {
          navigate('/');
          return;
        }
      }

      setError('IDまたはパスワードが間違っています');
    } catch (error) {
      setError('ログインに失敗しました。もう一度お試しください');
      console.error('Login error:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: error
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <Card className="mb-4">
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
                disabled={isLoading || !userList.length}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* デバッグ情報表示（常時表示） */}
        <Card>
          <CardHeader>
            <CardTitle>デバッグ情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <h3 className="font-bold mb-2">状態:</h3>
              <pre className="mb-4">{debugInfo.loadingState}</pre>

              <h3 className="font-bold mb-2">リクエストURL:</h3>
              <pre className="mb-4">{debugInfo.requestUrl}</pre>

              <h3 className="font-bold mb-2">取得したユーザーリスト:</h3>
              <pre className="mb-4">{JSON.stringify(userList, null, 2)}</pre>
              
              {debugInfo.attemptedLogin && (
                <>
                  <h3 className="font-bold mb-2">最後のログイン試行:</h3>
                  <pre className="mb-4">{JSON.stringify(debugInfo.attemptedLogin, null, 2)}</pre>
                  
                  <h3 className="font-bold mb-2">見つかったユーザー:</h3>
                  <pre className="mb-4">{JSON.stringify(debugInfo.foundUser, null, 2)}</pre>
                </>
              )}
              
              {debugInfo.error && (
                <>
                  <h3 className="font-bold mb-2">エラー:</h3>
                  <pre>{JSON.stringify(debugInfo.error, null, 2)}</pre>
                </>
              )}

              {debugInfo.rawResponse && (
                <>
                  <h3 className="font-bold mb-2">生のレスポンス:</h3>
                  <pre>{debugInfo.rawResponse}</pre>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 