import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/login-page';
import RoomListPage from './components/rooms/room-list-page';
import RoomDetailPage from './components/rooms/room-detail-page';
import ReportFormPage from './components/reports/report-form-page';
import ReportCompletePage from './components/reports/report-complete-page';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/rooms" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/rooms',
    element: (
      <PrivateRoute>
        <RoomListPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/rooms/:roomId',
    element: (
      <PrivateRoute>
        <RoomDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/rooms/:roomId/report',
    element: (
      <PrivateRoute>
        <ReportFormPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/report-complete',
    element: (
      <PrivateRoute>
        <ReportCompletePage />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/rooms" replace />,
  },
]);

export function Routes() {
  return <RouterProvider router={routes} />;
}