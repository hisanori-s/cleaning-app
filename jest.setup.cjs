require('@testing-library/jest-dom');

// 環境変数のモック
process.env.VITE_DEV_MODE = 'true';
process.env.VITE_MOCK_API_BASE_URL = './src/__tests__/mocks/api';
process.env.VITE_MOCK_API_AUTH_ENDPOINT = '/auth.json';
process.env.VITE_WP_API_BASE_URL = 'http://localhost:5173/wp-json';
process.env.VITE_WP_API_NAMESPACE = 'cleaning-management/v1';
process.env.VITE_WP_API_AUTH_LOGIN = '/auth/login';
process.env.VITE_WP_API_ROOMS = '/rooms';
process.env.VITE_WP_API_REPORTS = '/reports'; 